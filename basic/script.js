(function () {
  /* set up the scene, camera, and lighting --- you can copy all this stuff between projects */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // set the z axis to be up like we're used to (in graphics, y is up and z is into the screen)
  camera.up.set(0, 0, 1);
  camera.position.set(1.5, 4.3, 1.3);

  // renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("main").appendChild(renderer.domElement);

  // orbit controls
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
  lights[2].position.set(-100, -200, -100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  /* your code goes in here */
  {
    // see https://threejs.org/docs/api/en/geometries/SphereGeometry.html for options
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshPhongMaterial({color: 0xAE81FF, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  /* also use these in every project */

  // set up render loop
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
