const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const RADIUS = 20;

const DELTA_STEP = 1;
const RAY_SPREAD = 3;

type TPoint = {
  x: number;
  y: number;
};


type TTuple<T = number> = [T, T]

class Sun {
  private center: TPoint;
  private r: number;

  public walls: TTuple<TPoint>[];

  constructor(x: number, y: number, r: number, walls: TTuple<TPoint>[]) {
    this.center = {
      x, y
    }
    this.r = r;
    this.walls = walls;
  }

  private ray(context: CanvasRenderingContext2D, heading: number) {
    var x = this.center.x;
    var y = this.center.y;
    var [x2, y2] = moveByHeading(x, y, heading);
    while (insideCanvas(x2, y2)) {

      let intersected = false;
      for (const wall of this.walls) {
        if (
          didIntersect(
            [
              [wall[0].x, wall[0].y],
              [wall[1].x, wall[1].y]
            ], [
            [x, y],
            [x2, y2]
          ]
          )
        ) {
          intersected = true;
          break;
        }
      }
      if (intersected) {
        break;
      }

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
  private walls: TTuple<TPoint>[] = [];

  constructor() {
    let canvas = document.getElementById('canvas') as
      HTMLCanvasElement;
    let context = canvas.getContext("2d");
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    this.sun = new Sun(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, RADIUS, this.walls);

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

const line = (t: TTuple<TTuple<number>>): [number, number, number] => {
  const A = (t[0][1] - t[1][1])
  const B = (t[1][0] - t[0][0])
  const C = (t[0][0] * t[1][1] - t[1][0] * t[0][1])
  return [A, B, -C]
}

const didIntersect = (
  L1: TTuple<TTuple<number>>,
  L2: TTuple<TTuple<number>>,
): boolean => {
  const l1: [number, number, number] = line(L1);
  const l2: [number, number, number] = line(L2);
  const D = l1[0] * l2[1] - l1[1] * l2[0]
  if (D !== 0) {
    const x = (l1[2] * l2[1] - l1[1] * l2[2]) / D;
    const y = (l1[0] * l2[2] - l1[2] * l2[0]) / D;
    return x >= Math.min(L2[0][0], L2[1][0]) &&
      x <= Math.max(L2[0][0], L2[1][0]) &&
      y >= Math.min(L2[0][1], L2[1][1]) &&
      y <= Math.max(L2[0][1], L2[1][1]) &&
      x >= Math.min(L1[0][0], L1[1][0]) &&
      x <= Math.max(L1[0][0], L1[1][0]) &&
      y >= Math.min(L1[0][1], L1[1][1]) &&
      y <= Math.max(L1[0][1], L1[1][1]);
  } else return false;
}

// def isBetween(a, b, c):
//

const insideCanvas = (x: number, y: number): boolean =>
  x > 0 && y > 0 && x < CANVAS_WIDTH && y < CANVAS_HEIGHT

const moveByHeading = (x: number, y: number, heading: number): [number, number] =>
  [
    Math.round(x + DELTA_STEP * Math.cos(heading * Math.PI / 180)),
    Math.round(y + DELTA_STEP * Math.sin(heading * Math.PI / 180)),
  ]

new DrawingApp();
