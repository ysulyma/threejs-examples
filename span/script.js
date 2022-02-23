function lerp(a, b, t) {
  return a + t * (b - a);
}

{
  const axesWidth = 5;
  const axesHeight = 5;
  const scene = setupScene();
  window.scene = scene;
  const u = new THREE.Vector3(...store.state.u);
  const v = new THREE.Vector3(...store.state.v);

  // axes
  scene.add(new THREE.AxesHelper(1));

  const meshes = {};

  // vectors
  {
    const origin = new THREE.Vector3(0,0,0);

    meshes.u = new THREE.ArrowHelper(u, origin, 1, 0x3333FF);
    scene.add(meshes.u);

    meshes.v = new THREE.ArrowHelper(v, origin, 1, 0xFF3333); 
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

  // lattice
  {
    function makeLattice(u, v) {
      const points = [];
      for (let i = -axesWidth; i <= axesWidth; ++i) {
        for (let j = -axesHeight; j <= axesHeight; ++j) {
          points.push(
            u.clone().multiplyScalar(i).addScaledVector(v, -axesHeight),
            u.clone().multiplyScalar(i).addScaledVector(v, axesHeight),
            v.clone().multiplyScalar(j).addScaledVector(u, -axesWidth),
            v.clone().multiplyScalar(j).addScaledVector(u, axesWidth),
          );
        }
      }
      return points;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(makeLattice(u, v));
    const material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
    meshes.lines = new THREE.LineSegments(geometry, material);
    scene.add(meshes.lines);

    store.subscribe(state => {
      const u = new THREE.Vector3(...state.u);
      const v = new THREE.Vector3(...state.v);
      meshes.lines.geometry.setFromPoints(makeLattice(u, v));
    });
  }
  
  // plane
  {
    function makePlane(u, v) {
      u = u.clone().normalize();
      v = v.clone().normalize();
      /* a PlaneGeometry would be more efficient, but ParametricGeometry
         illustrates the idea of span more directly */
      return new THREE.ParametricGeometry((s, t, dest) => {
        s = lerp(-axesWidth, axesWidth, s);
        t = lerp(-axesHeight, axesHeight, t);
        dest.set(0, 0, 0).addScaledVector(u, s).addScaledVector(v, t);
      });
    }
    const geometry = makePlane(u, v);
    const material = new THREE.MeshBasicMaterial({color: new THREE.Color(0x55cc66).convertSRGBToLinear(), side: THREE.DoubleSide});
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
