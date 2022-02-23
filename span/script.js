function lerp(a, b, t) {
  return a + t * (b - a);
}

{
  const scene = setupScene();
  const initialU = [1, 0, 0];
  const initialV = [0, 1, 0];
  const u = new THREE.Vector3(1, 0, 0);
  const v = new THREE.Vector3(0, 1, 0);

  // axes
  scene.add(new THREE.AxesHelper(1));

  const meshes = {};

  // vectors
  {
    const origin = new THREE.Vector3(0,0,0);

    meshes.u = new THREE.ArrowHelper(new THREE.Vector3(...initialU), origin, 1, 0x3333FF);
    scene.add(meshes.u);

    meshes.v = new THREE.ArrowHelper(new THREE.Vector3(...initialV), origin, 1, 0xFF3333); 
    scene.add(meshes.v);

    store.subscribe(state => {
      for (const key of ["u", "v"]) {
        const vec = new THREE.Vector3(...state[key]);
        meshes[key].setLength(vec.length());
        vec.normalize();
        meshes[key].setDirection(vec);
  
      }
    });
  }
  
  // plane
  {
    function makePlane(u, v) {
      return new THREE.ParametricGeometry((s, t, dest) => {
        s = lerp(-2, 2, s);
        t = lerp(-2, 2, t);
        dest.set(0, 0, 0).addScaledVector(u, s).addScaledVector(v, t);
      });
    }
    const geometry = makePlane(u, v);
    const material = new THREE.MeshPhongMaterial({color: 0x28ca3e, side: THREE.DoubleSide});
    meshes.plane = new THREE.Mesh(geometry, material);
    scene.add(meshes.plane);

    store.subscribe(state => {
      const u = new THREE.Vector3(...state.u);
      const v = new THREE.Vector3(...state.v);
      meshes.plane.geometry = makePlane(u, v);
    });
  }

  /* wire up inputs */
  {
    const update = (e) => {
      const name = e.target.getAttribute("name");
      const vector = name[0];
      const index = parseInt(name.slice(1))-1;
      const value = parseFloat(e.target.value);

      store.setState(prev => {
        const old = prev[vector];
        old[index] = value;
        return {
          [vector]: old
        };
      });
    };
    const inputs = Array.from(document.querySelectorAll("form input"));
    for (const input of inputs) {
      input.addEventListener("change", update); // "input" event isn't supported on old Safari
      input.addEventListener("input", update);
    }
  }
}
