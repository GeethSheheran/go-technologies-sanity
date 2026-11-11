import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createJourneyWorld } from "./journey-world-scene";

export function mountJourneyWorld(host: HTMLDivElement) {
  gsap.registerPlugin(ScrollTrigger);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0xf5f7f1, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 80);
  camera.position.set(10, 9, 12);
  camera.lookAt(0, 0.2, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb5c2ac, 1.8));
  const sun = new THREE.DirectionalLight(0xfff7e5, 2.8);
  sun.position.set(-5, 10, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -9,
    right: 9,
    top: 8,
    bottom: -8,
    near: 0.5,
    far: 30,
  });
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0003;
  scene.add(sun);
  const model = createJourneyWorld();
  scene.add(model.world);
  const floorGeometry = new THREE.PlaneGeometry(60, 60);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.13 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    build: 0,
    travel: 0,
    turn: 0,
    drag: 0,
    tilt: 0,
    reveal: preference.matches
      ? 1
      : Number(host.closest<HTMLElement>(".hero-visual")?.dataset.reveal ?? 0),
    focusX: 0,
    focusZ: 0,
  };
  let disposed = false,
    visible = false,
    entered = false,
    contextLost = false,
    frame = 0;
  let travel: gsap.core.Tween | undefined;
  let build: gsap.core.Tween | undefined;
  let scrollMotion: gsap.core.Tween | undefined;
  const context = gsap.context(() => {});

  const render = () => {
    if (disposed || !visible || document.hidden || contextLost || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (disposed || !visible || document.hidden || contextLost) return;
      model.assemble(state.build);
      model.drive(state.travel);
      model.world.rotation.y = state.turn + state.drag;
      model.world.rotation.x = state.tilt;
      camera.position.set(10 + state.focusX, 9, 12 + state.focusZ);
      camera.lookAt(state.focusX, 0.2, state.focusZ);
      camera.zoom = THREE.MathUtils.lerp(1.75, 1, state.reveal);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
  };
  const heroReveal = (event: Event) => {
    state.reveal = preference.matches
      ? 1
      : THREE.MathUtils.clamp((event as CustomEvent<number>).detail, 0, 1);
    render();
  };
  window.addEventListener("gotech:hero-reveal", heroReveal);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    const aspect = width / height;
    const span = Math.max(9.8, 16.8 / aspect);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.updateProjectionMatrix();
    render();
  };
  let routeLength = model.routeLength;
  const playJourney = () => {
    travel?.kill();
    state.travel = preference.matches ? 1 : 0;
    if (!preference.matches && !disposed) {
      travel = gsap.to(state, {
        travel: 1,
        duration: routeLength / 1.15,
        delay: state.build < 1 ? 1.2 : 0,
        ease: "none",
        onUpdate: render,
        onComplete: () => {
          routeLength = model.nextRoute();
          playJourney();
        },
        paused: !visible || document.hidden || contextLost,
      });
    }
    render();
  };
  const reveal = () => {
    if (entered) return;
    entered = true;
    host.dataset.assembly = "building";
    context.add(() => {
      build = gsap.to(state, {
        build: 1,
        duration: preference.matches ? 0 : 1.8,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          host.dataset.assembly = "complete";
        },
      });
    });
    playJourney();
  };
  const configureScroll = () => {
    scrollMotion?.scrollTrigger?.kill();
    scrollMotion?.kill();
    if (preference.matches) {
      state.turn = 0;
      return;
    }
    context.add(() => {
      scrollMotion = gsap.to(state, {
        turn: 0.16,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: host,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9,
        },
      });
    });
  };
  configureScroll();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (entry.intersectionRatio >= 0.25) reveal();
        if (!preference.matches && !document.hidden && !contextLost) {
          travel?.resume();
          build?.resume();
        }
        render();
      } else {
        travel?.pause();
        build?.pause();
      }
    },
    { threshold: [0, 0.25] },
  );
  observer.observe(host);

  let pointer: {
    id: number;
    x: number;
    y: number;
    turn: number;
    dragging: boolean;
  } | null = null;
  const down = (event: PointerEvent) => {
    if (preference.matches || event.button !== 0) return;
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      turn: state.drag,
      dragging: false,
    };
  };
  const move = (event: PointerEvent) => {
    if (preference.matches) return;
    const bounds = host.getBoundingClientRect();
    if (pointer) {
      const dx = event.clientX - pointer.x,
        dy = event.clientY - pointer.y;
      if (!pointer.dragging && Math.abs(dy) > Math.abs(dx) + 6) {
        pointer = null;
        return;
      }
      if (Math.abs(dx) > 7) {
        pointer.dragging = true;
        host.setPointerCapture(event.pointerId);
        event.preventDefault();
        context.add(() =>
          gsap.to(state, {
            drag: THREE.MathUtils.clamp(pointer!.turn + dx * 0.003, -0.5, 0.5),
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
            onUpdate: render,
          }),
        );
      }
    } else if (event.pointerType === "mouse") {
      context.add(() =>
        gsap.to(state, {
          tilt: ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.045,
          duration: 0.65,
          overwrite: "auto",
          onUpdate: render,
        }),
      );
    }
  };
  const up = () => {
    pointer = null;
  };
  const leave = () => {
    if (pointer) return;
    context.add(() =>
      gsap.to(state, {
        tilt: 0,
        duration: 0.65,
        overwrite: "auto",
        onUpdate: render,
      }),
    );
  };
  const changeMotion = () => {
    configureScroll();
    if (preference.matches) {
      gsap.killTweensOf(state);
      travel?.kill();
      build?.kill();
      state.reveal = 1;
      state.build = 1;
      state.travel = 1;
      state.drag = 0;
      state.tilt = 0;
      host.dataset.assembly = "complete";
    } else if (entered) {
      state.reveal = Number(
        host.closest<HTMLElement>(".hero-visual")?.dataset.reveal ?? 0,
      );
      playJourney();
    }
    render();
  };
  const visibility = () => {
    if (document.hidden) {
      travel?.pause();
      build?.pause();
    } else if (visible && !preference.matches && !contextLost) {
      travel?.resume();
      build?.resume();
      render();
    }
  };
  const lostContext = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    host.dataset.render = "fallback";
    travel?.pause();
    build?.pause();
  };
  const restoredContext = () => {
    contextLost = false;
    host.dataset.render = "ready";
    visibility();
    render();
  };
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move, { passive: false });
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  host.addEventListener("pointerleave", leave);
  renderer.domElement.addEventListener("webglcontextlost", lostContext);
  renderer.domElement.addEventListener("webglcontextrestored", restoredContext);
  preference.addEventListener("change", changeMotion);
  document.addEventListener("visibilitychange", visibility);
  resize();
  host.dataset.render = "ready";

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      travel?.kill();
      context.revert();
      window.removeEventListener("gotech:hero-reveal", heroReveal);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("lostpointercapture", up);
      host.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", lostContext);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        restoredContext,
      );
      preference.removeEventListener("change", changeMotion);
      document.removeEventListener("visibilitychange", visibility);
      model.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      sun.shadow.map?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
