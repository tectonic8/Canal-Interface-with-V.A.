var tagTargets = [];//One array for each type of target. One array for the minimap sprites.
var userVerifyTargets = [];
var vaVerifyTargets = [];
var targetSprites = [];

var targetTracker = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //0 means untagged, 1 means user verifies, 2 means va verifies, 3 means nonexistant
var tagTracker    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Keep track of how many tags are added to an image

var targetsVerified = 0; //score
var gpRecorder = [50, 470, 0, 0] //gpRecorder is not the global coordinates or the local coordinates. It's the global coordinates with an offset x-14, y-4412. It records all the local movement.

var miniSprite1coords = [500, 690];
var miniSprite2coords = [500, 690];

var targetsCoords = [
  [ 227, 4694],
  [ 416, 4394],
  [ 557, 4133],
  [ 708, 3924],
  [ 880, 3711],
  [1014, 3516],
  [1175, 3276],
  [1377, 3121],
  [1828, 3079],
  [2154, 3151],
  [2423, 3265],
  [2650, 3267],
  [2811, 3004],
  [2965, 2694],
  [3092, 2358],
  [3194, 1962],
  [3333, 1724],
  [3488, 1451],
  [3600, 1214],
  [3721,  960]
]; //absolute positions for 20 targets. See "canal3 with targets.png" in the hide folder to see what this looks like. Also, these aren't really ordered. The first 10 were in order, but the next ten were just put wherever there was space on the map. So target 19 is not necessarily at the end of the canal.

var targetDCoordinates = [
  0.0435, 0.0870, 0.1304, 0.1739, 0.2174, 0.2609, 0.3043, 0.3478, 0.4348,
  0.4783, 0.5217, 0.5652, 0.6087, 0.6521, 0.6957, 0.7826, 0.8261, 0.8696,
  0.9130, 0.9565
];

function d2x(d) {
  var omega = 4.932;
  var a0    = 1957;
  var a     = [-1255, -545.1, -247.1, 21.65, 96.48, 57.33,  9.179,  -21.07];
  var b     = [-1026, -24.18, 303.9,  187.4, 54.77, -12.83, -31.56, -4.434];
  var x = a0;
  for (var idx = 0; idx < a.length; ++idx) {
    x += a[idx] * Math.cos((idx + 1) * d * omega) + b[idx] * Math.sin((idx + 1) * d * omega);
  }
  return x;
};

function d2y(d) {
  var omega = 5.157;
  var a0    = -1548
  var a     = [471.4, 837.2, 375.9, 245.6,  98.05, 6.102,  -14.82, -22.15];
  var b     = [1186,  389.8, 77.28, -161.3, -117,  -94.79, -33.45, -25.23];
  var y  = a0;
  for (var idx = 0; idx < a.length; ++idx) {
    y += a[idx] * Math.cos((idx + 1) * d * omega) + b[idx] * Math.sin((idx + 1) * d * omega);
  }
  return y;
};

function updateTargets (x, y) { //draws the targets.
  for (var i = 0; i<=19; i++) {
    if (targetTracker[i] == 3) continue;
    if (targetTracker[i] == 0) {
      tagTargets[i].style.left = tagTargets[i].xPos - gpRecorder[2] + "px";
      tagTargets[i].style.top = tagTargets[i].yPos - gpRecorder[3] + "px";
    }
    else if (targetTracker[i] == 1) {
      userVerifyTargets[i].style.left = userVerifyTargets[i].xPos - gpRecorder[2] + "px";
      userVerifyTargets[i].style.top = userVerifyTargets[i].yPos - gpRecorder[3] + "px";            
    }
    else if (targetTracker[i] == 2 && vaVerifyTargets[i] !== undefined) {
      vaVerifyTargets[i].style.left = vaVerifyTargets[i].xPos - gpRecorder[2] + "px";
      vaVerifyTargets[i].style.top = vaVerifyTargets[i].yPos - gpRecorder[3] + "px";  
    }       
  }
}