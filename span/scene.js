function setupScene() {
  // container
  const container = document.querySelector("#scene");
  const {height, width} = container.getBoundingClientRect();

  // renderer
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#scene").appendChild(renderer.domElement);
  renderer.setClearColor(new THREE.Color(0xFFFFFF), 0);

  // scene
  const scene = new THREE.Scene();
  
  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // set the z axis to be up like we're used to (in graphics, y is up and z is into the screen)
  camera.up.set(0, 0, 1);
  camera.position.set(1.5, 4.3, 1.3);

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

  // set up render loop
  renderer.setAnimationLoop(time => {
    controls.update();
    renderer.render(scene, camera);
  });

  // make sure scene resizes correctly
  window.addEventListener("resize", () => {
    const {width, height} = container.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  return scene;
}
