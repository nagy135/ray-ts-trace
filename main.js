var DrawingApp = /** @class */ (function () {
    function DrawingApp() {
        var _this = this;
        this.firstClick = null;
        this.walls = [];
        this.clearEventHandler = function () {
            _this.clearCanvas();
        };
        this.pressEventHandler = function (e) {
            var mouseX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var mouseY = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            mouseX -= _this.canvas.offsetLeft;
            mouseY -= _this.canvas.offsetTop;
            _this.clickedAt(mouseX, mouseY);
            if (_this.firstClick === null) {
                _this.clearCanvas();
                _this.redraw();
            }
        };
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        this.canvas = canvas;
        this.context = context;
        this.redraw();
        this.createUserEvents();
    }
    DrawingApp.prototype.createUserEvents = function () {
        var canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("touchstart", this.pressEventHandler);
        document.getElementById('clear')
            .addEventListener("click", this.clearEventHandler);
    };
    DrawingApp.prototype.redraw = function () {
        for (var _i = 0, _a = this.walls; _i < _a.length; _i++) {
            var wallPair = _a[_i];
            this.context.beginPath();
            this.context.moveTo(wallPair[0].x, wallPair[0].y);
            this.context.lineTo(wallPair[1].x, wallPair[1].y);
            this.context.stroke();
            this.context.closePath();
        }
    };
    DrawingApp.prototype.clickedAt = function (x, y) {
        if (this.firstClick === null)
            this.firstClick = {
                x: x,
                y: y
            };
        else {
            this.walls.push([this.firstClick, { x: x, y: y }]);
            this.firstClick = null;
        }
    };
    DrawingApp.prototype.clearCanvas = function () {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return DrawingApp;
}());
new DrawingApp();
//# sourceMappingURL=main.js.map