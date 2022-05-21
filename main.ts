const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const RADIUS = 20;

type TPoint = {
  x: number;
  y: number;
};

class Sun {
  private x: number;
  private y: number;
  private r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.stroke();
  }
};

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private sun: Sun;

  private firstClick: TPoint | null = null;
  private walls: [TPoint, TPoint][] = [];

  constructor() {
    let canvas = document.getElementById('canvas') as
      HTMLCanvasElement;
    let context = canvas.getContext("2d");
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    this.sun = new Sun(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, RADIUS);

    this.canvas = canvas;
    this.context = context;

    this.redraw();
    this.createUserEvents();
  }

  private createUserEvents() {
    let canvas = this.canvas;

    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("touchstart", this.pressEventHandler);

    document.getElementById('clear')
      .addEventListener("click", this.clearEventHandler);
  }

  private redraw() {
    for (const wallPair of this.walls) {
      this.context.beginPath();
      this.context.moveTo(wallPair[0].x, wallPair[0].y);
      this.context.lineTo(wallPair[1].x, wallPair[1].y);
      this.context.stroke();
      this.context.closePath();
    }

    this.sun.draw(this.context);
  }

  private clickedAt(x: number, y: number) {
    if (this.firstClick === null)
      this.firstClick = {
        x, y
      }
    else {
      this.walls.push([this.firstClick, { x, y }]);
      this.firstClick = null;
    }
  }

  private clearCanvas(clearWalls = false) {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (clearWalls) this.walls = [];
  }

  private clearEventHandler = () => {
    this.clearCanvas(true);
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageX :
      (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageY :
      (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    this.clickedAt(mouseX, mouseY);
    if (this.firstClick === null) {
      this.clearCanvas();
      this.redraw();
    }
  }
}

new DrawingApp();
