(function () {
  /* set up the scene, camera, and lighting --- you can copy all this stuff between projects */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // set the z axis to be up like we're used to (in graphics, y is up and z is into the screen)
  camera.up.set(0, 0, 1);
  camera.position.set(3.0, 2.2, 1.6);
  window.camera = camera;

  // renderer
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("main").appendChild(renderer.domElement);

  // controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // lighting
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(- 100, - 200, - 100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  /* your code goes here */
  // axes helper
  scene.add(new THREE.AxesHelper(5));

  const {cos, sin, PI} = Math;
  const TWOPI = 2 * PI;
  const DEGREES = PI / 180;

  // const v = [[0, 1], [cos(210 * DEGREES), sin(210 * DEGREES)], [cos(330 * DEGREES), sin(330 * DEGREES)]];
  const p = 5;
  const b = 2.0;
  // const v = new Array(p).fill(0).map((_, n) => [cos(TWOPI * n / p+TWOPI/4), sin(TWOPI * n / p+TWOPI/4)]);
  const v = [[0, 0, 1], [0, 0, -1], [1, 0, 0], [cos(TWOPI / 3), sin(TWOPI / 3), 0], [cos(TWOPI * 2 / 3), sin(TWOPI * 2 / 3), 0]];
  // const p = v.length;
  const steps = 6;
  const scaleX = 190;
  const scaleY = 190;

  const geometries = [];

  drawFractal();

  /* this example demonstrates the technique of "merging" geometries. If we didn't do this, the scene would be extremely slow! */
  function drawFractal(cx = 0, cy = 0, cz = 0, step = 0) {
    if (step >= steps) {
      geometries.push(drawPoint(cx, cy, cz));
      return;
    }
    for (let i = 0; i < p; ++i) {
      const x = cx + v[i][0] * Math.pow(b, -step);
      const y = cy + v[i][1] * Math.pow(b, -step);
      const z = cz + v[i][2] * Math.pow(b, -step);
      drawFractal(x, y, z, step + 1);
    }
    if (step === 0) {
      const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
      const material = new THREE.MeshPhongMaterial({color: "black"});
      const mesh = new THREE.Mesh(mergedGeometry, material);
      scene.add(mesh);
    }
  }

  function drawPoint(x, y, z) {
    const r = 0.03;
    const geometry = new THREE.SphereBufferGeometry(r);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, y, z));
    return geometry;
  }

  renderer.setAnimationLoop(time => {
    controls.update();
    renderer.render(scene, camera);
  });


  // make sure scene resizes correctly
  window.addEventListener("resize", () => {
    const {width, height} = renderer.domElement.getBoundingClientRect();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

})();
