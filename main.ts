const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const RADIUS = 20;

const DELTA_STEP = 1;
const RAY_SPREAD = 10;

type TPoint = {
  x: number;
  y: number;
};

class Sun {
  private center: TPoint;
  private r: number;

  constructor(x: number, y: number, r: number) {
    this.center = {
      x, y
    }
    this.r = r;
  }

  private ray(context: CanvasRenderingContext2D, heading: number) {
    var x = this.center.x;
    var y = this.center.y;
    var [x2, y2] = moveByHeading(x, y, heading);
    while (insideCanvas(x2, y2)) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
      x = x2; y = y2;
      [x2, y2] = moveByHeading(x, y, heading);
    }
  }

  private rays(context: CanvasRenderingContext2D) {
    var heading = 0
    while (heading < 360) {
      this.ray(context, heading);
      heading += RAY_SPREAD;
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    this.rays(context);
    context.beginPath();
    context.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
    context.fill();
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

const insideCanvas = (x: number, y: number): boolean =>
  x > 0 && y > 0 && x < CANVAS_WIDTH && y < CANVAS_HEIGHT

const moveByHeading = (x: number, y: number, heading: number): [number, number] =>
  [
    x + DELTA_STEP * Math.cos(heading * Math.PI / 180),
    y + DELTA_STEP * Math.sin(heading * Math.PI / 180),
  ]

new DrawingApp();
