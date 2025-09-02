export class ZoomPanCanvas {
  constructor(canvas, drawCallback, width, height) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.drawCallback = drawCallback;

    this.width = width;
    this.height = height;

    this.scale = 1;
    this.originX = 0;
    this.originY = 0;

    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    this.MIN_SCALE = 0.5;
    this.MAX_SCALE = 5;

    this.zoom = this.zoom.bind(this);
    this.clampPan = this.clampPan.bind(this);
    this.getWorldCoords = this.getWorldCoords.bind(this);

    this.initEvents();
    this.draw();
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
  }

  initEvents() {
    this.canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 2) {
        return;
      }
      this.isDragging = true;
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      const dx = e.offsetX - this.lastX;
      const dy = e.offsetY - this.lastY;

      this.originX += dx;
      this.originY += dy;
      this.clampPan();

      this.lastX = e.offsetX;
      this.lastY = e.offsetY;

      this.draw();
    });

    document.addEventListener("mouseup", (e) => {
      if (e.button !== 2) {
        return;
        
      }
      this.isDragging = false;
    });

    this.canvas.addEventListener("wheel", this.zoom, { passive: false });
  }

  zoom(event) {
    event.preventDefault();
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    console.log(mouseX, mouseY);

    //   originX += mouseX / scale;
    //   originY += mouseY / scale;
    //   const zoom = event.deltaY < 0 ? 1.1 : 0.9;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(
      this.MAX_SCALE,
      Math.max(this.MIN_SCALE, this.scale * zoom)
    );

    const worldX = (mouseX - this.originX) / this.scale;
    const worldY = (mouseY - this.originY) / this.scale;

    this.scale = newScale;

    this.originX = mouseX - worldX * this.scale;
    this.originY = mouseY - worldY * this.scale;

    this.clampPan();
    this.draw();
  }

  clampPan() {
    const scaledWidth = this.width * this.scale;
    const scaledHeight = this.height * this.scale;

    const minX = this.width - scaledWidth;
    const minY = this.height - scaledHeight;
    const maxX = 0;
    const maxY = 0;

    if (this.originX < minX) this.originX = minX;
    if (this.originY < minY) this.originY = minY;
    if (this.originX > maxX) this.originX = maxX;
    if (this.originY > maxY) this.originY = maxY;
  }

  draw() {
    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.originX,
      this.originY
    );
    this.ctx.clearRect(
      -this.originX / this.scale,
      -this.originY / this.scale,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale
    );

    this.drawCallback(this.ctx, this.scale, this.originX, this.originY);
  }

  getWorldCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const worldX = (mouseX - this.originX) / this.scale;
    const worldY = (mouseY - this.originY) / this.scale;

    return { x: worldX, y: worldY };
  }
}
