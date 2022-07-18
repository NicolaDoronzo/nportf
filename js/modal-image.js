class ModalImage {
  static instance = null;
  static create(src) {
    if (ModalImage.instance) {
      ModalImage.instance._destroy();
    }
    console.log(src);
    ModalImage.instance = new ModalImage(src);
  }

  startMouseX = null;
  startMouseY = null;
  startPosition = null;
  objectPositionBuffer = [];

  get boundingRect() {
    return this.element.getBoundingClientRect();
  }

  get position() {
    const vals = this.element.style.backgroundPosition
      .split(" ")
      .map((v) => v.replace("%", ""));
    return {
      x: +vals[0],
      y: +vals[1],
    };
  }

  set position(v) {
    this.element.style.backgroundPosition = `${v.x}% ${v.y}%`;
  }

  get zoomLevel() {
    return (
      +this.element.style.backgroundSize
        .split(" ")
        [window.innerWidth > window.innerHeight ? 0 : 1].replace("%", "") / 100
    );
  }

  set zoomLevel(amt) {
    const percString = `${amt * 100}%`;
    this.element.style.backgroundSize =
      window.innerWidth > window.innerHeight
        ? `${percString} auto`
        : `auto ${percString}`;
  }

  constructor(src) {
    this.element = document.createElement("div");
    this.element.draggable = true;
    this._setInitialStyle(src);
    document.querySelector("#main-modal-content").appendChild(this.element);
    this._setImage(src);
    this._handleEvents();
  }

  _setInitialStyle() {
    this.element.style.position = "relative";
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.backgroundRepeat = "no-repeat";
    this.element.style.backgroundSize =
      window.innerWidth > window.innerHeight ? "100% auto" : "auto 100%";
    this.element.style.backgroundPosition = "50% 50%";
    this.element.style.willChange = "background-size";
    this.element.style.transition = "background-size .2s ease-out";
  }

  _setImage(src) {
    this.element.style.backgroundImage = `url('${src}')`;
  }

  _handleEvents() {
    this.element.addEventListener("touchstart", this._reset);
    this.element.addEventListener("touchmove", this._moveObjectPosition);
    this.element.addEventListener("dragstart", this._reset);
    this.element.addEventListener("dragover", this._onDrag);
    this.element.addEventListener("dragend", this._retainSecondLastPosition);
    this.element.addEventListener("click", this._onDoubleTap(this._zoom));
  }

  _onDoubleTap = (cb) => {
    let firstClickTime = Date.now();
    let isSecondTapping = false;
    return () => {
      const secondClickTime = Date.now();
      if (secondClickTime - firstClickTime < 600 && !isSecondTapping) {
        isSecondTapping = true;
        cb();
        setTimeout(() => (isSecondTapping = false), 600);
      }
      firstClickTime = Date.now();
    };
  };

  _zoom = () => (this.zoomLevel > 1 ? this._zoomOut() : this._zoomIn());

  _onDrag = (ev) => {
    const crt = this.element.cloneNode(true);
    crt.style.display = "none";
    document.body.appendChild(crt);
    ev.dataTransfer.setDragImage(crt, 0, 0);
    this._moveObjectPosition(ev);
  };

  _moveObjectPosition = (ev) => {
    const touch = ev.touches
      ? ev.touches.item(0)
      : { clientX: ev.clientX, clientY: ev.clientY };
    const relX = touch?.clientX - this.boundingRect.x;
    const relY = touch?.clientY - this.boundingRect.y;
    this.startMouseX = this.startMouseX || relX;
    this.startMouseY = this.startMouseY || relY;

    const deltaXPerc =
      ((this.startMouseX - relX) / this.element.clientWidth) * 100;
    const deltaYPerc =
      ((this.startMouseY - relY) / this.element.clientHeight) * 100;
    const { x, y } = this.startPosition;

    this.position = {
      x: clamp(0, 100, x + deltaXPerc),
      y: clamp(0, 100, y + deltaYPerc),
    };

    this._bufferToSecondLastPosition();
  };

  get secondLastPosition() {
    if (this.objectPositionBuffer.length === 2) {
      return this.objectPositionBuffer[0];
    } else return null;
  }

  _bufferToSecondLastPosition() {
    this.objectPositionBuffer.push(this.position);
    if (this.objectPositionBuffer.length > 2) {
      this.objectPositionBuffer.shift();
    }
  }

  _retainSecondLastPosition = () => {
    if (this.secondLastPosition) {
      this.position = this.secondLastPosition;
    }
  };

  _reset = (ev) => {
    ev?.dataTransfer?.setDragImage(new Image(), 0, 0);
    this.startMouseX = null;
    this.startMouseY = null;
    this.startPosition = this.position;
    this.objectPositionBuffer = [];
  };

  _zoomOut() {
    this.zoomLevel = 1;
  }

  _zoomIn() {
    this.zoomLevel = 2;
  }

  _destroy() {
    this.element.removeEventListener("dragstart", this._reset);
    this.element.removeEventListener("touchstart", this._reset);
    this.element.removeEventListener("touchmove", this._moveObjectPosition);
    this.element.removeEventListener("dragover", this._onDrag);
    this.element.removeEventListener("dragend", this._retainSecondLastPosition);
    this.element.removeEventListener("click", this._onDoubleTap(this._zoom));
    this.element.remove();
  }
}
