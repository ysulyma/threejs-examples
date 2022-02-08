(() => {
const {
  DoubleSide,
  Mesh, MeshPhongMaterial,
  ParametricGeometry, Plane, PlaneGeometry,
  SphereGeometry,
  Vector3
} = THREE;

const {cos, sin} = Math,
      TWOPI = 2 * Math.PI;

/* reusable class for THREE scenes */
class ThreeScene {
  // uncomment these lines if you're using TypeScript
  // protected container: HTMLDivElement;

  // protected height: number;
  // protected width: number;

  // protected camera: THREE.Camera;
  // protected controls: any;
  // protected renderer: THREE.WebGLRenderer;
  // protected scene: THREE.Scene;

  constructor(div) {
    this.container = div;
    this.scene = new THREE.Scene();

    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();

    this.populate();
    this.container.appendChild(this.renderer.domElement);
  }

  setupRenderer() {
    /* silence WebGL message from THREE */
    const log = console.log;
    console.log = (...args) => {
      return log(...args && args.join(" ").match(/^THREE\.WebGLRenderer\s*\d*$/) ? args : []);
    };
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    console.log = log;

    // renderer.setClearColor(new Color(0x000000, 0));
    renderer.shadowMap.enabled = true;

    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    renderer.setSize(this.width, this.height);

    renderer.localClippingEnabled = true;

    this.renderer = renderer;

    /* animation loop */
    this.renderer.setAnimationLoop(time => {
      this.controls.update();
      this.animate(time);
      renderer.render(this.scene, this.camera);
    });

    /* handle resizing */
    window.addEventListener("resize", () => {
      const rect = this.container.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.renderer.setSize(this.width, this.height);
    });
  }

  setupCamera() {
    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 0.1, 1000);

    // position and point the camera to the center of the scene
    camera.up.set(0, 0, 1);
    camera.position.x = 0;
    camera.position.y = -5;
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0, -3, 5));

    this.camera = camera;
  }

  setupControls() {
    // orbit controls
    const orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    orbitControls.enableKeys = false;

    this.controls = orbitControls;
  }

  setupLights() {
    // lighting
    const light = new THREE.AmbientLight( 0x404040 );
    this.scene.add(light);

    const lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );
  }

  /* getters */
  get aspectRatio() {
    return this.width / this.height;
  }

  /* helper functions */
  screenToNDC(x, y) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    return new THREE.Vector2(
      (x - rect.left) / rect.width * 2 - 1,
      -(y - rect.top) / rect.height * 2 + 1
    );
  }

  screenToScene(x, y, plane) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = this.screenToNDC(x, y),
          mouse = new THREE.Vector3(ndc.x, ndc.y, 0);

    mouse.unproject(this.camera);

    const dir = mouse.sub(this.camera.position).normalize();

    const distance = -plane.distanceToPoint(this.camera.position) / Math.cos(dir.angleTo(plane.normal));

    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  /* extend these methods yourself */
  populate() {}
  animate(time) {}
}

/* our specific scene */
class MyScene extends ThreeScene {
  // uncomment these lines if you're using TypeScript
  // private lastX: number;
  // private lastY: number;
  // private dragging: boolean;

  // private ball: THREE.Mesh;
  // private line: THREE.Mesh;
  // private plane: THREE.Mesh;
  // private torus: THREE.Mesh;

  constructor(container) {
    super(container);

    // bind event handlers
    for (const name of ["onMouseDown", "onMouseMove", "onMouseUp"]) {
      this[name] = this[name].bind(this);
    }

    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseDown(e) {
    const raycaster = new THREE.Raycaster();
    const {camera, controls} = this;

    const mouse = this.screenToNDC(e.clientX, e.clientY);;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(this.ball).length > 0;
    if (intersects) {
      controls.enabled = false;

      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.container.classList.add("dragging-cursor");
    }
  }

  onMouseMove(e) {
    if (this.dragging) {
      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(
        new Vector3(0, 0, 0).sub(this.camera.position).normalize(),
        this.ball.position
      );
      const pos = this.screenToScene(e.clientX, e.clientY, plane);

      this.ball.position.setZ(pos.z);
      this.plane.position.setZ(pos.z);

      this.torus.material.clippingPlanes = [new Plane(new Vector3(0, 0, -1), pos.z)];
    } else {
      const raycaster = new THREE.Raycaster();
      const {camera, controls} = this;

      const mouse = this.screenToNDC(e.clientX, e.clientY);;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(this.ball).length > 0;

      if (intersects)
        this.container.classList.add("drag-cursor");
      else
        this.container.classList.remove("drag-cursor");
    }
  }

  onMouseUp(e) {
    if (this.dragging) {
      this.controls.enabled = true;
      this.container.classList.remove("dragging-cursor");
      this.container.classList.remove("drag-cursor");
    }
    this.dragging = false;
  }

  populate() {
    const {scene} = this;
    scene.add(new THREE.AxesHelper(5));

    const majorRadius = 3,
          minorRadius = 1;

    // torus
    // const f = (x, y, z) => x * x + y * y - z;
    {
      const geometry = new THREE.TorusGeometry(majorRadius, minorRadius, 40, 40);
      const material =  new MeshPhongMaterial({
        clippingPlanes: [new Plane(new Vector3(0, 0, -1), 0)],
        clipShadows: true,
        color: 0x1BBB68,
        side: THREE.DoubleSide
      });
      const mesh = new Mesh( geometry, material );

      geometry.rotateX(TWOPI / 4);
      mesh.position.setZ(4);
      scene.add(mesh);
      this.torus = mesh;
    }

    // plane
    {
      const geometry = new THREE.PlaneGeometry(5 + majorRadius + minorRadius, 5);
      const material = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        opacity: 0.2,
        side: THREE.DoubleSide,
        transparent: true
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.setX(minorRadius / 2);

      scene.add(mesh);
      this.plane = mesh;
    }

    // line
    {
      const curve = new THREE.Curve();
      curve.getPoint = t => new Vector3(0, 0, t * 2 * (majorRadius + minorRadius + 0.05));
      const geometry = new THREE.TubeGeometry(curve, 50, 0.01, 50, true);
      const material = new MeshPhongMaterial({color: 0xFF0070});
      const line = new Mesh(geometry, material);
      line.position.set(5, 0, 0);
      this.line = line;
      scene.add(line);
    }

    // ball control
    {
      const geometry = new SphereGeometry(0.1, 20, 20);
      const material = new MeshPhongMaterial({color: 0xFF0070});
      const mesh = new Mesh(geometry, material);
      mesh.position.set(5,0,0);
      scene.add(mesh);
      this.ball = mesh;
    }

    // critical points
    for (const crit of [0, 2 * minorRadius, 2 * majorRadius, 2 * (majorRadius + minorRadius)]) {
      const geometry = new SphereGeometry(0.05, 20, 20);
      const material = new MeshPhongMaterial({color: 0x0000FF});
      const mesh = new Mesh(geometry, material);
      mesh.position.set(5, 0, crit);
      scene.add(mesh);
    }
  }
}

new MyScene(document.getElementById("container"));

})();
