uiSph = {
    angle: 0,
    redLight: false,
    yellowLight: false,
    greenLight: false,
    resetLigt: function () {
        redLight = false;
        yellowLight = false;
        greenLight = false;
    },
    showRed: function () {
        this.resetLigt();
        this.redLight = true;
    },
    showYellow: function () {
        this.resetLigt();
        this.yellowLight = true;
    },
    showGreen: function () {
        this.resetLigt();
        this.greenLight = true;
    },
    debugMsg: '',
    started: false,
    tracked: false,
    speed: 0,
    turnOffLights: false
};

function startButtonClick() {
    uiSph.started = true;
}

function sketchProc(processing) {
    // Override draw function, by default it will be called 60 times per second
    //<Description> Transform multiple images using Matrix. </Description>
    $p = processing;
    // Declare operatorVariables
    var samRotation = 0;
    var samScaleX = 1.0;
    var samScaleY = 1.0;

    var r = 0;
    var u = 0;
    var u2 = 0;
    var sizeX = 500;
    var sizeY = 500;


    var spunkySam = processing.loadImage("/images/steeringwheel.png");
    var wheel0001 = processing.loadImage("/images/wheel0001.png");
    var wheel0002 = processing.loadImage("/images/wheel0002.png");
    var up0 = processing.loadImage("/images/0.png");
    var up1 = processing.loadImage("/images/1.png");
    var up2 = processing.loadImage("/images/2.png");
    var up3 = processing.loadImage("/images/3.png");
    var down1 = processing.loadImage("/images/-1.png");
    var down2 = processing.loadImage("/images/-2.png");
    var down3 = processing.loadImage("/images/-3.png");
    var bgImg = processing.loadImage("/images/bg.png");
    var overlay = processing.loadImage("/images/inside.png");
    var trafficlights0001 = processing.loadImage("/images/trafic lights0001.png");
    var trafficlights0002 = processing.loadImage("/images/trafic lights0002.png");
    var trafficlights0003 = processing.loadImage("/images/trafic lights0003.png");

    processing.setup = function () {
        processing.width = 1900;
        processing.height = 1000;
    }
    // Begin Game Loop
    processing.draw = function () {
        // Black Backgrounds save power on handheld devices ;)
        processing.background(bgImg); // Set color(greyscale)


        processing.image(overlay, 0, 0); // Display image (name, x, y)
        processing.popMatrix(); // Restore Matrix to previous settings

        if (uiSph.speed == 0) {
            processing.image(up0, 0, 0); // Display image (name, x, y)

        } else if (uiSph.speed > 0 && uiSph.speed <= 0.3) {

            processing.image(up1, 0, 0); // Display image (name, x, y)
        } else if (uiSph.speed > 0.3 && uiSph.speed <= 0.6) {

            processing.image(up2, 0, 0); // Display image (name, x, y)
        } else if (uiSph.speed > 0.6) {

            processing.image(up3, 0, 0); // Display image (name, x, y)
        } else if (uiSph.speed < 0 && uiSph.speed >= -0.3) {

            processing.image(down1, 0, 0); // Display image (name, x, y)
        } else if (uiSph.speed < -0.3 && uiSph.speed >= -0.6) {

            processing.image(down2, 0, 0); // Display image (name, x, y)
        } else if (uiSph.speed < -0.6) {

            processing.image(down3, 0, 0); // Display image (name, x, y)
        }
        processing.popMatrix(); // Restore Matrix to previous settings

        // lights
       // processing.fill(0, 30, 0);               // black
        //processing.rect(90, 30, 70, 180);        // box for traffic light

        if (uiSph.redLight && !uiSph.turnOffLights) {
          //  processing.fill(255, 0, 0);             // color Red 
           // processing.ellipse(125, 60, 50, 50);     // first light
            processing.image(trafficlights0001, 0, 0); // Display image (name, x, y)
            processing.popMatrix(); // Restore Matrix to previous settings
        }
        if (uiSph.yellowLight && !uiSph.turnOffLights) {
           // processing.fill(255, 255, 0);           // color Yellow
           // processing.ellipse(125, 115, 50, 50);    // second light
            processing.image(trafficlights0002, 0, 0); // Display image (name, x, y)
            processing.popMatrix(); // Restore Matrix to previous settings
        }
        if (uiSph.greenLight && !uiSph.turnOffLights) {
            //processing.fill(0, 255, 0);             // color Yellow
            //processing.ellipse(125, 175, 50, 50);    // third light
            processing.image(trafficlights0003, 0, 0); // Display image (name, x, y)
            processing.popMatrix(); // Restore Matrix to previous settings
        }
        

        // start / stop button

        //processing.fill(78, 138, 168);               // blue
        //processing.rect(90, 270, 70, 30);        // box for traffic light


        // debug
        //processing.text("Debug" + uiSph.debugMsg, 10, 30);


        // Update Variables
        samRotation++;

        // Push Transformations onto Matrix Stack
        processing.pushMatrix();
        processing.translate(processing.width / 2, 900);
        processing.rotate(processing.radians(uiSph.angle));
        //processing.scale(samScaleX, samScaleY);

        // Center image to 0,0 ( 128 X 128 Image = -64,-64 )
        //current image size 
        var samSizeX = 573;
        var samSizeY = 222;

        if (uiSph.tracked) {

            processing.image(wheel0002, -365, -400); // Display image (name, x, y)
        } else {

            processing.image(wheel0001, -365, -400); // Display image (name, x, y)
        }
        processing.popMatrix(); // Restore Matrix to previous settings


    }; // End Game Loop




}

setInterval(function () {
    //uiSph.angle = Math.floor((Math.random() * 360) + 1) - 180;
}, 3000);

setInterval(function () {
   // uiSph.showRed();
   // uiSph.tracked = true;
    //uiSph.speed = Math.random(10) / 10;


}, 1000);

// attaching the sketchProc function to the canvas
(function () {
    // your page initialization code here
    // the DOM will be available here
    var canvas = document.getElementById("canvas1");
    console.warn(canvas)
    //var processingInstance = new Processing(canvas, sketchProc);
})();

function setDebugStatus(msg) {
    //document.getElementById("debugMsg").text = msg;
}
