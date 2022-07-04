/**
 * @param vp the drawing canvas
 * @param config if provided it will update the default config
 */
export var setup = function (vp, config) {
    if (config === void 0) { config = defaultConfig; }
    var ctx = vp.getContext("2d");
    ctx.lineCap = "round";
    ctx.miterLimit = 1;
    setConfig(ctx, config);
    vp.style.imageRendering = "pixelated";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    /**
     * stores previous mouse drag data
     */
    var prev = [];
    var newPoint;
    function draw() {
        var fac = 0.6;
        if (prev.length == 0) {
            prev.push(newPoint);
            return;
        }
        if (newPoint && prev[0]) {
            var x = newPoint.x * fac + prev[0].x * (1 - fac);
            var y = newPoint.y * fac + prev[0].y * (1 - fac);
            newPoint.x = x;
            newPoint.y = y;
            if (getLength({ x: newPoint.x - prev[0].x, y: newPoint.y - prev[0].y }) > 4)
                prev.push(newPoint);
            //try drawing a curve with the points in prev
            prev = drawCurve(ctx, prev);
        }
    }
    function stopDrawing() {
        drawCurve(ctx, [prev[0], prev[0], newPoint], true);
        prev = [];
    }
    var state;
    var update = function () {
        state == "drawing" && draw();
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    function handleTouchStart(e) {
        state = "drawing";
        var rect = vp.getBoundingClientRect();
        var x = e.touches[0].clientX - rect.x;
        var y = e.touches[0].clientY - rect.y;
        var dx = 0;
        var dy = 0;
        newPoint = { x: x, y: y, dx: dx, dy: dy };
    }
    function handleMouseDown(e) {
        if (e.buttons != 1)
            return;
        state = "drawing";
        var rect = vp.getBoundingClientRect();
        var x = e.clientX - rect.x;
        var y = e.clientY - rect.y;
        var dx = e.movementX;
        var dy = e.movementY;
        newPoint = { x: x, y: y, dx: dx, dy: dy };
    }
    function handleMouseMove(e) {
        var rect = vp.getBoundingClientRect();
        var x = e.clientX - rect.x;
        var y = e.clientY - rect.y;
        var dx = e.movementX;
        var dy = e.movementY;
        newPoint = { x: x, y: y, dx: dx, dy: dy };
    }
    function handleTouchMove(e) {
        var rect = vp.getBoundingClientRect();
        var x = e.touches[0].clientX - rect.x;
        var y = e.touches[0].clientY - rect.y;
        var dx = 0;
        var dy = 0;
        newPoint = { x: x, y: y, dx: dx, dy: dy };
    }
    function handleTouchEnd() {
        state = "stop";
        stopDrawing();
    }
    function handleMouseUp() {
        state = "stop";
        stopDrawing();
    }
};
export var defaultConfig = {
    stroke: { width: 1, style: "red" },
    background: { checkered: {} },
};
/**
 * change the drawing configuration
 * @param ctx the context which you want to configure
 * @param config the configuration
 */
export var setConfig = function (ctx, config) {
    ctx.lineWidth = config.stroke.width || 5;
    ctx.strokeStyle = config.stroke.style || "black";
    if (config.background)
        if (config.background.checkered) {
            var _a = config.background.checkered, colorA = _a.colorA, colorB = _a.colorB;
            ctx.canvas.style.background = "repeating-conic-gradient(".concat(colorA || "white", " 0% 25%, ").concat(colorB || "#ddd", " 25% 50%) 0px 0px / 20px 20px");
        }
        else
            ctx.canvas.style.background = config.background.solid.color || "white";
};
function drawCurve(ctx, prev, end) {
    if (end === void 0) { end = false; }
    if (prev.length % 3 == 0) {
        var p0 = prev[0];
        var p1 = prev[1];
        var p2 = prev[2];
        var d1 = getDistance(p0, p1);
        var d2 = getDistance(p1, p2);
        var a = 0.5, d1_a = Math.pow(d1, a), d1_2a = d1_a * d1_a, d2_a = Math.pow(d2, a), d2_2a = d2_a * d2_a;
        var aIn = 2 * d2_2a + 3 * d2_a * d1_a + d1_2a, nIn = 3 * d2_a * (d2_a + d1_a);
        var hIn = {
            x: (d2_2a * p0.x + aIn * p1.x - d1_2a * p2.x) / nIn - p1.x,
            y: (d2_2a * p0.y + aIn * p1.y - d1_2a * p2.y) / nIn - p1.y,
        };
        var aOut = 2 * d1_2a + 3 * d1_a * d2_a + d2_2a, nOut = 3 * d1_a * (d1_a + d2_a);
        var hOut = {
            x: (d1_2a * p2.x + aOut * p1.x - d2_2a * p0.x) / nOut - p1.x,
            y: (d1_2a * p2.y + aOut * p1.y - d2_2a * p0.y) / nOut - p1.y,
        };
        // prev = style(ctx, [prev[0], prev[1]]).prev;
        // ctx.strokeStyle = style(ctx, [prev[0], prev[1]]).gradient;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        if (getDistance(p0, p1) < 2) {
            ctx.lineTo(p1.x, p1.y);
        }
        else {
            ctx.bezierCurveTo(p0.hOut ? p0.x + p0.hOut.x : p0.x, p0.hOut ? p0.y + p0.hOut.y : p0.y, p1.x + hIn.x, p1.y + hIn.y, p1.x, p1.y);
        }
        if (end)
            ctx.bezierCurveTo(p1.x + hOut.x, p1.y + hOut.y, p2.x, p2.y, p2.x, p2.y);
        ctx.stroke();
        //insert the computed data
        p1.hIn = hIn;
        p1.hOut = hOut;
        prev = [p1, p2];
    }
    return prev;
}
//util functions
function getLength(p) {
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
function getDistance(p0, p1) {
    return Math.sqrt(Math.pow((p0.x - p1.x), 2) + Math.pow((p0.y - p1.y), 2));
}
