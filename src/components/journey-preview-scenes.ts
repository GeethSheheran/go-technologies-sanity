import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/** Five illustrative service models. The routes are illustrative, not geographic. */
export function createJourneyPreviews() {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const material = (color: number, roughness = 0.8) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness });
    materials.add(m);
    return m;
  };
  const cream = material(0xeeeade),
    white = material(0xfaf9f1);
  const forest = material(0x163e30),
    green = material(0x53ba70),
    mint = material(0xb9d4ae);
  const glass = material(0x31595b, 0.23),
    asphalt = material(0x64786c);
  const sand = material(0xd8c5a2),
    terra = material(0xb87450);
  const leaf = material(0x376b45),
    lightLeaf = material(0x8fae65),
    bark = material(0x968060);
  const dark = material(0x28352e),
    skin = material(0xc99670),
    hair = material(0x393129);
  const water = material(0x83b8b0, 0.3),
    gold = material(0xbea060);
  const paving = material(0xd8dbcd);
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0x153e31,
    roughness: 0.24,
    metalness: 0.38,
    clearcoat: 1,
    clearcoatRoughness: 0.17,
  });
  materials.add(paint);
  function mesh(
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    geometries.add(geo);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function box(
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    r = 0.025,
  ) {
    return mesh(
      p,
      new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)),
      m,
      x,
      y,
      z,
    );
  }
  function sphere(
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    r: number,
    m: THREE.Material,
    s = [1, 1, 1],
  ) {
    const b = mesh(p, new THREE.SphereGeometry(r, 20, 14), m, x, y, z);
    b.scale.set(s[0], s[1], s[2]);
    return b;
  }
  function cylinder(
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    top: number,
    bottom: number,
    h: number,
    m: THREE.Material,
    n = 24,
  ) {
    return mesh(p, new THREE.CylinderGeometry(top, bottom, h, n), m, x, y, z);
  }
  function rod(
    p: THREE.Object3D,
    a: number[],
    b: number[],
    r: number,
    m: THREE.Material,
  ) {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      delta = end.clone().sub(start);
    const o = cylinder(p, 0, 0, 0, r, r, delta.length(), m, 10);
    o.position.copy(start.add(end).multiplyScalar(0.5));
    o.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      delta.normalize(),
    );
    return o;
  }
  function group(p: THREE.Object3D, x: number, z: number, y = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    p.add(g);
    return g;
  }
  function polygon(
    p: THREE.Object3D,
    points: number[][],
    depth: number,
    m: THREE.Material,
    y = 0,
  ) {
    const shape = new THREE.Shape();
    points.forEach(([x, z], i) =>
      i ? shape.lineTo(x, -z) : shape.moveTo(x, -z),
    );
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
    });
    geo.rotateX(-Math.PI / 2);
    return mesh(p, geo, m, 0, y, 0);
  }
  function base(root: THREE.Group) {
    box(root, 0, -0.22, 0, 8.5, 0.22, 5.7, cream, 0.055);
    box(root, 0, -0.106, 0, 8.5, 0.026, 5.7, forest, 0.01);
    box(root, 0, -0.053, 0, 8.5, 0.08, 5.7, paving, 0.03);
    for (const z of [-2.79, 2.79])
      box(root, 0, -0.004, z, 8.38, 0.012, 0.045, cream, 0.003);
    for (const x of [-4.19, 4.19])
      box(root, x, -0.004, 0, 0.045, 0.012, 5.6, cream, 0.003);
  }
  function planter(p: THREE.Object3D, x: number, z: number, w = 0.7, d = 0.4) {
    box(p, x, 0.08, z, w, 0.16, d, cream, 0.04);
    box(p, x, 0.168, z, w - 0.07, 0.025, d - 0.07, bark, 0.02);
    for (let i = 0; i < Math.ceil(w / 0.2); i++)
      sphere(
        p,
        x - w * 0.36 + i * 0.2,
        0.23,
        z,
        0.15,
        i % 2 ? leaf : lightLeaf,
        [1, 0.85, 1],
      );
  }
  function bench(p: THREE.Object3D, x: number, z: number) {
    for (const dx of [-0.3, 0.3])
      rod(p, [x + dx, 0.02, z], [x + dx, 0.25, z], 0.024, forest);
    for (const dz of [-0.1, 0, 0.1])
      box(p, x, 0.27, z + dz, 0.84, 0.035, 0.075, bark, 0.008);
    box(p, x, 0.43, z - 0.14, 0.84, 0.23, 0.04, bark, 0.01);
  }
  function tiles(
    p: THREE.Object3D,
    x: number,
    z: number,
    cols: number,
    rows: number,
  ) {
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        box(
          p,
          x + i * 0.25,
          0.004,
          z + j * 0.25,
          0.237,
          0.012,
          0.237,
          (i + j) % 3 ? cream : white,
          0.006,
        );
  }
  function palm(p: THREE.Object3D, x: number, z: number, s = 1) {
    const g = group(p, x, z);
    g.scale.setScalar(s);
    cylinder(g, 0, 0.69, 0, 0.04, 0.075, 1.38, bark, 12);
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const points = [
        new THREE.Vector3(0, 1.48, 0),
        new THREE.Vector3(Math.cos(a) * 0.36, 1.68, Math.sin(a) * 0.36),
        new THREE.Vector3(Math.cos(a) * 0.79, 1.17, Math.sin(a) * 0.79),
      ];
      const curve = new THREE.QuadraticBezierCurve3(
        ...(points as [THREE.Vector3, THREE.Vector3, THREE.Vector3]),
      );
      const vertices: number[] = [],
        indices: number[] = [];
      for (let j = 0; j <= 12; j++) {
        const t = j / 12,
          v = curve.getPoint(t),
          w = Math.sin(t * Math.PI) * 0.14;
        vertices.push(
          v.x + Math.sin(a) * w,
          v.y,
          v.z - Math.cos(a) * w,
          v.x - Math.sin(a) * w,
          v.y,
          v.z + Math.cos(a) * w,
        );
        if (j < 12) {
          const k = j * 2;
          indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      geo.setIndex(indices);
      geo.computeVertexNormals();
      leaf.side = THREE.DoubleSide;
      lightLeaf.side = THREE.DoubleSide;
      mesh(g, geo, i % 2 ? leaf : lightLeaf);
    }
  }
  function shrub(p: THREE.Object3D, x: number, z: number, s = 0.35) {
    sphere(p, x, s * 0.6, z, s, leaf, [1, 0.75, 1]);
  }
  function car(p: THREE.Object3D) {
    const g = group(p, 0, 0, 0.02);
    g.name = "chauffeur-car";
    box(g, 0, 0.22, 0, 0.64, 0.29, 1.26, paint, 0.11);
    box(g, 0, 0.42, -0.065, 0.55, 0.28, 0.65, paint, 0.1);
    box(g, 0, 0.37, 0.43, 0.52, 0.07, 0.31, paint, 0.035);
    box(g, 0, 0.45, 0.27, 0.44, 0.17, 0.025, glass, 0.03).rotation.x = -0.23;
    box(g, 0, 0.45, -0.34, 0.44, 0.14, 0.025, glass, 0.02).rotation.x = 0.18;
    for (const x of [-0.28, 0.28]) {
      box(g, x, 0.46, -0.03, 0.018, 0.16, 0.45, glass, 0.025);
      box(g, x * 1.12, 0.36, 0.24, 0.12, 0.065, 0.12, forest);
      for (const z of [-0.35, 0.35]) {
        cylinder(g, x, 0.16, z, 0.125, 0.125, 0.09, dark, 20).rotation.z =
          Math.PI / 2;
        cylinder(
          g,
          x * 1.2,
          0.16,
          z,
          0.062,
          0.062,
          0.013,
          cream,
          16,
        ).rotation.z = Math.PI / 2;
      }
    }
    for (const x of [-0.21, 0.21]) {
      box(g, x, 0.26, 0.635, 0.12, 0.045, 0.025, white, 0.012);
      box(g, x, 0.26, -0.635, 0.12, 0.045, 0.025, terra, 0.012);
    }
    box(g, 0, 0.17, 0.646, 0.24, 0.045, 0.018, cream);
    box(g, 0, 0.25, 0.635, 0.29, 0.05, 0.016, dark, 0.005);
    for (const dx of [-0.12, -0.08, -0.04, 0, 0.04, 0.08, 0.12])
      box(g, dx, 0.25, 0.647, 0.013, 0.045, 0.012, gold, 0.002);
    for (const x of [-0.29, 0.29]) {
      box(g, x, 0.35, -0.03, 0.02, 0.025, 0.43, gold, 0.006);
      box(g, x, 0.36, -0.15, 0.016, 0.027, 0.1, cream, 0.004);
      box(g, x, 0.59, -0.06, 0.024, 0.025, 0.48, forest, 0.006);
    }
    return g;
  }
  function road(
    p: THREE.Object3D,
    curve: THREE.Curve<THREE.Vector3>,
    width = 0.7,
  ) {
    function ribbon(w: number, m: THREE.Material, y: number) {
      const vertices: number[] = [],
        indices: number[] = [];
      for (let i = 0; i <= 160; i++) {
        const pt = curve.getPointAt(i / 160),
          t = curve.getTangentAt(i / 160);
        vertices.push(
          pt.x - (t.z * w) / 2,
          y,
          pt.z + (t.x * w) / 2,
          pt.x + (t.z * w) / 2,
          y,
          pt.z - (t.x * w) / 2,
        );
        if (i < 160) {
          const k = i * 2;
          indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3),
      );
      geo.setIndex(indices);
      geo.computeVertexNormals();
      mesh(p, geo, m);
    }
    ribbon(width + 0.1, cream, 0.008);
    ribbon(width, asphalt, 0.018);
    const count = Math.floor(curve.getLength() * 2.8);
    for (let i = 0; i < count; i++) {
      const pt = curve.getPointAt(i / count),
        t = curve.getTangentAt(i / count);
      const mark = box(p, pt.x, 0.028, pt.z, 0.025, 0.008, 0.12, white, 0.002);
      mark.rotation.y = Math.atan2(t.x, t.z);
    }
  }
  function oval(cx = 0, cz = 0.9, rx = 3.2, rz = 1.12) {
    return new THREE.CatmullRomCurve3(
      Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return new THREE.Vector3(
          cx + Math.cos(a) * rx,
          0,
          cz + Math.sin(a) * rz,
        );
      }),
      true,
      "centripetal",
    );
  }
  function pin(p: THREE.Object3D, x: number, z: number, color = green, s = 1) {
    const g = group(p, x, z);
    g.scale.setScalar(s);
    cylinder(g, 0, 0.28, 0, 0.16, 0, 0.35, color, 24);
    sphere(g, 0, 0.57, 0, 0.25, color, [1, 1, 0.35]);
    sphere(g, 0, 0.59, 0.083, 0.095, white, [1, 1, 0.2]);
    cylinder(g, 0, 0.035, 0, 0.19, 0.19, 0.045, cream);
    return g;
  }
  function suitcase(p: THREE.Object3D, x: number, z: number) {
    box(p, x, 0.31, z, 0.36, 0.51, 0.24, terra, 0.055);
    for (const dx of [-0.1, 0, 0.1])
      box(p, x + dx, 0.31, z + 0.124, 0.018, 0.37, 0.014, cream, 0.003);
    for (const dx of [-0.115, 0.115]) {
      sphere(p, x + dx, 0.057, z, 0.055, dark);
      rod(p, [x + dx, 0.56, z], [x + dx, 0.81, z], 0.012, dark);
    }
    box(p, x, 0.82, z, 0.25, 0.03, 0.03, dark);
  }
  function traveller(p: THREE.Object3D, x: number, z: number) {
    const g = group(p, x, z);
    g.name = "waiting-traveller";
    // Human and luggage share the architecture's scale; the canopy underside is 0.92.
    g.scale.setScalar(0.68);
    for (const dx of [-0.09, 0.09]) {
      rod(g, [dx, 0.1, 0], [dx, 0.46, 0], 0.065, sand);
      box(g, dx, 0.055, 0.045, 0.14, 0.09, 0.22, white, 0.03);
    }
    box(g, 0, 0.65, 0, 0.34, 0.4, 0.23, mint, 0.07);
    sphere(g, 0, 0.98, 0, 0.18, skin, [0.9, 1.1, 0.9]);
    sphere(g, 0, 1.1, -0.02, 0.17, hair, [1, 0.57, 1]);
    for (const dx of [-0.057, 0.057]) sphere(g, dx, 1, 0.152, 0.013, dark);
    rod(g, [-0.18, 0.79, 0], [-0.26, 0.5, 0.05], 0.055, mint);
    sphere(g, -0.26, 0.47, 0.05, 0.054, skin);
    rod(g, [0.18, 0.79, 0], [0.32, 0.68, 0.02], 0.055, mint);
    sphere(g, 0.33, 0.66, 0.02, 0.054, skin);
    suitcase(g, 0.48, 0.02);
  }
  function hotel(p: THREE.Object3D, x: number, z: number, s = 1) {
    const g = group(p, x, z);
    g.scale.setScalar(s);
    box(g, 0, 0.77, 0, 1.72, 1.54, 1.08, cream);
    box(g, 0, 1.56, 0, 1.86, 0.1, 1.2, white);
    box(g, 0, 1.63, 0, 1.6, 0.06, 0.92, mint);
    for (const x of [-0.78, 0.78]) box(g, x, 1.7, 0, 0.055, 0.18, 1.05, cream);
    for (const z of [-0.5, 0.5]) box(g, 0, 1.7, z, 1.61, 0.18, 0.055, cream);
    for (let row = 0; row < 3; row++)
      for (const dx of [-0.55, 0, 0.55]) {
        box(g, dx, 0.4 + row * 0.4, 0.553, 0.27, 0.24, 0.03, glass);
        box(g, dx, 0.27 + row * 0.4, 0.59, 0.36, 0.045, 0.16, white);
        rod(
          g,
          [dx - 0.17, 0.43 + row * 0.4, 0.66],
          [dx + 0.17, 0.43 + row * 0.4, 0.66],
          0.012,
          gold,
        );
        for (const offset of [-0.16, 0, 0.16])
          rod(
            g,
            [dx + offset, 0.3 + row * 0.4, 0.66],
            [dx + offset, 0.43 + row * 0.4, 0.66],
            0.008,
            gold,
          );
      }
    box(g, 0, 0.28, 0.58, 0.42, 0.51, 0.08, forest);
    box(g, 0, 0.72, 0.87, 1.1, 0.09, 0.67, mint);
    for (const dx of [-0.47, 0.47])
      rod(g, [dx, 0, 1.11], [dx, 0.69, 1.11], 0.025, cream);
    for (let i = 0; i < 10; i++)
      box(g, -0.49 + i * 0.108, 0.785, 0.86, 0.045, 0.055, 0.7, bark, 0.004);
    for (let row = 0; row < 3; row++)
      for (const z of [-0.3, 0.2])
        box(g, 0.868, 0.42 + row * 0.4, z, 0.025, 0.25, 0.3, glass);
    planter(g, -0.7, 0.84, 0.3, 0.3);
    planter(g, 0.7, 0.84, 0.3, 0.3);
    return g;
  }
  function home(p: THREE.Object3D, x: number, z: number) {
    const g = group(p, x, z);
    box(g, 0, 0.47, 0, 1.22, 0.94, 1.07, white);
    const roof = new THREE.Shape();
    roof.moveTo(-0.75, 0);
    roof.lineTo(0, 0.48);
    roof.lineTo(0.75, 0);
    roof.closePath();
    mesh(
      g,
      new THREE.ExtrudeGeometry(roof, { depth: 1.3, bevelEnabled: false }),
      terra,
      0,
      0.93,
      -0.65,
    );
    box(g, 0.23, 0.29, 0.55, 0.29, 0.55, 0.04, forest);
    box(g, -0.35, 0.61, 0.55, 0.35, 0.29, 0.03, glass);
    for (let i = 0; i < 8; i++)
      rod(
        g,
        [-0.66 + i * 0.19, 0.98, -0.64],
        [-0.66 + i * 0.19, 0.98, 0.65],
        0.012,
        terra,
      );
    box(g, 0.23, 0.045, 0.76, 0.48, 0.09, 0.42, cream);
    planter(g, -0.38, 0.77, 0.42, 0.25);
  }
  function airplane(p: THREE.Object3D, x: number, z: number) {
    const g = group(p, x, z, 0.29);
    g.rotation.y = -0.25;
    sphere(g, 0, 0.25, 0, 0.24, white, [1, 1, 5.2]);
    sphere(g, 0, 0.34, 0.85, 0.17, glass, [0.85, 0.5, 1]);
    polygon(
      g,
      [
        [-0.13, 0.27],
        [-1.26, -0.51],
        [-1.29, -0.73],
        [-0.12, -0.42],
        [0.12, -0.42],
        [1.29, -0.73],
        [1.26, -0.51],
        [0.13, 0.27],
      ],
      0.045,
      white,
      0.23,
    );
    polygon(
      g,
      [
        [-0.08, -0.72],
        [-0.55, -1.08],
        [-0.52, -1.2],
        [0.52, -1.2],
        [0.55, -1.08],
        [0.08, -0.72],
      ],
      0.035,
      white,
      0.3,
    );
    box(g, 0, 0.59, -0.98, 0.065, 0.59, 0.37, forest).rotation.x = -0.25;
    for (const dx of [-0.57, 0.57])
      cylinder(g, dx, 0.13, -0.17, 0.11, 0.11, 0.38, cream, 20).rotation.x =
        Math.PI / 2;
    for (const dx of [-0.23, 0.23])
      for (let i = 0; i < 9; i++)
        sphere(g, dx, 0.32, -0.66 + i * 0.15, 0.022, glass);
    for (const dx of [-0.15, 0.15]) sphere(g, dx, 0.035, 0.57, 0.07, dark);
    return g;
  }
  const models: { root: THREE.Group; animate: (t: number) => void }[] = [];
  function model() {
    const root = new THREE.Group();
    base(root);
    return root;
  }
  function driven(
    root: THREE.Group,
    route: THREE.Curve<THREE.Vector3>,
    speed = 0.035,
  ) {
    road(root, route);
    const vehicle = car(root);
    return (t: number) => {
      const u = (t * speed + 0.12) % 1,
        pt = route.getPointAt(u),
        tan = route.getTangentAt(u);
      vehicle.position.set(pt.x, 0.02, pt.z);
      vehicle.rotation.y = Math.atan2(tan.x, tan.z);
    };
  }

  // 1 — Terminal, plane on the apron, traveller and a pickup loop.
  {
    const root = model();
    box(root, -1.25, 0.63, -1.12, 3.8, 1.26, 1.16, cream);
    box(root, -1.25, 1.3, -0.98, 4.1, 0.12, 1.64, white);
    // A louvred tropical terminal canopy and inset skylights.
    for (let i = 0; i < 18; i++)
      box(
        root,
        -3.14 + i * 0.222,
        1.384,
        -0.95,
        0.035,
        0.04,
        1.54,
        bark,
        0.005,
      );
    for (const x of [-2.4, -1.2, 0])
      box(root, x, 1.406, -1.2, 0.83, 0.035, 0.64, glass, 0.015);
    tiles(root, -3.12, -0.33, 15, 2);
    box(root, -1.25, 0.66, -0.517, 3.5, 0.87, 0.03, glass);
    for (let i = 0; i < 9; i++)
      box(root, -2.93 + i * 0.42, 0.64, -0.49, 0.038, 1.02, 0.045, white);
    box(root, -1.25, 0.95, -0.12, 4.12, 0.06, 0.77, white);
    for (const x of [-3.13, -1.25, 0.63])
      rod(root, [x, 0, 0.19], [x, 0.95, 0.19], 0.035, cream);
    const tower = group(root, -3.31, -1.94);
    cylinder(tower, 0, 0.85, 0, 0.15, 0.24, 1.7, cream);
    cylinder(tower, 0, 1.75, 0, 0.39, 0.3, 0.35, glass, 8);
    cylinder(tower, 0, 1.97, 0, 0.43, 0.43, 0.09, white, 8);
    rod(tower, [0, 2, 0], [0, 2.3, 0], 0.014, forest);
    airplane(root, 2.25, -1.25);
    // Apron stand markings keep the aircraft visibly separate from the pickup lane.
    box(root, 2.13, 0.005, -1.37, 2.6, 0.012, 2.35, cream, 0.015);
    for (const x of [1.1, 3.17])
      box(root, x, 0.02, -1.36, 0.025, 0.012, 2.14, gold, 0.003);
    box(root, 2.13, 0.02, -2.42, 2.08, 0.012, 0.025, gold, 0.003);
    bench(root, -2.45, 0.07);
    planter(root, 0.29, -0.08, 0.55, 0.29);
    for (const x of [-3.08, -2.58, -2.08, -1.58, -0.08, 0.42]) {
      cylinder(root, x, 0.14, 0.2, 0.032, 0.032, 0.28, forest, 12);
      cylinder(root, x, 0.23, 0.2, 0.034, 0.034, 0.035, gold, 12);
    }
    // Glazed wayfinding panel with a simple plane pictogram.
    box(root, -1.0, 0.99, -0.08, 0.58, 0.3, 0.04, forest);
    box(root, -1.0, 1.0, -0.049, 0.035, 0.19, 0.018, white);
    box(root, -1.0, 1.0, -0.044, 0.19, 0.035, 0.018, white).rotation.z = 0.2;
    palm(root, 3.63, 1.78, 0.7);
    palm(root, -3.52, 1.85, 0.72);
    // The canopy pavement ends before the pickup lane's inner curb.
    traveller(root, -0.95, 0.08);
    const move = driven(root, oval(0, 1.36, 2.95, 0.7), 0.035);
    models.push({ root, animate: move });
  }
  // 2 — A home and a hotel, joined by one clear road with two endpoints.
  {
    const root = model();
    home(root, -2.65, -0.78);
    hotel(root, 2.4, -1.0, 0.85);
    pin(root, -2.68, -0.78, green, 0.65).position.y = 1.49;
    pin(root, 2.49, -1.0, forest, 0.65).position.y = 1.6;
    tiles(root, -3.4, -0.05, 6, 3);
    tiles(root, 1.65, 0.05, 6, 2);
    planter(root, -3.7, -1.7, 0.35, 1.4);
    planter(root, 3.75, -1.6, 0.3, 1.2);
    box(root, -0.1, 0.025, -1.2, 2.1, 0.055, 1.31, sand);
    box(root, -0.1, 0.061, -1.2, 1.83, 0.025, 1.08, water);
    for (const x of [-0.87, 0.63])
      for (let i = 0; i < 3; i++)
        box(root, x, 0.093, -1.56 + i * 0.33, 0.08, 0.045, 0.23, cream);
    bench(root, -0.1, -2.21);
    palm(root, -3.57, 1.2, 0.8);
    palm(root, 3.45, 1.7, 0.9);
    for (const x of [-0.8, -0.3, 0.2, 0.7]) shrub(root, x, -1.78, 0.23);
    const route = new THREE.CatmullRomCurve3(
      [
        [-2.6, 0.05, 0.7],
        [-1.5, 0.05, 0.4],
        [0, 0.05, 1],
        [1.5, 0.05, 0.9],
        [2.6, 0.05, 0.55],
      ].map((v) => new THREE.Vector3(...v)),
    );
    road(root, route);
    const vehicle = car(root);
    // Drive there, pause, then return; no teleport at the endpoints.
    models.push({
      root,
      animate: (t) => {
        const cycle = (t * 0.06) % 2,
          reverse = cycle > 1;
        const u = THREE.MathUtils.smoothstep(
          reverse ? 2 - cycle : cycle,
          0.07,
          0.93,
        );
        const pt = route.getPointAt(u),
          tan = route.getTangentAt(u);
        vehicle.position.set(pt.x, 0.02, pt.z);
        vehicle.rotation.y = Math.atan2(tan.x, tan.z) + (reverse ? Math.PI : 0);
      },
    });
  }
  // 3 — A day at your pace: hotel, clock, luggage and a chauffeur car.
  {
    const root = model();
    hotel(root, 1.24, -1.15, 1.07);
    palm(root, 3.45, -0.15, 0.95);
    palm(root, -3.45, 1.35, 0.75);
    const clock = group(root, -2.18, -0.87);
    rod(clock, [0, 0, 0], [0, 1.33, 0], 0.065, forest);
    const rim = cylinder(clock, 0, 1.55, 0, 0.71, 0.71, 0.16, forest, 48);
    rim.rotation.x = Math.PI / 2;
    const face = cylinder(clock, 0, 1.55, 0.095, 0.62, 0.62, 0.04, white, 48);
    face.rotation.x = Math.PI / 2;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const mark = box(
        clock,
        Math.sin(a) * 0.51,
        1.55 + Math.cos(a) * 0.51,
        0.13,
        0.035,
        0.1,
        0.016,
        gold,
        0.003,
      );
      mark.rotation.z = -a;
    }
    const hour = group(clock, 0, 0.15, 1.55),
      minute = group(clock, 0, 0.17, 1.55);
    box(hour, 0, 0.16, 0, 0.047, 0.32, 0.025, forest);
    box(minute, 0, 0.23, 0, 0.027, 0.46, 0.025, forest);
    sphere(clock, 0, 1.55, 0.2, 0.053, green);
    traveller(root, -0.6, -0.42);
    tiles(root, -1.17, -0.31, 5, 3);
    bench(root, 2.86, -2.28);
    planter(root, -3.1, -2.2, 1.15, 0.4);
    // A slim travel case, polished clock bezel and terrazzo pedestal.
    cylinder(clock, 0, 0.07, 0, 0.48, 0.52, 0.14, cream, 40);
    const bezel = mesh(
      clock,
      new THREE.TorusGeometry(0.665, 0.027, 8, 64),
      gold,
      0,
      1.55,
      0.12,
    );
    bezel.castShadow = false;
    const move = driven(root, oval(0, 1.32, 2.82, 0.74), 0.025);
    models.push({
      root,
      animate: (t) => {
        move(t);
        hour.rotation.z = -1.05 - t * 0.006;
        minute.rotation.z = -t * 0.07;
      },
    });
  }
  // 4 — A touring landscape: coast, tea country, a stupa and Sigiriya-inspired rock.
  {
    const root = model();
    polygon(
      root,
      [
        [-4.13, -2.68],
        [-2.6, -2.68],
        [-2.75, -1.2],
        [-3.4, 0.8],
        [-4.13, 1.1],
      ],
      0.018,
      water,
      0.008,
    );
    for (const [x, z, s] of [
      [-1.8, -1.85, 1.2],
      [-0.7, -2.0, 1],
    ]) {
      sphere(root, x, 0.04, z, s, lightLeaf, [1, 0.7, 0.72]);
      for (let i = 0; i < 4; i++) {
        const points = Array.from({ length: 24 }, (_, j) => {
          const a = (j / 23) * Math.PI;
          return new THREE.Vector3(
            x + Math.cos(a) * (s - 0.13 * i),
            0.1 + Math.sin(a) * s * 0.6,
            z + 0.08 + i * 0.16,
          );
        });
        const curve = new THREE.CatmullRomCurve3(points);
        mesh(root, new THREE.TubeGeometry(curve, 24, 0.035, 7, false), leaf);
      }
    }
    const cliff = new THREE.CylinderGeometry(0.65, 0.87, 1.78, 32, 14);
    const cliffPositions = cliff.getAttribute("position"),
      cliffColors: number[] = [];
    for (let i = 0; i < cliffPositions.count; i++) {
      const x = cliffPositions.getX(i),
        y = cliffPositions.getY(i),
        z = cliffPositions.getZ(i);
      const a = Math.atan2(z, x),
        jitter =
          1 +
          0.045 * Math.sin(a * 7 + y * 3) +
          0.027 * Math.sin(a * 13 - y * 6);
      cliffPositions.setXYZ(i, x * jitter * 1.14, y, z * jitter * 0.86);
      const c = new THREE.Color(0x978060).multiplyScalar(
        0.9 + 0.1 * Math.sin(y * 23 + a * 2) + 0.09 * Math.cos(a * 11),
      );
      cliffColors.push(c.r, c.g, c.b);
    }
    cliff.computeVertexNormals();
    cliff.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(cliffColors, 3),
    );
    const cliffMat = material(0xffffff);
    cliffMat.vertexColors = true;
    mesh(root, cliff, cliffMat, 2.16, 0.89, -1.5);
    cylinder(root, 2.16, 1.8, -1.5, 0.64, 0.64, 0.07, lightLeaf, 11);
    for (const [x, z, w, d] of [
      [1.94, -1.46, 0.4, 0.42],
      [2.4, -1.62, 0.38, 0.3],
    ]) {
      box(root, x, 1.885, z, w, 0.08, d, terra);
      box(root, x, 1.93, z, w - 0.08, 0.04, d - 0.08, sand);
    }
    for (let i = 0; i < 3; i++) {
      box(root, 1.86 + i * 0.26, 1.9, -1.49, 0.2, 0.16, 0.36, terra);
      box(root, 1.86 + i * 0.26, 1.991, -1.49, 0.15, 0.018, 0.3, sand);
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      shrub(root, 2.16 + Math.cos(a) * 0.82, -1.5 + Math.sin(a) * 0.76, 0.2);
    }
    // The full plinth and entrance steps fit inside the road's central island.
    const stupa = group(root, 0, 0.85);
    stupa.name = "temple-and-steps";
    stupa.scale.setScalar(0.78);
    for (let i = 0; i < 3; i++)
      cylinder(
        stupa,
        0,
        0.035 + i * 0.045,
        0,
        0.68 - i * 0.035,
        0.7 - i * 0.035,
        0.045,
        sand,
        40,
      );
    cylinder(stupa, 0, 0.06, 0, 0.58, 0.63, 0.12, sand);
    mesh(
      stupa,
      new THREE.SphereGeometry(0.48, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      white,
      0,
      0.13,
      0,
    );
    box(stupa, 0, 0.64, 0, 0.21, 0.18, 0.21, white);
    cylinder(stupa, 0, 0.94, 0, 0.018, 0.105, 0.43, white);
    sphere(stupa, 0, 1.17, 0, 0.035, gold);
    for (let i = 0; i < 6; i++)
      cylinder(
        stupa,
        0,
        0.78 + i * 0.055,
        0,
        0.088 - i * 0.011,
        0.09 - i * 0.011,
        0.018,
        cream,
        24,
      );
    box(stupa, 0, 0.28, 0.48, 0.24, 0.35, 0.17, cream);
    box(stupa, 0, 0.26, 0.57, 0.11, 0.24, 0.02, forest);
    for (let i = 0; i < 3; i++)
      box(stupa, 0, 0.025 + i * 0.035, 0.78 - i * 0.09, 0.31, 0.05, 0.18, sand);
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      shrub(
        root,
        2.16 + Math.cos(a) * (0.92 + (i % 2) * 0.1),
        -1.5 + Math.sin(a) * 0.74,
        0.15,
      );
    }
    palm(root, -3.35, -0.3, 0.76);
    palm(root, 3.49, 1.75, 0.78);
    const move = driven(root, oval(0, 0.88, 2.9, 1.31), 0.025);
    models.push({ root, animate: move });
  }
  // 5 — A tactile itinerary map, adjustable stops and an upright planning screen.
  {
    const root = model();
    for (let i = 0; i < 3; i++) {
      const sheet = box(
        root,
        -1.52 + i * 1.2,
        0.09,
        -0.15,
        1.24,
        0.07,
        3.78,
        i % 2 ? cream : white,
      );
      sheet.rotation.z = i % 2 ? 0.045 : -0.045;
    }
    polygon(
      root,
      [
        [-3.7, -1.92],
        [-2.6, -1.92],
        [-2.3, -0.5],
        [-3.0, 1.66],
        [-3.7, 1.66],
      ],
      0.02,
      water,
      0.16,
    );
    const routes = [
      new THREE.CatmullRomCurve3(
        [
          [-2.65, 0.2, 1.1],
          [-1.8, 0.2, 0.6],
          [-1.55, 0.2, -0.25],
          [-0.35, 0.2, -1.35],
        ].map((v) => new THREE.Vector3(...v)),
      ),
      new THREE.CatmullRomCurve3(
        [
          [-2.65, 0.2, 1.1],
          [-1.2, 0.2, 1.1],
          [-0.5, 0.2, 0.3],
          [-0.35, 0.2, -1.35],
        ].map((v) => new THREE.Vector3(...v)),
      ),
    ];
    // Fine street blocks and park inlays give the itinerary a tactile map surface.
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 4; j++) {
        const x = -2.02 + i * 0.43,
          z = -1.7 + j * 0.84;
        box(
          root,
          x,
          0.153,
          z,
          0.34,
          0.014,
          0.58,
          (i + j) % 4 === 0 ? mint : cream,
          0.018,
        );
        if ((i * 3 + j) % 7 === 0)
          box(root, x, 0.21, z, 0.15, 0.1, 0.18, white, 0.01);
      }
    const routeGroups = routes.map((route) => {
      const g = group(root, 0, 0, 0.17);
      road(g, route, 0.18);
      return g;
    });
    const pins = [
      pin(root, -2.65, 1.1, forest, 0.7),
      pin(root, -1.55, -0.25, green, 0.85),
      pin(root, -0.35, -1.35, forest, 0.75),
    ];
    pins.forEach((p) => (p.position.y = 0.18));
    const phone = group(root, 2.12, -0.65);
    phone.rotation.y = -0.16;
    box(phone, 0, 1.33, 0, 1.33, 2.66, 0.2, forest, 0.14);
    box(phone, 0, 1.33, -0.018, 1.36, 2.68, 0.12, gold, 0.12);
    box(phone, 0.69, 1.9, 0, 0.035, 0.25, 0.09, forest, 0.01);
    box(phone, -0.69, 1.75, 0, 0.035, 0.33, 0.09, forest, 0.01);
    box(phone, 0, 1.33, 0.115, 1.14, 2.36, 0.045, white, 0.08);
    box(phone, 0, 2.42, 0.145, 0.32, 0.045, 0.012, dark);
    // Three itinerary stops, connected vertically, with compact abstract content lines.
    box(phone, -0.35, 1.42, 0.15, 0.025, 1.31, 0.018, mint);
    for (let i = 0; i < 3; i++) {
      sphere(
        phone,
        -0.35,
        1.98 - i * 0.56,
        0.19,
        0.075,
        i === 1 ? green : forest,
        [1, 1, 0.2],
      );
      box(phone, 0.12, 2.02 - i * 0.56, 0.16, 0.53, 0.05, 0.025, forest);
      box(phone, 0.05, 1.9 - i * 0.56, 0.16, 0.39, 0.027, 0.025, mint);
    }
    box(phone, 0, 0.43, 0.16, 0.84, 0.22, 0.028, green, 0.035);
    suitcase(root, 2.96, 1.03);
    // Passport, boarding slip and pen complete the planning still life.
    const passport = group(root, 1.22, 1.26, 0.05);
    passport.rotation.y = -0.22;
    box(passport, 0, 0.065, 0, 0.57, 0.09, 0.8, forest, 0.025);
    box(passport, 0, 0.079, 0.023, 0.5, 0.04, 0.75, cream, 0.01);
    box(passport, 0, 0.107, 0, 0.57, 0.026, 0.8, forest, 0.01);
    const seal = cylinder(
      passport,
      0,
      0.127,
      -0.04,
      0.11,
      0.11,
      0.014,
      gold,
      24,
    );
    seal.castShadow = false;
    box(root, 0.94, 0.023, 1.97, 1.15, 0.035, 0.42, white, 0.015);
    for (let i = 0; i < 12; i++)
      box(
        root,
        0.6 + i * 0.031,
        0.046,
        1.97,
        0.014,
        0.007,
        0.23,
        forest,
        0.002,
      );
    rod(root, [2.13, 0.055, 1.52], [2.41, 0.055, 2.27], 0.027, gold);
    palm(root, 3.51, -1.94, 0.63);
    models.push({
      root,
      animate: (t) => {
        const phase = Math.floor(t / 5) % 2;
        routeGroups.forEach((g, i) => {
          g.visible = i === phase;
        });
        const stop = routes[phase].getPointAt(0.52);
        pins[1].position.set(stop.x, 0.18 + Math.sin(t * 1.8) * 0.025, stop.z);
      },
    });
  }
  models.forEach((m) => m.animate(0));
  return {
    models,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
