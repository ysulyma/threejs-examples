function screenToNDC(x, y, renderer) {
  const rect = renderer.domElement.getBoundingClientRect();

  return new THREE.Vector2(
    (x - rect.left) / rect.width * 2 - 1,
    -(y - rect.top) / rect.height * 2 + 1
  );
}

function screenToScene(x, y, plane, renderer, camera) {
  const rect = renderer.domElement.getBoundingClientRect();
  const ndc = screenToNDC(x, y, renderer),
        mouse = new THREE.Vector3(ndc.x, ndc.y, 0);

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

  listeners = Object.assign({up: () => {}, down: () => {}, move: () => {}}, listeners);

  args.container[dragHandlersSymbol].push([mesh, listeners]);
}

function bindListeners({camera, container, controls, renderer}) {
  let dragTarget, handler, touchId;

  const dragHandlers = container[dragHandlersSymbol];

  let dragging = false;
  
  const down = (e) => {
    let x, y;

    if (e instanceof MouseEvent) {
      [x, y] = [e.clientX, e.clientY];
    } else {
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
        handler.down({raycaster});
        break;
      }
    }
  };

  const move = (e) => {
    if (dragging) {
      if (e instanceof MouseEvent) {
        handler.move({x: e.clientX, y: e.clientY});
      } else {
        for (const touch of Array.from(e.changedTouches)) {
          if (touch.identifier !== touchId) continue;

          handler.move({x: touch.clientX, y: touch.clientY});
        }
      }
    } else if (e instanceof MouseEvent) {
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
    if (!dragging) return;

    controls.enabled = true;
    container.classList.remove("dragging");
    dragging = false;
  };

  // XXX add touch events!!
  container.addEventListener("touchstart", down);
  container.addEventListener("mousedown", down);

  container.addEventListener("mousemove", move);
  container.addEventListener("touchmove", move);

  document.addEventListener("mouseup", up);
  document.addEventListener("touchend", up);
  document.addEventListener("touchcancel", up);
}
