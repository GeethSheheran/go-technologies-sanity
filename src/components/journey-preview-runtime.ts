import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createJourneyPreviews } from "./journey-preview-scenes";

export function mountJourneyPreview(host: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.03;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const environmentRoom = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentRoom, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.35;
  environmentRoom.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aaa94, 1.7));
  const sun = new THREE.DirectionalLight(0xfff3df, 3.3);
  sun.position.set(-5, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -7,
    right: 7,
    top: 6,
    bottom: -6,
    near: 0.1,
    far: 30,
  });
  sun.shadow.normalBias = 0.025;
  scene.add(sun);
  const data = createJourneyPreviews();
  const stage = new THREE.Group();
  scene.add(stage);
  data.models.forEach(({ root }, i) => {
    root.visible = i === 0;
    stage.add(root);
  });
  const floorGeo = new THREE.PlaneGeometry(30, 30),
    floorMat = new THREE.ShadowMaterial({ opacity: 0.1 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.34;
  floor.receiveShadow = true;
  scene.add(floor);
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 60);
  camera.position.set(7, 8.1, 12);
  camera.lookAt(0, 0.25, 0);
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0,
    visible = false,
    disposed = false,
    lost = false,
    frame = 0,
    time = 0,
    last = 0,
    entry = 1;
  let pointerX = 0;
  function draw(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || lost) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (!preference.matches) time += dt;
    entry = preference.matches ? 1 : Math.min(1, entry + dt * 3.3);
    const ease = 1 - Math.pow(1 - entry, 3);
    data.models[active].root.position.y = (1 - ease) * -0.22;
    data.models[active].root.scale.setScalar(0.965 + 0.035 * ease);
    stage.rotation.y = preference.matches
      ? 0
      : THREE.MathUtils.damp(stage.rotation.y, pointerX * 0.075, 5, dt);
    data.models[active].animate(preference.matches ? 0 : time);
    renderer.render(scene, camera);
    host.dataset.ready = "true";
    if (!preference.matches) frame = requestAnimationFrame(draw);
  }
  function start() {
    if (!frame && !disposed) {
      last = 0;
      frame = requestAnimationFrame(draw);
    }
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    const aspect = width / height,
      span = Math.max(8, 11.5 / aspect);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.updateProjectionMatrix();
    start();
  }
  const observer = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else stop();
  });
  observer.observe(host);
  const dimensions = new ResizeObserver(resize);
  dimensions.observe(host);
  resize();
  function visibility() {
    if (document.hidden) stop();
    else start();
  }
  function reduced() {
    stop();
    start();
  }
  const interactionSurface = host.parentElement;
  function pointer(event: PointerEvent) {
    if (event.pointerType !== "mouse" || preference.matches) return;
    const rect = host.getBoundingClientRect();
    pointerX = THREE.MathUtils.clamp(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -1,
      1,
    );
  }
  function leave() {
    pointerX = 0;
  }
  interactionSurface?.addEventListener("pointermove", pointer, {
    passive: true,
  });
  interactionSurface?.addEventListener("pointerleave", leave);
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    stop();
    host.dataset.ready = "false";
  }
  function contextRestored() {
    lost = false;
    start();
  }
  document.addEventListener("visibilitychange", visibility);
  preference.addEventListener("change", reduced);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
  return {
    select(index: number) {
      if (index < 0 || index >= data.models.length) return;
      active = index;
      time = 0;
      entry = preference.matches ? 1 : 0;
      data.models.forEach(({ root }, i) => {
        root.visible = i === active;
      });
      host.dataset.scene = String(active);
      start();
    },
    dispose() {
      disposed = true;
      stop();
      observer.disconnect();
      dimensions.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", reduced);
      interactionSurface?.removeEventListener("pointermove", pointer);
      interactionSurface?.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      data.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete host.dataset.ready;
    },
  };
}
