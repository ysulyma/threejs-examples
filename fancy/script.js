(function () {
  /* set up the scene, camera, and lighting --- you can copy all this stuff between projects */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // set the z axis to be up like we're used to (in graphics, y is up and z is into the screen)
  camera.up.set(0, 0, 1);
  camera.position.set(5.6, -8.2, 6.7);

  // renderer
  const renderer = new THREE.WebGLRenderer({antialias: true});
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
  lights[2].position.set(- 100, - 200, - 100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  /* your code goes here */
  // axes helper
  scene.add(new THREE.AxesHelper(5));

  // the meshes below are created within their own "scope" created by the {} blocks
  // to access them outside (for animation), we store references to them on this object
  const meshes = {};

  const majorRadius = 4, minorRadius = 1;

  // sphere geometry
  {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial({color: 0xFF3333, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  // torus
  {
    /*
      the braces make geometry, material, sphere only visible within this block
      if you need to reassign a variable you can use "let" instead of "const", but
      it's good practice to use "const" by default
    */
    const geometry = new THREE.TorusGeometry(majorRadius, minorRadius, 16, 32);
    const material = new THREE.MeshPhongMaterial({color: 0x1BBB68, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // store a reference to the torus so we can access it in other blocks
    meshes.torus = mesh;
  }

  // parametric geometry
  {
    const geometry = new THREE.ParametricGeometry((u, v, dest) => {
      // u, v are parameters in [0, 1], convert them to [-pi, pi]
      const s = -Math.PI + u * 2 * Math.PI,
        t = -Math.PI + v * 2 * Math.PI;

      const x = s * Math.cos(t),
        y = t * Math.sin(s),
        z = t;
      dest.set(x, y, z);
    }, 20, 20);
    const material = new THREE.MeshPhongMaterial({color: 0xAE81FF, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(6, 6, 0);
    scene.add(mesh);
  }

  {
    // extrude parametric curve
    const curve = new THREE.Curve();
    curve.getPoint = t => {
      const [x, y, z] = torus(majorRadius, minorRadius, t * 2 * Math.PI, 5 * t * 2 * Math.PI);
      return new THREE.Vector3(x, y, z);
    };

    const geometry = new THREE.TubeGeometry(curve, 150, 0.05, 20);
    const material = new THREE.MeshPhongMaterial({color: 0x1A69B5});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    meshes.coil = mesh;
  }

  renderer.setAnimationLoop(time => {
    // time is in milliseconds, divide by 1000 to get something reasonable
    time /= 1000;

    // animate the geometry
    meshes.torus.geometry = new THREE.TorusGeometry(majorRadius, minorRadius, 16, 32, (time / 8 % 1) * 2 * Math.PI);

    // always include these lines
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

  function torus(R, r, theta, phi) {
    return [
      (R + r * Math.cos(phi)) * Math.cos(theta),
      (R + r * Math.cos(phi)) * Math.sin(theta),
      r * Math.sin(phi)
    ];
  }

})();
