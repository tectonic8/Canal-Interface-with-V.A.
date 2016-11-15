var Map = (function() {
  return {
    tagTargets:        [],//One array for each type of target. One array for the minimap sprites.
    userVerifyTargets: [],
    vaVerifyTargets:   [],
    targetSprites:     [],

    targetTracker: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //0 means untagged, 1 means user verifies, 2 means va verifies, 3 means nonexistant
    tagTracker   : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Keep track of how many tags are added to an image

    targetsVerified: 0, //score
    gpRecorder: [50, 470, 0, 0], //gpRecorder is not the global coordinates or the local coordinates. It's the global coordinates with an offset x-14, y-4412. It records all the local movement.

    miniSprite1coords: [500, 690],
    miniSprite2coords: [500, 690],

    targetDCoordinates: [
      0.0435, 0.0870, 0.1304, 0.1739, 0.2174, 0.2609, 0.3043, 0.3478, 0.4348,
      0.4783, 0.5217, 0.5652, 0.6087, 0.6521, 0.6957, 0.7826, 0.8261, 0.8696,
      0.9130, 0.9565
    ],

    d2x: function(d) {
      var omega = 4.932;
      var a0    = 1957;
      var a     = [-1255, -545.1, -247.1, 21.65, 96.48, 57.33,  9.179,  -21.07];
      var b     = [-1026, -24.18, 303.9,  187.4, 54.77, -12.83, -31.56, -4.434];
      var x = a0;
      for (var idx = 0; idx < a.length; ++idx) {
        x += a[idx] * Math.cos((idx + 1) * d * omega) + b[idx] * Math.sin((idx + 1) * d * omega);
      }
      return x;
    },

    d2y: function(d) {
      var omega = 5.157;
      var a0    = -1548
      var a     = [471.4, 837.2, 375.9, 245.6,  98.05, 6.102,  -14.82, -22.15];
      var b     = [1186,  389.8, 77.28, -161.3, -117,  -94.79, -33.45, -25.23];
      var y  = a0;
      for (var idx = 0; idx < a.length; ++idx) {
        y += a[idx] * Math.cos((idx + 1) * d * omega) + b[idx] * Math.sin((idx + 1) * d * omega);
      }
      return y;
    },

    updateTargets: function(x, y) { //draws the targets.
      for (var i = 0; i<=19; i++) {
        if (Map.targetTracker[i] == 3) continue;
        if (Map.targetTracker[i] == 0) {
          Map.tagTargets[i].style.left = Map.tagTargets[i].xPos - Map.gpRecorder[2] + "px";
          Map.tagTargets[i].style.top = Map.tagTargets[i].yPos - Map.gpRecorder[3] + "px";
        }
        else if (Map.targetTracker[i] == 1) {
          Map.userVerifyTargets[i].style.left = Map.userVerifyTargets[i].xPos - Map.gpRecorder[2] + "px";
          Map.userVerifyTargets[i].style.top = Map.userVerifyTargets[i].yPos - Map.gpRecorder[3] + "px";            
        }
        else if (Map.targetTracker[i] == 2 && Map.vaVerifyTargets[i] !== undefined) {
          Map.vaVerifyTargets[i].style.left = Map.vaVerifyTargets[i].xPos - Map.gpRecorder[2] + "px";
          Map.vaVerifyTargets[i].style.top = Map.vaVerifyTargets[i].yPos - Map.gpRecorder[3] + "px";  
        }       
      }
    }
  }
})();