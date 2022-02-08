/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _three_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./three-utils */ "./src/three-utils.ts");


const mobiusRadius = 2;
const { cos, sin, PI } = Math, TWOPI = 2 * PI;
const objects = {};
const scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
const div = document.getElementById("container");
const rect = div.getBoundingClientRect();
const renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({ antialias: true });
renderer.setSize(rect.width, rect.height);
div.appendChild(renderer.domElement);
const camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](75, rect.width / rect.height, 0.1, 1000);
camera.up.set(0, 0, 1);
camera.position.set(3, 0.83, 2.15);
camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, -3, 5));
const orbitControls = new three__WEBPACK_IMPORTED_MODULE_0__["OrbitControls"](camera, renderer.domElement);
const light = new three__WEBPACK_IMPORTED_MODULE_0__["AmbientLight"](0x404040);
scene.add(light);
const lights = [];
lights.push(new three__WEBPACK_IMPORTED_MODULE_0__["PointLight"](0xffffff, 1, 0));
lights.push(new three__WEBPACK_IMPORTED_MODULE_0__["PointLight"](0xffffff, 1, 0));
lights.push(new three__WEBPACK_IMPORTED_MODULE_0__["PointLight"](0xffffff, 1, 0));
lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);
scene.add(...lights);
const elevation = 1.5;
const fiberColor = 0x1BBB68;
const baseColor = 0x1A69B5;
const totalColor = 0xFFFF00;
const sectionColor = 0xFF7000;
scene.add(new three__WEBPACK_IMPORTED_MODULE_0__["AxesHelper"](5));
{
    const curve = new three__WEBPACK_IMPORTED_MODULE_0__["Curve"]();
    curve.getPoint = t => mobius(t, 0.5);
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["TubeBufferGeometry"](curve, 50, 0.02, 50, true);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: baseColor });
    const line = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    scene.add(line);
}
{
    const curve = new three__WEBPACK_IMPORTED_MODULE_0__["Curve"]();
    curve.getPoint = t => mobius(t, 0.5);
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["TubeBufferGeometry"](curve, 50, 0.02, 50, true);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({
        color: baseColor,
        opacity: 0.5,
        transparent: true
    });
    const line = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    line.position.z = elevation;
    scene.add(line);
}
{
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["SphereBufferGeometry"](0.05, 20, 20);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: baseColor });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    mesh.position.set(mobiusRadius, 0, 0);
    scene.add(mesh);
    objects.ball = mesh;
}
{
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["ParametricBufferGeometry"]((theta, t, target) => {
        const R = mobiusRadius, r = 0.5, n = 1;
        theta *= TWOPI;
        t = -r + 2 * r * t;
        target.set(cos(theta) * (R - t * sin(theta * n / 2)), sin(theta) * (R - t * sin(theta * n / 2)), t * cos(theta * n / 2));
    }, 50, 50);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshPhongMaterial"]({
        color: totalColor,
        side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"]
    });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    scene.add(mesh);
    mesh.position.z = elevation;
    objects.mobius = mesh;
}
{
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["CylinderBufferGeometry"](0.02, 0.02, 1);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: fiberColor });
    const line = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    line.rotateX(TWOPI / 4);
    line.position.set(mobiusRadius, 0, elevation);
    scene.add(line);
    objects.fiber = line;
}
{
    const curve = new three__WEBPACK_IMPORTED_MODULE_0__["Curve"]();
    curve.getPoint = t => mobius(t, 0.5 - Math.sin(t * Math.PI) / 2.5);
    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__["TubeBufferGeometry"](curve, 50, 0.02, 50, true);
    const material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]({ color: 0xFF7000 });
    const line = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
    line.position.z = elevation;
    scene.add(line);
}
Object(_three_utils__WEBPACK_IMPORTED_MODULE_1__["makeMeshDraggable"])(objects.ball, {
    move: ({ x, y }) => {
        const pos = Object(_three_utils__WEBPACK_IMPORTED_MODULE_1__["screenToScene"])(x, y, new three__WEBPACK_IMPORTED_MODULE_0__["Plane"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 0, 1)), renderer, camera);
        const theta = (Math.atan2(pos.y, pos.x) + TWOPI) % TWOPI;
        objects.ball.position.set(mobiusRadius * cos(theta), mobiusRadius * sin(theta), 0);
        const angle = theta / TWOPI;
        const [rotation, position] = arrowOrient(mobius(angle, 0), mobius(angle, 1));
        position.z = 1.5;
        objects.fiber.setRotationFromMatrix(rotation);
        objects.fiber.position.copy(position);
    }
}, {
    camera,
    container: div,
    controls: orbitControls,
    renderer
});
window.addEventListener("resize", () => {
    const rect = div.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
});
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
requestAnimationFrame(animate);
function mobius(theta, t) {
    const R = mobiusRadius, r = 0.5, n = 1;
    theta *= TWOPI;
    t = -r + 2 * r * t;
    return new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](cos(theta) * (R - t * sin(theta * n / 2)), sin(theta) * (R - t * sin(theta * n / 2)), t * cos(theta * n / 2));
}
function arrowOrient(pointX, pointY) {
    const direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]().subVectors(pointY, pointX);
    const orientation = new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]();
    orientation.lookAt(pointX, pointY, new three__WEBPACK_IMPORTED_MODULE_0__["Object3D"]().up);
    orientation.multiply(new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
    const position = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]((pointY.x + pointX.x) / 2, (pointY.y + pointX.y) / 2, (pointY.z + pointX.z) / 2);
    return [orientation, position];
}


/***/ }),

/***/ "./src/three-utils.ts":
/*!****************************!*\
  !*** ./src/three-utils.ts ***!
  \****************************/
/*! exports provided: screenToNDC, screenToScene, makeMeshDraggable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "screenToNDC", function() { return screenToNDC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "screenToScene", function() { return screenToScene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeMeshDraggable", function() { return makeMeshDraggable; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

function screenToNDC(x, y, renderer) {
    const rect = renderer.domElement.getBoundingClientRect();
    return new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"]((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1);
}
function screenToScene(x, y, plane, renderer, camera) {
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = screenToNDC(x, y, renderer), mouse = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](ndc.x, ndc.y, 0);
    mouse.unproject(camera);
    const dir = mouse.sub(camera.position).normalize();
    const distance = -plane.distanceToPoint(camera.position) / Math.cos(dir.angleTo(plane.normal));
    return camera.position.clone().add(dir.multiplyScalar(distance));
}
const dragHandlersSymbol = Symbol();
function makeMeshDraggable(mesh, listeners, args) {
    if (!args.container[dragHandlersSymbol]) {
        args.container[dragHandlersSymbol] = [];
        bindListeners(args);
    }
    listeners = Object.assign({ up: () => { }, down: () => { }, move: () => { } }, listeners);
    args.container[dragHandlersSymbol].push([mesh, listeners]);
}
function bindListeners({ camera, container, controls, renderer }) {
    let dragTarget, handler, touchId;
    const dragHandlers = container[dragHandlersSymbol];
    let dragging = false;
    const down = (e) => {
        let x, y;
        if (e instanceof MouseEvent) {
            [x, y] = [e.clientX, e.clientY];
        }
        else {
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            [x, y] = [touch.clientX, touch.clientY];
        }
        const mouse = screenToNDC(x, y, renderer);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        for (const [mesh, options] of dragHandlers) {
            const intersects = raycaster.intersectObject(mesh).length > 0;
            if (intersects) {
                controls.enabled = false;
                dragging = true;
                container.classList.add("dragging");
                dragTarget = mesh;
                handler = options;
                handler.down({ raycaster });
                break;
            }
        }
    };
    const move = (e) => {
        if (dragging) {
            if (e instanceof MouseEvent) {
                handler.move({ x: e.clientX, y: e.clientY });
            }
            else {
                for (const touch of Array.from(e.changedTouches)) {
                    if (touch.identifier !== touchId)
                        continue;
                    handler.move({ x: touch.clientX, y: touch.clientY });
                }
            }
        }
        else if (e instanceof MouseEvent) {
            const raycaster = new THREE.Raycaster();
            const mouse = screenToNDC(e.clientX, e.clientY, renderer);
            raycaster.setFromCamera(mouse, camera);
            for (const [mesh, cb] of dragHandlers) {
                const intersects = raycaster.intersectObject(mesh).length > 0;
                if (intersects) {
                    container.classList.add("draggable");
                    return;
                }
            }
            container.classList.remove("draggable");
        }
    };
    const up = (e) => {
        if (!dragging)
            return;
        controls.enabled = true;
        container.classList.remove("dragging");
        dragging = false;
    };
    container.addEventListener("touchstart", down);
    container.addEventListener("mousedown", down);
    container.addEventListener("mousemove", move);
    container.addEventListener("touchmove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchend", up);
    document.addEventListener("touchcancel", up);
}


/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = THREE;

/***/ })

/******/ });