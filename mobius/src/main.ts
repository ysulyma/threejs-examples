import * as THREE from "three";
import {makeMeshDraggable, screenToScene} from "./three-utils";

const mobiusRadius = 2;

const {cos, sin, PI} = Math,
      TWOPI = 2 * PI;

const objects: {
  [key: string]: THREE.Mesh;
} = {};

/* general setup */
const scene = new THREE.Scene();

// renderer
const div = document.getElementById("container") as HTMLDivElement;
const rect = div.getBoundingClientRect();
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(rect.width, rect.height);

div.appendChild(renderer.domElement);

// camera
const camera = new THREE.PerspectiveCamera( 75, rect.width / rect.height, 0.1, 1000 );
// set the z-axis to be up, like we're used to in math
camera.up.set(0, 0, 1);
camera.position.set(3, 0.83, 2.15);
camera.lookAt(new THREE.Vector3(0, -3, 5));

// ​camera controls
const orbitControls = new (THREE as any).OrbitControls(camera, renderer.domElement);

// lights
const light = new THREE.AmbientLight(0x404040);
scene.add(light);

const lights = [];
lights.push(new THREE.PointLight(0xffffff, 1, 0));
lights.push(new THREE.PointLight(0xffffff, 1, 0));
lights.push(new THREE.PointLight(0xffffff, 1, 0));

​lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

// this is equivalent to calling scene.add(lights[0], lights[1], lights[2])
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
​scene.add(...lights);

/* populate the scene */
const elevation = 1.5;

const fiberColor = 0x1BBB68;
const baseColor  = 0x1A69B5;
const totalColor = 0xFFFF00;
const sectionColor = 0xFF7000;

// axes helper
scene.add(new THREE.AxesHelper(5));

// base circle
{
  const curve = new THREE.Curve<THREE.Vector3>();
  curve.getPoint = t => mobius(t, 0.5);
  const geometry = new THREE.TubeBufferGeometry(curve, 50, 0.02, 50, true);
  const material = new THREE.MeshBasicMaterial({color: baseColor});
  const line = new THREE.Mesh(geometry, material);
  scene.add(line);
}

// equatorial circle
{
  const curve = new THREE.Curve<THREE.Vector3>();
  curve.getPoint = t => mobius(t, 0.5);
  const geometry = new THREE.TubeBufferGeometry(curve, 50, 0.02, 50, true);
  const material = new THREE.MeshBasicMaterial({
    color: baseColor,
    opacity: 0.5,
    transparent: true
  });
  const line = new THREE.Mesh(geometry, material);
  line.position.z = elevation;
  scene.add(line);
}

// ball control
{
  const geometry = new THREE.SphereBufferGeometry(0.05, 20, 20);
  const material = new THREE.MeshBasicMaterial({color: baseColor});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(mobiusRadius,0,0);
  scene.add(mesh);
  objects.ball = mesh;      
}

// mobius strip
{
  const geometry = new THREE.ParametricBufferGeometry((theta, t, target) => {
    const R = mobiusRadius,
          r = 0.5,
          n = 1;

    theta *= TWOPI;
    t = -r + 2*r*t;

    target.set(
      cos(theta) * (R - t * sin(theta * n/ 2)),
      sin(theta) * (R - t * sin(theta * n/ 2)),
      t * cos(theta * n/ 2)
    );
  }, 50, 50);
  const material = new THREE.MeshPhongMaterial({
    color: totalColor,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.z = elevation;
  objects.mobius = mesh;
}

// fiber
{
  const geometry = new THREE.CylinderBufferGeometry(0.02, 0.02, 1);
  const material = new THREE.MeshBasicMaterial({color: fiberColor});
  const line = new THREE.Mesh(geometry, material);
  line.rotateX(TWOPI / 4);
  line.position.set(mobiusRadius, 0, elevation);
  scene.add(line);
  objects.fiber = line;
}

// section
{
  const curve = new THREE.Curve<THREE.Vector3>();
  curve.getPoint = t => mobius(t, 0.5 - Math.sin(t * Math.PI) / 2.5);
  const geometry = new THREE.TubeBufferGeometry(curve, 50, 0.02, 50, true);
  const material = new THREE.MeshBasicMaterial({color: 0xFF7000});
  const line = new THREE.Mesh(geometry, material);
  line.position.z = elevation;
  scene.add(line);
}

// drag functionality
makeMeshDraggable(
  objects.ball, {
    move: ({x, y}) => {
      const pos = screenToScene(x, y, new THREE.Plane(new THREE.Vector3(0, 0, 1)), renderer, camera);

      const theta = (Math.atan2(pos.y, pos.x) + TWOPI) % TWOPI;

      objects.ball.position.set(mobiusRadius * cos(theta), mobiusRadius * sin(theta), 0);

      const angle = theta / TWOPI;
      const [rotation, position] = arrowOrient(mobius(angle, 0), mobius(angle, 1));
      position.z = 1.5;
      objects.fiber.setRotationFromMatrix(rotation);
      objects.fiber.position.copy(position);
    }
  }, {
    // this is equivalent to camera: camera
    camera,
    container: div,
    controls: orbitControls,
    // this is equivalent to renderer: renderer
    renderer
  }
);

// handle resizes
window.addEventListener("resize", () => {
  const rect = div.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
});

// start animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

function mobius(theta: number, t: number) {
  const R = mobiusRadius,
        r = 0.5,
        n = 1;

  theta *= TWOPI;
  t = -r + 2*r*t;

  return new THREE.Vector3(
    cos(theta) * (R - t * sin(theta * n/ 2)),
    sin(theta) * (R - t * sin(theta * n/ 2)),
    t * cos(theta * n/ 2)
  );
}

function arrowOrient(pointX: THREE.Vector3, pointY: THREE.Vector3) {
  const direction = new THREE.Vector3().subVectors(pointY, pointX);
  const orientation = new THREE.Matrix4();
  orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
  orientation.multiply(new THREE.Matrix4().set(
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, -1, 0, 0,
    0, 0, 0, 1
  ));
  
  const position = new THREE.Vector3(
    (pointY.x + pointX.x) / 2,
    (pointY.y + pointX.y) / 2,
    (pointY.z + pointX.z) / 2
  );
  return [orientation, position] as [THREE.Matrix4, THREE.Vector3];
}
