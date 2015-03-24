angleMode = "radians"; /* more straight forward than degrees... */
var rotPerFrame = 1 / 32; /* "angular velocity" in radians/frame */
var wheelDiam = 180;
var tireProfile = 10;
var spokes = 7;
var spokeSize = 2.5;

var rotPerSpoke = processing.TWO_PI / spokes;
var radius = wheelDiam / 2 + tireProfile;
var axel = -8000;  /* x coordinate of the axel */
var rot = processing.TWO_PI;  /* current rotation of the spokes */

var drawSpokes = function () {
    processing.rotate(rot);
    processing.stroke(97, 64, 35);
    processing.strokeWeight(spokeSize);
    for (var i = 0; i < spokes; i++) {
        processing.line(0, 0, wheelDiam / 2, 0);
        processing.rotate(rotPerSpoke);
    }
};

var drawTire = function () {
    var diam = wheelDiam + tireProfile;
    processing.noFill();
    processing.stroke(35, 35, 35);
    processing.strokeWeight(tireProfile);
    processing.ellipse(0, 0, diam, diam);
};

var thickness = 29;
var drawRoad = function () {
    processing.noStroke();
    processing.fill(111, 111, 111);
    processing.rect(-400 - radius, radius, 800 + 2 * radius, thickness);
};

processing.draw = function () {
    processing.resetMatrix();
    processing.background(255, 255, 255);
    processing.translate(axel, 200);
    // drawRoad();
    drawSpokes();
    drawTire();

    rot -= rotPerFrame;
    if (rot < -processing.PI) {
        rot += processing.TWO_PI;
    }

    // axel -= radius * rotPerFrame;
    axel = 200;
    if (axel < -radius) {
        axel = 400 + radius;
    }
};
