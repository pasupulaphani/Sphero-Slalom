(function ()
{
  //"use strict";

  var app = WinJS.Application;
  var sphero = null;
  var sensor = null;
  var reader = null;
  var kinectSDK = WindowsPreview.Kinect;
  var initialising = false;
  var initialised = false;
  var initialisedHands = false;

  var zeroPointValues = 0;
  var forearmValues = 0;
  var biceptValues = 0;
  var count= 0;
  var avZeroPoint = 0;
  var maxArm = 0;
  var zone = 1;
  var prevZone = 1;
  var avBicept = 0;
  var forearmValues = 0;
  var avForearm = 0;
  
  var direction = 0;

  var spheroPlays = true;



  var magicNumbers =
    {
      xRangeMin : 0.1,
      xRangeMax: 0.5,     
      zRangeMin : 0.2,
      zRangeMax: 0.7,
    };

  // for angles 0 to 360 
  magicNumbers.xRangeMultipler = 360.0 / (magicNumbers.xRangeMax - magicNumbers.xRangeMin);

  // for speeds 0 to 1
  magicNumbers.zRangeMultiplier = 1.0 / (magicNumbers.zRangeMax - magicNumbers.zRangeMin);

  app.onactivated = function (args)
  {
      console.log("activating");
      if (spheroPlays) {
          var promise = initialiseSpheroAsync();

          promise.done(
            function () {
                initialiseKinect();

            });
      }
      else
      {
          initialiseKinect();
      }

      
  };
  setInterval(function() {
      if (uiSph.started && !initialising) {
          start();
      }
  }, 100);

  function start() {
      console.log("Timer started ...");
      initialising = true;
      var tempCount = 0;
      
      setTimeout(function () { uiSph.showYellow(); console.log("Mini timer finished ..."); }, 1500);
      setTimeout(function () { uiSph.showGreen(); initialised = true; console.log("Timer finished ..."); }, 3000);
      setTimeout(function () { uiSph.turnOffLights = true; uiSph.resetLigt(); console.log("Mini timer finished ..."); }, 4500);

      uiSph.showRed();
  }
  function initialiseSpheroAsync()
  {
    var promise = MySpheroLibrary.SpheroControl.getFirstConnectedSpheroAsync();
    promise.done(
      function (foundSphero)
      {
        sphero = foundSphero;
        sphero.backlightBrightness = 1.0;
        sphero.red = 255;
      }
    );
    return (promise);
  }
  function initialiseKinect()
  {
    sensor = kinectSDK.KinectSensor.getDefault();
    sensor.open();

    // we're interested in skellingtons...
    reader = sensor.bodyFrameSource.openReader();
    reader.onframearrived = onFrameArrived;
  }
  function onFrameArrived(e)
  {
     // uiSph.angle += 1;
      //if (uiSph.angle > 360)
      //    uiSph.angle = 0;
     // console.log(uiSph.angle);

    //  console.log("Kinect frame arrived!");
    var frame = e.frameReference.acquireFrame();
    var body = null;
    var i = 0;
    var leftHand, rightHand, leftHip, rightShoulder;
    var leftDistance = 0;
    var rightDistance = 0;
    var bodies = null;

    // we don't always get frames...
    if (frame != null)
    {
      if (!bodies)
      {
        bodies = new Array(frame.bodyCount);
      }
      // populate the array of bodies...
      frame.getAndRefreshBodyData(bodies);

      // try and find the first one that we have identified as tracked...
      for (i = 0; i < frame.bodyCount; i++)
      {
        if (bodies[i].isTracked)
        {
          body = bodies[i];
          break;
        }
      }
      // if we got one...
      if (body)
      {
        leftHand = getJoint(body, kinectSDK.JointType.handLeft);
        rightHand = getJoint(body, kinectSDK.JointType.handRight);
        leftElbow = getJoint(body, kinectSDK.JointType.elbowLeft);
        rightElbow = getJoint(body, kinectSDK.JointType.elbowRight);
        rightShoulder = getJoint(body, kinectSDK.JointType.shoulderRight);
        leftShoulder = getJoint(body, kinectSDK.JointType.shoulderLeft);

        //Joint rightHand = body.Joints[JointType.HandRight];
        //Joint leftHand = body.Joints[JointType.HandLeft];
        //Joint rightElbow = body.Joints[JointType.ElbowRight];
        //Joint leftElbow = body.Joints[JointType.ElbowLeft];
         
        //Joint rightShoulder = body.Joints[JointType.ShoulderRight];
          //Joint leftShoulder = body.Joints[JointType.ShoulderLeft];


       // return;

        if (areTracked(leftHand, rightHand, leftElbow, rightElbow, leftShoulder, rightShoulder))
        {
          //rotate(leftHand.position, leftHip.position);
            //drive(rightHand.position, rightShoulder.position);
            uiSph.tracked = true;
           rotateanddrive(leftHand.position, rightHand.position, leftElbow.position, rightElbow.position, leftShoulder.position, rightShoulder.position, initialising, initialised);
        }
        else {
            uiSph.tracked = false;
        }
      }
      frame.close();
    }
  }
  function getJoint(body, jointType)
  {
    var joint = null;

    // I'm sure there's a better way of moving through these slightly odd
    // feeling iterators in JS...
    var iter = body.joints.first();

    while (iter.hasCurrent)
    {
      if (iter.current.key === jointType)
      {
        joint = iter.current.value;
        break;
      }
      iter.moveNext();
    }
    return (joint);
  }
  function areTracked()
  {
    var tracked = true;

    for (var i = 0; ((i < arguments.length) && (tracked)) ; i++)
    {
      tracked = arguments[i] &&
        (arguments[i].trackingState === kinectSDK.TrackingState.tracked);
    }
    return (tracked);
  }
  //function rotate(leftHandPosition, leftHipPosition)
  //{
  //  var xDistance = Math.abs(leftHandPosition.x - leftHipPosition.x);
  //  var clampedValue = 0;

  //  if ((xDistance >= magicNumbers.xRangeMin) && (xDistance <= magicNumbers.xRangeMax))
  //  {
  //    clampedValue =
  //      (xDistance - magicNumbers.xRangeMin) * magicNumbers.xRangeMultipler;

  //    sphero.rotation = clampedValue;
  
  //     angle = clampedValue;
  //  }
  //}
  //function drive(rightHandPosition, rightShoulderPosition)
  //{
  //  var zDistance = Math.abs(rightHandPosition.z - rightShoulderPosition.z);
  //  var clampedValue = 0;

  //  if ((zDistance >= magicNumbers.zRangeMin) && (zDistance <= magicNumbers.zRangeMax))
  //  {
  //    clampedValue =
  //      (zDistance - magicNumbers.zRangeMin) * magicNumbers.zRangeMultiplier;

  //    sphero.roll(clampedValue);
       
  //  }
  //}

  function  Euclidean(p1, p2)
  {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)  + Math.pow(p1.z - p2.z, 2));
  }

  function rotateanddrive(leftHandPosition, rightHandPosition, leftElbowPosition, rightElbowPosition, leftShoulderPosition, rightShoulderPosition, initialising, initialised) {
      
      {


          if (initialising && !initialised)
          {
              // Initialisation phase
              console.log("Initialising ...");
              zeroPointValues += (((leftShoulderPosition.z - leftHandPosition.z) + (rightShoulderPosition.z - rightHandPosition.z)) / 2.0);
              forearmValues += (Euclidean(rightElbowPosition, rightHandPosition) + Euclidean(leftElbowPosition, leftHandPosition));
              biceptValues += (Euclidean(rightElbowPosition, rightShoulderPosition) + Euclidean(leftElbowPosition, leftShoulderPosition));
              count++;
          }
          if (initialised)
          {
              if (!initialisedHands)
              {
                  console.log("Initialising hands ...");
                  avZeroPoint = zeroPointValues / count;
                  var avBicept = biceptValues / (count * 2);
                  var avForearm = forearmValues / (count * 2);
                  maxArm = avBicept + avForearm;
                  initialisedHands = true;
              }
              else
              {
                  //console.log("Control phase ...");
                  // Control phase
                  var shoulderZAv = (rightShoulderPosition.z + leftShoulderPosition.z) /2.0;
                  var maxZDist = maxArm * 0.95;
                  var minZDist = maxArm *0.05;

                  var handsZAv = shoulderZAv - (rightHandPosition.z + leftHandPosition.z) / 2.0;
                  var currentDist = handsZAv - avZeroPoint;
                  var speed = 0;
                  var rotation = 0;

                  if (currentDist > 0)
                  {
                      speed = currentDist / Math.abs(avZeroPoint - maxZDist);
                      if (speed > 1)
                      {
                          speed = 1;
                      }

                      // Deadzone
                      if (speed < 0.1)
                      {
                          speed = 0;
                      }
                      else {
                          zone = 1;
                      }
                      uiSph.speed = speed;
                      speed = speed / 2.0;
                      

                      //Debug.WriteLine(speed);
                  }
                  else if (currentDist < 0)
                  {

                      // Deadzone
                      speed = currentDist / Math.abs(avZeroPoint - minZDist);
                      if (speed < -1)
                      {
                          // TODO : check if this is valid or should rotate to reverse
                          speed = -1;
                      }
                      if (speed > -0.1)
                      {
                          speed = 0;

                      }
                      else 
                      {
                          zone = -1;
                      }
                                        
                      uiSph.speed = speed;
                      speed = speed / -2.0;
                      

                                        

                      //Debug.WriteLine(speed);
                  }
                  var CheckZone = prevZone + zone;
                  if (CheckZone == 0)
                  {
                      direction = direction + 180;
                  }
                  prevZone = zone;
                                    

                  var handsX = (leftHandPosition.x - rightHandPosition.x);
                  var handsY = (leftHandPosition.y - rightHandPosition.y);
                  var norm = Math.sqrt(Math.pow(handsX, 2) + Math.pow(handsY, 2));
                  var normHandsX = handsX / norm;
                  var normHandsY = handsY / norm;
                  var normAxisX = 0;
                  var normAxisY = 1;
                  var rotationAngle = Math.atan((normHandsX * normAxisX) + (normHandsY * normAxisY)) * 180 / Math.PI;
                                    
                  rotationAngle = rotationAngle * 2; // hack

                  if (rotationAngle > 5 || rotationAngle < -5)
                  {
                      if (rotationAngle > 60)
                      {
                          rotationAngle = 60;
                      }
                      else if (rotationAngle < -60)
                      {
                          rotationAngle = -60;
                      }
                      direction += rotationAngle / 30.0;

                                        
                  }

                  if (direction < 0)
                  {
                      direction = direction + 360;
                  }
                  else if (direction > 360)
                  {
                      direction = direction - 360;
                  }

                  if (rotationAngle < 0)
                      uiSph.angle = rotationAngle + 360;
                  else
                      uiSph.angle = rotationAngle;
                 // uiSph.angle += 1;
                 // if (uiSph.angle > 360)
                  //    uiSph.angle = 0;

                  //console.log(direction + "    " + speed);
                  console.log(uiSph.angle);
                  

                  //Debug.WriteLine(speed);
                  if (spheroPlays)
                  {
                      //m_robot.Roll(direction, speed);
                      //sphero.roll2(speed,direction);
                      sphero.roll2(speed, direction);
                                        
                  }
              }
          }

      }
  }

  app.start();

})();