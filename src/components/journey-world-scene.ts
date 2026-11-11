import * as THREE from "three";

/** An illustrative Sri Lankan arrival landscape, never a geographic itinerary. */
export function createJourneyWorld() {
  const world = new THREE.Group();
  const parts: { group: THREE.Group; delay: number }[] = [];
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const material = (color: string, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.73,
      ...extra,
    });
    materials.add(m);
    return m;
  };
  const ivory = material("#f4f1e7"),
    stone = material("#d1d5c9");
  const forest = material("#14392e"),
    leaf = material("#366747"),
    lightLeaf = material("#728c53");
  const glass = material("#203f43", { roughness: 0.22, metalness: 0.35 });
  const asphalt = material("#66756d"),
    rubber = material("#182721");
  const sand = material("#dccaab"),
    water = material("#79b4ae", { roughness: 0.24, metalness: 0.18 });
  const terracotta = material("#996449"),
    sandstone = material("#a58465"),
    trim = material("#b8aaa0");
  const mesh = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (
    parent: THREE.Object3D,
    size: number[],
    pos: number[],
    mat: THREE.Material,
  ) =>
    mesh(
      parent,
      new THREE.BoxGeometry(...(size as [number, number, number])),
      mat,
      ...(pos as [number, number, number]),
    );
  const part = (x: number, z: number, delay: number) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    world.add(group);
    parts.push({ group, delay });
    return group;
  };
  function polygon(
    parent: THREE.Object3D,
    points: number[][],
    depth: number,
    mat: THREE.Material,
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
    return mesh(parent, geo, mat, 0, y, 0);
  }
  const base = part(0, 0, 0);
  // Three aligned box slabs guarantee a true rectangle with square corners.
  box(base, [12.15, 0.23, 7.45], [-0.325, -0.275, -0.025], ivory);
  box(base, [12.15, 0.045, 7.45], [-0.325, -0.1375, -0.025], forest);
  box(base, [12.15, 0.115, 7.45], [-0.325, -0.0575, -0.025], stone);
  for (const z of [-3.72, 3.67])
    box(base, [12.15, 0.012, 0.06], [-0.325, 0.006, z], ivory);
  for (const x of [-6.37, 5.72])
    box(base, [0.06, 0.012, 7.45], [x, 0.006, -0.025], ivory);
  polygon(
    base,
    [
      [3.2, -3.6],
      [4.55, -3.6],
      [5.6, -2.6],
      [5.6, 2.8],
      [4.45, 3.55],
      [3.65, 3.55],
      [4.4, 1.45],
      [3.85, -0.6],
    ],
    0.012,
    sand,
    0.003,
  );
  polygon(
    base,
    [
      [4.05, -3.6],
      [4.55, -3.6],
      [5.6, -2.6],
      [5.6, 2.8],
      [4.45, 3.55],
      [4.05, 3.55],
      [4.78, 1.6],
      [4.6, -0.6],
    ],
    0.012,
    water,
    0.02,
  );

  // Airport arrival scene: terminal, apron, runway, control tower and airliner.
  const airport = part(-3.65, -1.25, 0.08);
  airport.scale.set(0.68, 0.85, 0.64);
  const concrete = material("#bfc3bb");
  const taxiPaint = material("#d9bd77");
  box(airport, [5.25, 0.025, 3.12], [0.05, 0.022, -1.94], concrete);
  for (let x = -2.5; x < 2.7; x += 0.58)
    box(airport, [0.009, 0.005, 3.08], [x, 0.04, -1.94], stone);
  for (let z = -3.4; z < -0.35; z += 0.6)
    box(airport, [5.2, 0.006, 0.009], [0.05, 0.04, z], stone);
  box(airport, [0.57, 0.008, 6.55], [-2.55, 0.047, -0.05], asphalt);
  for (let z = -2.9; z < 3.1; z += 0.38)
    box(airport, [0.035, 0.006, 0.17], [-2.55, 0.055, z], ivory);
  for (const z of [-3.03, 2.98])
    for (let i = 0; i < 4; i++)
      box(airport, [0.057, 0.007, 0.38], [-2.74 + i * 0.12, 0.058, z], ivory);
  box(airport, [3.72, 0.67, 1.04], [0.3, 0.36, -0.03], ivory);
  for (const z of [-0.562, 0.502])
    box(airport, [3.56, 0.42, 0.022], [0.3, 0.36, z], glass);
  for (let i = 0; i < 17; i++)
    box(airport, [0.027, 0.53, 1.09], [-1.39 + i * 0.21, 0.4, -0.03], trim);
  for (let i = 0; i < 3; i++) {
    const roof = box(
      airport,
      [1.31, 0.065, 1.25],
      [-0.94 + i * 1.24, 0.758, -0.03],
      ivory,
    );
    roof.rotation.z = i === 1 ? 0 : i === 0 ? 0.045 : -0.045;
    box(airport, [1.24, 0.012, 0.045], [-0.94 + i * 1.24, 0.81, -0.03], forest);
  }
  box(airport, [3.9, 0.052, 0.53], [0.3, 0.63, 0.74], ivory);
  for (let x = -1.5; x < 2.3; x += 0.61)
    box(airport, [0.038, 0.61, 0.045], [x, 0.31, 0.95], trim);
  box(airport, [4.2, 0.024, 0.54], [0.3, 0.026, 1.15], concrete);
  for (let i = 0; i < 9; i++)
    box(airport, [0.2, 0.012, 0.027], [-1.28 + i * 0.38, 0.045, 1.41], ivory);
  mesh(
    airport,
    new THREE.CylinderGeometry(0.12, 0.21, 1.3, 8),
    ivory,
    -1.92,
    0.66,
    -0.3,
  );
  mesh(
    airport,
    new THREE.CylinderGeometry(0.35, 0.29, 0.32, 8),
    glass,
    -1.92,
    1.45,
    -0.3,
  );
  mesh(
    airport,
    new THREE.CylinderGeometry(0.39, 0.39, 0.06, 8),
    ivory,
    -1.92,
    1.64,
    -0.3,
  );
  box(airport, [0.025, 0.26, 0.025], [-1.92, 1.8, -0.3], forest);
  box(airport, [0.25, 0.25, 1.02], [1.5, 0.53, -1.02], ivory);
  box(airport, [0.26, 0.13, 0.78], [1.5, 0.55, -1.02], glass);
  for (let i = 0; i < 5; i++)
    box(airport, [0.28, 0.27, 0.025], [1.5, 0.53, -0.68 - i * 0.16], trim);
  box(airport, [0.27, 0.35, 0.21], [1.5, 0.19, -1.12], trim);
  const plane = new THREE.Group();
  plane.position.set(-0.15, 0.34, -2.05);
  airport.add(plane);
  const bodyProfile = [
    [0, -1.85],
    [0.065, -1.65],
    [0.14, -1.2],
    [0.2, -0.7],
    [0.2, 0.95],
    [0.16, 1.35],
    [0.085, 1.68],
    [0, 1.85],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const fuselage = mesh(plane, new THREE.LatheGeometry(bodyProfile, 48), ivory);
  fuselage.rotation.z = -Math.PI / 2;
  for (const side of [-1, 1]) {
    polygon(
      plane,
      [
        [0.45, side * 0.12],
        [-0.36, side * 1.48],
        [-0.75, side * 1.58],
        [-0.45, side * 0.1],
      ],
      0.035,
      ivory,
      0,
    );
    const winglet = box(
      plane,
      [0.28, 0.16, 0.027],
      [-0.59, 0.09, side * 1.52],
      forest,
    );
    winglet.rotation.x = side * 0.22;
    polygon(
      plane,
      [
        [-1.05, side * 0.08],
        [-1.53, side * 0.66],
        [-1.78, side * 0.67],
        [-1.6, side * 0.08],
      ],
      0.027,
      ivory,
      0.09,
    );
    const engine = mesh(
      plane,
      new THREE.CylinderGeometry(0.115, 0.09, 0.4, 24),
      ivory,
      0.02,
      -0.14,
      side * 0.65,
    );
    engine.rotation.z = Math.PI / 2;
    const intake = mesh(
      plane,
      new THREE.CylinderGeometry(0.08, 0.08, 0.009, 24),
      rubber,
      0.225,
      -0.14,
      side * 0.65,
    );
    intake.rotation.z = Math.PI / 2;
    for (let w = 0; w < 15; w++)
      box(
        plane,
        [0.044, 0.065, 0.012],
        [-1.05 + w * 0.15, 0.065, side * 0.19],
        glass,
      );
    for (const x of [-1.2, 1.18])
      box(plane, [0.07, 0.15, 0.013], [x, 0.01, side * 0.195], trim);
  }
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-1.73, 0.05);
  tailShape.lineTo(-1.65, 0.82);
  tailShape.lineTo(-1.37, 0.75);
  tailShape.lineTo(-0.95, 0.04);
  tailShape.closePath();
  mesh(
    plane,
    new THREE.ExtrudeGeometry(tailShape, { depth: 0.045, bevelEnabled: false }),
    forest,
    0,
    0,
    -0.0225,
  );
  box(plane, [0.23, 0.085, 0.19], [1.5, 0.09, 0], glass);
  for (const x of [-0.55, 1.25]) {
    box(plane, [0.025, 0.16, 0.028], [x, -0.24, 0], trim);
    for (const z of [-0.07, 0.07]) {
      const wheel = mesh(
        plane,
        new THREE.CylinderGeometry(0.063, 0.063, 0.035, 16),
        rubber,
        x,
        -0.32,
        z,
      );
      wheel.rotation.x = Math.PI / 2;
    }
  }
  for (let i = 0; i < 3; i++)
    box(airport, [0.22, 0.12, 0.18], [2.1, 0.12, -2.4 + i * 0.27], trim);
  box(airport, [0.3, 0.17, 0.21], [1.62, 0.15, -2.05], ivory);
  box(airport, [0.1, 0.1, 0.21], [1.83, 0.25, -2.05], glass);
  for (const x of [-2.05, 2.22]) {
    box(airport, [0.022, 1.05, 0.022], [x, 0.53, -3.26], trim);
    box(airport, [0.24, 0.04, 0.075], [x, 1.08, -3.26], ivory);
  }
  box(airport, [0.02, 0.008, 1.32], [1.24, 0.052, -2.5], taxiPaint);
  box(airport, [1.55, 0.008, 0.02], [0.47, 0.052, -3.15], taxiPaint);

  // Sri Lankan cues: Sigiriya's sheer-sided rock and summit terraces, tea
  // country contours, clay tiled coastal villas and coconut palms.
  const landscape = part(1.45, -2.75, 0.26);
  const rock = new THREE.Group();
  rock.position.set(1, 0, 0);
  rock.scale.set(1.22, 0.9, 1.06);
  landscape.add(rock);
  // Sigiriya's long, irregular summit and near-vertical escarpment.
  const rim = new THREE.CatmullRomCurve3(
    [
      [-0.53, -0.25],
      [-0.4, -0.61],
      [-0.1, -0.72],
      [0.34, -0.54],
      [0.53, -0.12],
      [0.42, 0.46],
      [0.12, 0.69],
      [-0.28, 0.59],
      [-0.53, 0.2],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    true,
    "centripetal",
  );
  const rockVertices: number[] = [],
    rockColors: number[] = [],
    rockIndices: number[] = [];
  const rockRows = 32,
    rockSides = 80,
    rockHeight = 1.72;
  const lowStone = new THREE.Color("#716b59"),
    highStone = new THREE.Color("#b6a07d");
  for (let row = 0; row <= rockRows; row++) {
    const h = row / rockRows,
      y = h * rockHeight;
    for (let side = 0; side <= rockSides; side++) {
      const t = side / rockSides,
        a = t * Math.PI * 2,
        p = rim.getPointAt(t % 1);
      const profile = 1.05 + 0.23 * Math.pow(1 - h, 3) - 0.075 * h;
      const fracture =
        0.025 * Math.sin(a * 17 + h * 3) + 0.012 * Math.sin(a * 37 - h * 7);
      rockVertices.push(
        p.x * (profile + fracture) + 0.028 * Math.sin(h * 4),
        y,
        p.z * (profile + fracture),
      );
      const striation = Math.pow(
        Math.max(0, Math.sin(a * 27 + 0.6 * Math.sin(h * 5))),
        7,
      );
      const band =
        0.07 * Math.sin(h * 47 + a * 2) + 0.045 * Math.sin(a * 73 + h * 11);
      const c = lowStone
        .clone()
        .lerp(
          highStone,
          THREE.MathUtils.clamp(
            0.25 + h * 0.53 + band - striation * 0.24,
            0,
            1,
          ),
        );
      rockColors.push(c.r, c.g, c.b);
      if (row < rockRows && side < rockSides) {
        const k = row * (rockSides + 1) + side,
          n = k + rockSides + 1;
        rockIndices.push(k, n, k + 1, k + 1, n, n + 1);
      }
    }
  }
  const rockGeometry = new THREE.BufferGeometry();
  rockGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(rockVertices, 3),
  );
  rockGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(rockColors, 3),
  );
  rockGeometry.setIndex(rockIndices);
  rockGeometry.computeVertexNormals();
  const rockMaterial = material("#ffffff", {
    vertexColors: true,
    roughness: 1,
    side: THREE.DoubleSide,
  });
  mesh(rock, rockGeometry, rockMaterial);
  const summitOutline = Array.from({ length: 80 }, (_, i) => {
    const p = rim.getPointAt(i / 80);
    return [p.x * 0.975 + 0.028 * Math.sin(4), p.z * 0.975];
  });
  polygon(rock, summitOutline, 0.024, lightLeaf, rockHeight);
  // Summit terraces are an elongated archaeological plan, not a pyramid.
  for (const [x, z, w, d, h] of [
    [-0.06, -0.38, 0.4, 0.27, 0.06],
    [0.06, -0.03, 0.44, 0.37, 0.1],
    [-0.055, 0.33, 0.36, 0.26, 0.045],
  ]) {
    box(rock, [w, h, d], [x, rockHeight + 0.03 + h / 2, z], terracotta);
    box(
      rock,
      [w - 0.065, 0.012, d - 0.065],
      [x, rockHeight + 0.034 + h, z],
      sand,
    );
    for (const sx of [-1, 1])
      box(
        rock,
        [0.026, 0.075, d],
        [x + sx * (w / 2 - 0.013), rockHeight + h + 0.07, z],
        terracotta,
      );
    box(
      rock,
      [w, 0.075, 0.026],
      [x, rockHeight + h + 0.07, z - d / 2 + 0.013],
      terracotta,
    );
  }
  box(rock, [0.18, 0.03, 0.22], [-0.24, rockHeight + 0.05, 0.015], sandstone);
  box(rock, [0.145, 0.008, 0.185], [-0.24, rockHeight + 0.07, 0.015], water);
  box(rock, [0.055, 0.014, 1.1], [-0.14, rockHeight + 0.06, -0.03], sand);
  // The exposed ascent and forest skirt give the cliff a recognisable scale.
  for (let i = 0; i < 27; i++) {
    const h = 0.22 + i * 0.048;
    box(
      rock,
      [0.064, 0.018, 0.041],
      [-0.29 + i * 0.008, h, 0.64 - h * 0.034],
      sandstone,
    );
  }
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2,
      p = rim.getPointAt(i / 18);
    const shrub = mesh(
      rock,
      new THREE.SphereGeometry(0.14 + (i % 3) * 0.025, 10, 7),
      i % 3 ? leaf : lightLeaf,
      p.x * 1.23,
      0.1,
      p.z * 1.23,
    );
    shrub.scale.y = 0.7 + 0.2 * Math.sin(a);
  }

  // Soft terrain with tea rows following its slope.
  const hillHeight = (x: number, z: number) =>
    0.88 * Math.exp(-((x + 0.4) ** 2 * 2.8 + z * z * 3.4)) +
    0.61 * Math.exp(-((x + 1.2) ** 2 * 4 + (z - 0.12) ** 2 * 4));
  const hillGeometry = new THREE.PlaneGeometry(2.55, 1.3, 45, 28);
  hillGeometry.rotateX(-Math.PI / 2);
  hillGeometry.translate(-0.55, 0, 0.1);
  const hillVertices = hillGeometry.getAttribute("position");
  for (let i = 0; i < hillVertices.count; i++) {
    hillVertices.setY(
      i,
      hillHeight(hillVertices.getX(i), hillVertices.getZ(i)),
    );
  }
  hillGeometry.computeVertexNormals();
  mesh(landscape, hillGeometry, lightLeaf);
  for (let row = 0; row < 7; row++) {
    const z = -0.4 + row * 0.15;
    const points = Array.from({ length: 32 }, (_, i) => {
      const x = -1.7 + (i / 31) * 2.15;
      const bend = z + Math.sin(x * 2.1) * 0.05;
      return new THREE.Vector3(x, hillHeight(x, bend) + 0.025, bend);
    });
    mesh(
      landscape,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        32,
        0.028,
        5,
        false,
      ),
      leaf,
    );
  }

  // A narrow hill-country waterfall at the foot of the tea-covered mountain.
  const waterfall = part(0.45, -1.68, 0.3);
  const cliffStone = material("#485047", { roughness: 1, vertexColors: true });
  const streamWhite = material("#e1eeea", { roughness: 0.36 });
  const poolWater = material("#28594f", { roughness: 0.2, metalness: 0.15 });
  const cliffGeometry = new THREE.PlaneGeometry(1.05, 1.2, 24, 32);
  const cliffVertices = cliffGeometry.getAttribute("position");
  const cliffColors: number[] = [];
  for (let i = 0; i < cliffVertices.count; i++) {
    const x = cliffVertices.getX(i),
      y = cliffVertices.getY(i) + 0.63;
    cliffVertices.setXYZ(
      i,
      x * (1 - y * 0.12),
      y,
      0.05 + Math.sin(x * 17 + y * 4) * 0.045 + Math.sin(y * 31) * 0.026,
    );
    const tone = 0.7 + 0.25 * Math.sin(y * 21 + x * 8);
    cliffColors.push(tone, tone, tone * 0.94);
  }
  cliffGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(cliffColors, 3),
  );
  cliffGeometry.computeVertexNormals();
  mesh(waterfall, cliffGeometry, cliffStone);
  box(waterfall, [0.92, 1.1, 0.18], [0, 0.55, -0.08], sandstone);
  for (const side of [-1, 1]) {
    const bankGeometry = new THREE.PlaneGeometry(0.52, 1.27, 16, 24);
    const bankVertices = bankGeometry.getAttribute("position");
    for (let i = 0; i < bankVertices.count; i++) {
      const u = bankVertices.getX(i),
        y = bankVertices.getY(i) + 0.655;
      const edge = Math.sin(y * 9) * 0.014 + Math.cos(y * 17) * 0.008;
      bankVertices.setXYZ(
        i,
        side * (0.4 + u + edge),
        y,
        -0.12 + Math.cos(u * 5) * 0.18 + Math.sin(y * 6 + u * 8) * 0.035,
      );
    }
    bankGeometry.computeVertexNormals();
    const bank = mesh(waterfall, bankGeometry, side < 0 ? leaf : lightLeaf);
    bank.material.side = THREE.DoubleSide;
  }
  // The stream is continuous, slightly pinched mid-fall and wider at impact.
  const streamVertices: number[] = [],
    streamIndices: number[] = [];
  for (let row = 0; row <= 48; row++) {
    const t = row / 48,
      width = 0.09 + 0.07 * Math.pow(t, 4) + 0.02 * Math.cos(t * 9);
    const center = Math.sin(t * 8) * 0.012;
    const z = 0.14 + t * 0.05 + 0.045 / (1 + Math.exp(-(t - 0.66) * 50));
    streamVertices.push(
      center - width / 2,
      1.25 - t * 1.18,
      z,
      center + width / 2,
      1.25 - t * 1.18,
      z,
    );
    if (row < 48) {
      const k = row * 2;
      streamIndices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const streamGeometry = new THREE.BufferGeometry();
  streamGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(streamVertices, 3),
  );
  streamGeometry.setIndex(streamIndices);
  streamGeometry.computeVertexNormals();
  streamWhite.side = THREE.DoubleSide;
  mesh(waterfall, streamGeometry, streamWhite);
  const pool = mesh(
    waterfall,
    new THREE.SphereGeometry(0.35, 40, 20),
    poolWater,
    0,
    0.035,
    0.44,
  );
  pool.scale.set(1.2, 0.075, 0.85);
  const foam = mesh(
    waterfall,
    new THREE.SphereGeometry(0.11, 20, 12),
    streamWhite,
    0,
    0.065,
    0.27,
  );
  foam.scale.set(0.8, 0.08, 1.2);
  box(waterfall, [0.1, 0.018, 0.38], [0, 1.25, -0.04], poolWater);

  // Colombo's Lotus Tower: green shaft, layered purple petals and antenna.
  const lotus = part(-3.35, 1.4, 0.34);
  const towerGreen = material("#27885c", { roughness: 0.5 });
  const petalPink = material("#963469", { roughness: 0.48, metalness: 0.12 });
  const petalDark = material("#632c59", { roughness: 0.48 });
  mesh(
    lotus,
    new THREE.CylinderGeometry(0.43, 0.48, 0.11, 48),
    ivory,
    0,
    0.055,
    0,
  );
  mesh(
    lotus,
    new THREE.CylinderGeometry(0.105, 0.16, 1.35, 32),
    towerGreen,
    0,
    0.77,
    0,
  );
  for (let i = 0; i < 5; i++)
    mesh(
      lotus,
      new THREE.CylinderGeometry(0.115 + i * 0.02, 0.12 + i * 0.02, 0.035, 32),
      towerGreen,
      0,
      1.31 + i * 0.055,
      0,
    );
  const bulb = mesh(
    lotus,
    new THREE.SphereGeometry(0.29, 32, 24),
    petalDark,
    0,
    1.73,
    0,
  );
  bulb.scale.y = 1.25;
  for (let petal = 0; petal < 8; petal++) {
    const angle = (petal * Math.PI) / 4,
      points: number[] = [],
      indices: number[] = [];
    for (let row = 0; row <= 16; row++) {
      const t = row / 16,
        r = 0.12 + Math.sin(Math.PI * t) * 0.25;
      const spread = Math.sin(Math.PI * t) * 0.38;
      for (const edge of [-1, 1]) {
        const a = angle + edge * spread;
        points.push(Math.cos(a) * r, 1.4 + t * 0.72, Math.sin(a) * r);
      }
      if (row < 16) {
        const k = row * 2;
        indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const petalMesh = mesh(lotus, geo, petal % 2 ? petalPink : petalDark);
    petalMesh.material.side = THREE.DoubleSide;
  }
  mesh(
    lotus,
    new THREE.CylinderGeometry(0.065, 0.11, 0.13, 24),
    ivory,
    0,
    2.16,
    0,
  );
  mesh(
    lotus,
    new THREE.CylinderGeometry(0.008, 0.024, 0.7, 12),
    trim,
    0,
    2.56,
    0,
  );
  for (let i = 0; i < 4; i++)
    mesh(
      lotus,
      new THREE.CylinderGeometry(0.028, 0.028, 0.012, 12),
      ivory,
      0,
      2.31 + i * 0.17,
      0,
    );

  const temple = part(2.45, 1.35, 0.31);
  const templeWhite = material("#fffdf5", { roughness: 0.78 });
  const gold = material("#b39245", { roughness: 0.35, metalness: 0.55 });
  // Hemispherical dagoba, square harmika, ringed spire and stepped stone plinth,
  // following the architectural form in the supplied Sri Lankan references.
  for (let i = 0; i < 4; i++) {
    mesh(
      temple,
      new THREE.CylinderGeometry(0.84 - i * 0.045, 0.86 - i * 0.045, 0.07, 64),
      i === 3 ? templeWhite : sandstone,
      0,
      0.035 + i * 0.07,
      0,
    );
  }
  mesh(
    temple,
    new THREE.SphereGeometry(0.665, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    templeWhite,
    0,
    0.27,
    0,
  );
  mesh(
    temple,
    new THREE.CylinderGeometry(0.67, 0.67, 0.025, 64),
    terracotta,
    0,
    0.3,
    0,
  );
  mesh(
    temple,
    new THREE.CylinderGeometry(0.672, 0.672, 0.009, 64),
    gold,
    0,
    0.324,
    0,
  );
  box(temple, [0.28, 0.17, 0.28], [0, 1.002, 0], templeWhite);
  box(temple, [0.31, 0.025, 0.31], [0, 0.925, 0], templeWhite);
  box(temple, [0.32, 0.025, 0.32], [0, 1.096, 0], templeWhite);
  for (const side of [-1, 1])
    for (let i = 0; i < 5; i++) {
      box(
        temple,
        [0.012, 0.125, 0.012],
        [-0.106 + i * 0.053, 1.005, side * 0.146],
        stone,
      );
      box(
        temple,
        [0.012, 0.125, 0.012],
        [side * 0.146, 1.005, -0.106 + i * 0.053],
        stone,
      );
    }
  const spireProfile = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    return new THREE.Vector2(
      0.115 * Math.pow(1 - t, 1.25) + 0.012,
      1.11 + t * 0.65,
    );
  });
  mesh(temple, new THREE.LatheGeometry(spireProfile, 48), templeWhite);
  for (let i = 0; i < 12; i++) {
    const t = i / 12,
      r = 0.115 * Math.pow(1 - t, 1.25) + 0.013;
    const ring = mesh(
      temple,
      new THREE.TorusGeometry(r, 0.007, 5, 40),
      stone,
      0,
      1.11 + t * 0.65,
      0,
    );
    ring.rotation.x = Math.PI / 2;
  }
  mesh(temple, new THREE.SphereGeometry(0.034, 16, 12), gold, 0, 1.795, 0);
  mesh(temple, new THREE.ConeGeometry(0.026, 0.115, 16), gold, 0, 1.862, 0);
  // Four small cardinal shrines and a visible flight of stone approach steps.
  for (let side = 0; side < 4; side++) {
    const shrine = new THREE.Group();
    shrine.rotation.y = (side * Math.PI) / 2;
    temple.add(shrine);
    box(shrine, [0.32, 0.4, 0.19], [0, 0.41, 0.68], templeWhite);
    box(shrine, [0.09, 0.2, 0.012], [0, 0.34, 0.782], forest);
    for (const x of [-0.115, 0.115])
      box(shrine, [0.04, 0.32, 0.055], [x, 0.42, 0.794], templeWhite);
    for (let i = 0; i < 3; i++)
      box(
        shrine,
        [0.4 - i * 0.075, 0.045, 0.27 - i * 0.035],
        [0, 0.64 + i * 0.061, 0.68],
        templeWhite,
      );
    mesh(
      shrine,
      new THREE.ConeGeometry(0.05, 0.13, 8),
      templeWhite,
      0,
      0.84,
      0.68,
    );
  }
  for (let i = 0; i < 5; i++)
    box(
      temple,
      [0.34, 0.042, 0.085],
      [0, 0.021 + i * 0.043, 1.05 - i * 0.085],
      sandstone,
    );
  const coast = part(4.25, -1.4, 0.38);
  coast.scale.set(0.65, 0.8, 0.65);
  for (const x of [-0.51, 0.51]) {
    box(coast, [0.78, 0.61, 0.69], [x, 0.31, 0], ivory);
    const roof = mesh(
      coast,
      new THREE.ConeGeometry(0.67, 0.33, 4),
      terracotta,
      x,
      0.76,
      0,
    );
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.88;
    box(coast, [0.17, 0.36, 0.02], [x, 0.22, 0.352], forest);
    for (const wx of [-0.24, 0.24])
      box(coast, [0.14, 0.19, 0.024], [x + wx, 0.36, 0.354], glass);
    box(coast, [0.83, 0.035, 0.43], [x, 0.19, 0.49], ivory);
    for (const px of [-0.34, 0.34])
      box(coast, [0.028, 0.52, 0.028], [x + px, 0.43, 0.67], trim);
    const canopy = box(coast, [0.89, 0.04, 0.51], [x, 0.69, 0.48], terracotta);
    canopy.rotation.x = 0.13;
  }
  box(coast, [0.55, 0.03, 0.45], [0, 0.035, 1.22], water);

  const foliage = part(0, 0, 0.46);
  function palm(x: number, z: number, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(scale);
    foliage.add(group);
    const stem = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.05, 0.48, 0.02),
      new THREE.Vector3(0.14, 1.02, 0),
    ]);
    mesh(group, new THREE.TubeGeometry(stem, 10, 0.036, 7, false), trim);
    for (let j = 0; j < 7; j++) {
      const a = (j * Math.PI * 2) / 7,
        dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
      const p0 = new THREE.Vector3(0.14, 1.03, 0),
        p1 = p0
          .clone()
          .addScaledVector(dir, 0.32)
          .add(new THREE.Vector3(0, 0.11, 0)),
        p2 = p0
          .clone()
          .addScaledVector(dir, 0.62)
          .add(new THREE.Vector3(0, -0.24, 0));
      const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2),
        vertices: number[] = [],
        indices: number[] = [];
      for (let i = 0; i <= 10; i++) {
        const p = curve.getPoint(i / 10),
          w = Math.sin((i / 10) * Math.PI) * 0.09,
          side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(w);
        vertices.push(
          p.x + side.x,
          p.y,
          p.z + side.z,
          p.x - side.x,
          p.y,
          p.z - side.z,
        );
        if (i < 10) {
          const k = i * 2;
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
      const frond = mesh(group, geo, j % 2 ? leaf : lightLeaf);
      frond.material.side = THREE.DoubleSide;
    }
  }
  [
    [-4.05, 0.65],
    [-2.65, 0.65],
    [-0.45, 2.4],
    [-4.9, 2.8],
    [0.6, 3.15],
    [3.1, 3.45],
    [4.9, 2.5],
    [4.6, -2.25],
    [4.05, -0.1],
  ].forEach(([x, z], i) => palm(x, z, 0.85 + (i % 3) * 0.1));
  for (let i = 0; i < 22; i++) {
    const x = -0.9 + (i % 8) * 0.57,
      z = -3.33 + Math.floor(i / 8) * 0.26;
    const bush = mesh(
      foliage,
      new THREE.SphereGeometry(0.19, 10, 7),
      i % 3 ? leaf : lightLeaf,
      x,
      0.12,
      z,
    );
    bush.scale.set(1, 0.76, 1);
  }

  const roads = part(0, 0, 0.04);
  const vector = (x: number, z: number) => new THREE.Vector3(x, 0.055, z);
  const bezier = (start: number[], bends: number[][]) => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    let from = vector(start[0], start[1]);
    for (const [x1, z1, x2, z2, x3, z3] of bends) {
      const end = vector(x3, z3);
      path.add(
        new THREE.CubicBezierCurve3(from, vector(x1, z1), vector(x2, z2), end),
      );
      from = end;
    }
    return path;
  };
  // Matched Bezier tangents keep the GO curves smooth at every arc join.
  const segments = [
    bezier([-1.4, -0.05], [[-0.1, -0.05, 1.15, -0.05, 2.45, -0.05]]),
    bezier(
      [-1.4, -0.05],
      [
        [-2, -0.05, -2.8, -0.05, -3.4, -0.05],
        [-4.3, -0.05, -4.95, 0.56, -4.95, 1.45],
        [-4.95, 2.28, -4.26, 2.95, -3.4, 2.95],
        [-2.54, 2.95, -2.05, 2.06, -1.4, 1.4],
      ],
    ),
    bezier([-1.4, 1.4], [[-0.8, 1.4, -0.2, 1.5, 0.4, 1.5]]),
    bezier([0.4, 1.5], [[0.4, 0.644, 1.318, -0.05, 2.45, -0.05]]),
    bezier(
      [0.4, 1.5],
      [
        [0.4, 2.356, 1.318, 3.05, 2.45, 3.05],
        [3.582, 3.05, 4.5, 2.356, 4.5, 1.5],
        [4.5, 0.644, 3.582, -0.05, 2.45, -0.05],
      ],
    ),
  ];
  function ribbon(
    path: THREE.Curve<THREE.Vector3>,
    width: number,
    mat: THREE.Material,
    height = 0,
  ) {
    const vertices: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 240; i++) {
      const p = path.getPointAt(i / 240),
        t = path.getTangentAt(i / 240),
        n = new THREE.Vector3(-t.z, 0, t.x)
          .normalize()
          .multiplyScalar(width / 2);
      vertices.push(
        p.x + n.x,
        p.y + height,
        p.z + n.z,
        p.x - n.x,
        p.y + height,
        p.z - n.z,
      );
      if (i < 240) {
        const a = i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return mesh(roads, geo, mat);
  }
  for (const path of segments) {
    ribbon(path, 0.6, ivory);
    ribbon(path, 0.48, asphalt, 0.006);
    for (let i = 0; i < Math.floor(path.getLength() * 3.5); i++) {
      const t = i / Math.floor(path.getLength() * 3.5),
        p = path.getPointAt(t),
        v = path.getTangentAt(t);
      const line = box(
        roads,
        [0.018, 0.008, 0.11],
        [p.x, p.y + 0.013, p.z],
        ivory,
      );
      line.rotation.y = Math.atan2(v.x, v.z);
    }
  }
  // The squared crossbar and descending stem make the left sweep read as G.
  box(roads, [1.66, 0.022, 0.48], [-2.0, 0.065, 1.4], asphalt);
  box(roads, [0.48, 0.022, 1.6], [-1.4, 0.065, 2.2], asphalt);
  for (const [x, z] of [
    [0.4, 1.5],
    [2.45, -0.05],
    [-1.4, 1.4],
  ]) {
    const junction = mesh(
      roads,
      new THREE.CircleGeometry(0.25, 48),
      asphalt,
      x,
      0.08,
      z,
    );
    junction.rotation.x = -Math.PI / 2;
  }
  // A sculpted sedan follows the road; the wheels stay on the road surface.
  const car = new THREE.Group();
  roads.add(car);
  box(car, [0.26, 0.105, 0.59], [0, 0.12, 0], forest);
  const cabin = mesh(
    car,
    new THREE.SphereGeometry(1, 16, 10),
    glass,
    0,
    0.19,
    -0.015,
  );
  cabin.scale.set(0.12, 0.13, 0.22);
  box(car, [0.235, 0.022, 0.21], [0, 0.29, -0.045], forest);
  box(car, [0.244, 0.05, 0.12], [0, 0.175, 0.205], forest);
  for (const x of [-0.091, 0.091])
    box(car, [0.061, 0.025, 0.016], [x, 0.142, 0.303], ivory);
  for (const x of [-0.135, 0.135])
    for (const z of [-0.19, 0.18]) {
      const wheel = mesh(
        car,
        new THREE.CylinderGeometry(0.063, 0.063, 0.033, 16),
        rubber,
        x,
        0.063,
        z,
      );
      wheel.rotation.z = Math.PI / 2;
      const hub = mesh(
        car,
        new THREE.CylinderGeometry(0.03, 0.03, 0.035, 12),
        trim,
        x,
        0.063,
        z,
      );
      hub.rotation.z = Math.PI / 2;
    }
  car.scale.setScalar(1.14);
  // Every circuit begins and ends at the same pickup point and heading.
  // Reverse edges use -(index + 1); all routes follow the rendered road network.
  const circuits = [
    [1, 2, 4, -1],
    [1, 2, 3, -1],
    [1, 2, 3, -5, 4, -1],
  ];
  const routes = circuits.map((edges) => {
    const points: THREE.Vector3[] = [];
    edges.forEach((id) => {
      const reversed = id < 0;
      const segment = segments[reversed ? -id - 1 : id];
      for (let i = points.length ? 1 : 0; i <= 60; i++)
        points.push(segment.getPointAt(reversed ? 1 - i / 60 : i / 60));
    });
    points.pop(); // Closed curve supplies the shared seam, with a continuous tangent.
    const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
    return curve;
  });
  let routeIndex = 0;
  let route = routes[0];
  function nextRoute() {
    routeIndex = (routeIndex + 1) % routes.length;
    route = routes[routeIndex];
    drive(0);
    return route.getLength();
  }
  function drive(progress: number) {
    if (!route) return;
    const t = THREE.MathUtils.clamp(progress, 0, 0.9999),
      p = route.getPointAt(t),
      v = route.getTangentAt(t);
    car.position.copy(p);
    car.rotation.y = Math.atan2(v.x, v.z);
  }
  function assemble(progress: number) {
    for (const { group, delay } of parts) {
      const t = THREE.MathUtils.clamp((progress - delay) / (1 - delay), 0, 1),
        ease = 1 - Math.pow(1 - t, 3);
      group.position.y = (group === base ? -0.32 : -0.8) * (1 - ease);
      group.scale.y = Math.max(0.001, ease);
      group.visible = t > 0.005;
    }
  }
  drive(0);
  return {
    world,
    drive,
    nextRoute,
    routeLength: route.getLength(),
    assemble,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
