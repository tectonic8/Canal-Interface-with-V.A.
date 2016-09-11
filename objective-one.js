(function(window, document) {
  /* Constants for the application. */
  var ATTRIBUTES = {
    HEIGHT: 'height',
    ID:     'id',
    WIDTH:  'width'
  };
  
  var CLASSES = {
    TARGET: 'target'
  };
  
  var ELEMENT_IDS = {
    buddySprite: 'boatSprite2',
    canvas:      'canvas',
    clock:       'clockDiv',
    divWrapper:  'bigWrapper',
    gowanusMap:  'gowanusMap',
    minimap:     'minimap',
    miniSprite1: 'miniSprite1',
    miniSprite2: 'miniSprite2',
    scoreDiv:    'scoreDiv',
    userSprite:  'boatSprite1'
  };
  
  var ELEMENTS = {
    IMG: 'img'
  };
  
  var EVENTS = {
    DOM_CONTENT_LOADED: 'DOMContentLoaded',
    GAMEPADCONNECTED:   'gamepadconnected',
    LOAD:               'load',
    MOUSEDOWN:          'mousedown',
    MOUSEMOVE:          'mousemove',
    MOUSEUP:            'mouseup',
    READY_STATE_CHANGE: 'readystatechange'
  };
  
  var HTTP_HEADER_VALUES = {
    APPLICATION:  'application',
    CHARSET:      'charset',
    FORM_ENCODED: '/x-www-form-urlencoded',
    JSON:         '/json',
    UTF_8:        'UTF-8'
  };
  
  var HTTP_REQUEST_HEADERS = {
    CONTENT_TYPE: 'Content-Type'
  };
  
  var HTTP_STATUS_CODES = {
    OK: 200
  };
  
  var HTTP_VERBS = {
    GET:  'GET',
    POST: 'POST'
  }
  
  var IMAGES = {
    MINI_TARGET:      'miniTarget.png',
    TAG_TARGET:       'target.png',
    VERIFY_TARGET:    'target2.png',
    VA_VERIFY_TARGET: 'target3.png'
  };
  
  var LOCATIONS = {
    APPEND:  '/append',
    SAVE:    '/save',
    SURVEY2: 'survey2',
    TAG:     'tag.html',
    VA_SAVE: '/vaSave',
    VERIFY:  'verify.html'
  };
  
  var STRINGS = {
    DEGREES:              'deg',
    MINI_TARGET:          'miniTarget',
    ON_GAMEPAD_CONNECTED: 'ongamepadconnected',
    PX:                   'px',
    ROTATE:               'rotate',
    TWO_D:                '2d',
    USER_VERIFY_TARGET:   'userVerifyTarget'
  };
  
  var STYLES = {
    HIDDEN:  'hidden',
    VISIBLE: 'visible'
  };
  
  /* "Global" variables used by the application. */
  var buddySprite = null;
  var canvas      = null;
  var clock       = null;
  var divWrapper  = null;
  var gowanusMap  = null;
  var minimap     = null;
  var miniSprite1 = null;
  var miniSprite2 = null;
  var scoreDiv    = null;
  var userSprite  = null;
  
  /* Contexts for the canvas elements. */
  var ctx            = null;
  var minimapContext = null;
  
  /* Offsets for scrolling the map. */
  var canvasTopMargin  = -4400;
  var canvasLeftMargin =     0;
  
  /* Starting coordinates for the virtual agent. */
  var vaInitialX     =  20;
  var vaInitialY     = 550;
  var vaMiniInitialX = 500;
  var vaMiniInitialY = 690;
  var vaMagnitude    =   0;
  var vaLastRole     = 'navigating';
  var vaBehavior     = Math.random() < 0.5;
  var vaAcceleration =   0;
  
  /* Starting coordinates for the user agent. */
  var userInitialX     =  50;
  var userInitialY     = 470;
  var userMiniInitialX = 500;
  var userMiniInitialY = 690;
  
  /* Whether or not we need to fast forward. */
  var fastForward = false;
  
  /* The application runs for seven minutes. */
  sevenMinutesInMillis = 420000;
  
  /* The game updates at 60 frames per second. */
  framesPerSecond60 = 1000 / 60;
  
  /* Load time is factored into how long the virtual agent should fast forward.
   */
  var loadTime = 0;
  
  /* Polygon representation of the canal. The tolerance might be a little too
   * high, since I didn't go exactly around the perimeter.
   */
  var canalTriacontapentagon = [
    [   0, 2318], [  84, 2318], [ 430, 1755], [ 552, 1617], [ 656, 1533],
    [ 812, 1499], [1055, 1531], [1292, 1583], [1495, 1265], [1510, 1067],
    [1899,  327], [1972,  365], [1584, 1101], [1580, 1286], [1623, 1319],
    [1527, 1474], [1483, 1445], [1344, 1663], [1370, 1754], [1611, 1909],
    [1566, 1975], [1311, 1817], [1279, 1683], [ 906, 1583], [ 766, 1579],
    [1098, 1797], [1050, 1863], [ 675, 1626], [ 569, 1721], [ 809, 1878],
    [ 770, 1948], [ 525, 1793], [  75, 2480], [ 144, 2626], [   0, 2655]
  ];
  
  /* Polygon representation of the canal for the virtual agent. This is used so
   * the virtual agent can't enter the side canals. Also, it is actually an
   * icosikaiheptagon, not a triacontapentagon, but the former seems a little
   * cumbersome.
   */
  var vaCanalTriacontapentagon = [
    [   0, 2318], [  84, 2318], [ 430, 1755], [ 552, 1617], [ 656, 1533],
    [ 812, 1499], [1055, 1531], [1292, 1583], [1495, 1265], [1510, 1067],
    [1899,  327], [1972,  365], [1584, 1101], [1580, 1286], [1623, 1319],
    [1527, 1474], [1483, 1445], [1344, 1663], [1279, 1683], [ 906, 1583],
    [ 766, 1579], [ 675, 1626], [ 569, 1721], [ 525, 1793], [  75, 2480],
    [ 144, 2626], [   0, 2655]
  ];
  
  /* The coordinates are multiplied because they were recorded for the map
   * image that was half the size.
   */
  for (var i = 0; i<= 34; i++) {
    canalTriacontapentagon[i][0] *= 2;
    canalTriacontapentagon[i][1] *= 2;
  }
  for (var i = 0; i<= 26; i++) {
    vaCanalTriacontapentagon[i][0] *= 2;
    vaCanalTriacontapentagon[i][1] *= 2;
  }
  /* Absolute positions for the 20 targets. See "canal3 with targets.png" in the
   * hidden folder to see what this looks like. Also, these aren't necessarily
   * ordered. The first ten were in order, but the next ten were just put
   * wherever there was space on the map. So target 19 is not necessarily at the
   * end of the canal.
   */
  var targetsCoords = [
    {x:  227, y: 4694}, {x:  557, y: 4133}, {x: 1045, y: 3506},
    {x: 1377, y: 3121}, {x: 2149, y: 3169}, {x: 2605, y: 3327},
    {x: 2965, y: 2694}, {x: 3107, y: 2358}, {x: 3333, y: 1724},
    {x: 3711, y:  960}, {x:  401, y: 4409}, {x:  708, y: 3924},
    {x: 1158, y: 3256}, {x: 1828, y: 3079}, {x: 2786, y: 3014},
    {x: 3206, y: 1962}, {x: 3471, y: 1451}, {x: 3600, y: 1214},
    {x: 2428, y: 3215}, {x:  863, y: 3688}
  ];
  
  /* This is necessary because the targets are appended to the wrapper, not the
   * document body so they are a little offset. TODO: double check this.
   */
  for (var i = 0; i<= 19; i++) {
    targetsCoords[i].x -= 9;
    targetsCoords[i].y -= 9;
  }
  
  /* One array for each type of target (tag and verify). One additional array
   * forr the minimap sprites.
   */
  var tagTargets        = [];
  var userVerifyTargets = [];
  var varVerifyTargets  = [];
  var targetSprites     = [];
  
  /* 0 means untagged, 1 means user verifies, 2 means va verifies, 3 means
   * nonexistant.
   */
  var targetTracker = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  
  /* Experimental data. */
  
  /* These numbers represent the proportion through the canal at which point the
   * user switched from acceleration to deceleration or vice-versa.
   * TODO: implement decreasing progress work.
   */
  var accelerationData = [
    [ 0.129, 0.155, 0.168, 0.182, 0.195, 0.209, 0.223, 0.238, 0.252, 0.266,
      0.281, 0.295, 0.324, 0.351, 0.364, 0.389, 0.893, 1.000
    ],
    [ 0.513, 0.664, 0.692, 0.841, 0.899, 1.000 ],
    [ 0.493, 0.471, 0.731, 0.733, 0.734, 0.738, 0.920, 1.000 ],
    [ 0.720, 1.000]
  ];
  
  /* This is how much time is spent accelerating for each of the four 
   * representative models.
   */
  var accelerationProportion = [ 0.768,  0.599,  0.644,  0.720];
  var preferenceData         = [ 0.088,  0.696];
  var tagTimeData            = [26.700, 12.700, 10.400, 27.400, 7.700]; 
  var verifyTimeData         = [ 6.200,  2.800,  3.200,  8.800, 3.900];
  var startDelayData         = [
     500, 3599,  500, 1200,  801,  499,  890,  700,  900, 2700, 2401, 2598,
     800,  800, 2701, 1000,  301, 3700, 4100, 4401, 6300, 4101, 4801, 4500,
    2101, 6099, 5299, 5100, 3900, 3100, 6300, 4799, 3801, 4800, 4601, 3703,
    5000, 9501, 3903, 5899, 4300, 4700
  ];
  
  /* Initialize application state. */
  var elapsedTime               = 0;
  var timeSpentTaggingVerifying = 0;
  /* used to make sure the virtual agent doesn't go after the point you made
   * during fast forwarding.
   */
  var lastTargetIndex           = null;
  /* collaborative score */
  var targetsVerified            = 0;
  var tagCount                  = 0;
  var verifyCount               = 0;
  var startTime                 = new Date().getTime();
  
  /* Initialize gamepad state. */
  var interval    = null;
  var aButton     = false;
  
  /* gpRecorder records the global coordinates with an offset
   * (x: -14, y: -4412). gpRecorder is not the global coordinates or the local
   * coordinates. It records all the local movement.
   */
  var gpRecorder     = [50, 470];
  var canvasShiftX   =   0;
  var canvasShiftY   =   0;
  var gpSpriteX      =  50;
  var gpSpriteY      = 470;
  var magnitude      =   0;
  var directionX     =   0;
  var directionY     =   0;
  var saveDirectionX =   0;
  var saveDirectionY =   0;
  var angle          =   1.57;
  
  /* objects for the user agent, virtual agent, and targets. */
  var user    = null;
  var va      = null;
  var targets = [];
  
  /* Initialize application and agent state from browser cookie. */
  /* This if-else handles saving the game using cookie. It only follows the
   * cookies path if the user moved, not if there are cookies in general.
   */
  if (!readCookie('deleted') && readCookie('gpRecorder0') != null) {
    gpRecorder[0]    = parseInt(readCookie("gpRecorder0"));
    gpRecorder[1]    = parseInt(readCookie("gpRecorder1")); 
    canvasShiftX     = parseInt(readCookie("gpRecorder2")); 
    canvasShiftY     = parseInt(readCookie("gpRecorder3")); 
    gpSpriteX        = parseInt(readCookie("gpSpriteCoords0"));
    gpSpriteY        = parseInt(readCookie("gpSpriteCoords1"));
    canvasLeftMargin = parseInt(readCookie("canvasLeftMargin"));
    canvasTopMargin  = parseInt(readCookie("canvasTopMargin"));
    userMiniInitialX = parseInt(readCookie("miniSprite1coords0"));
    userMiniInitialY = parseInt(readCookie("miniSprite1coords1"));
    vaMiniInitialX   = parseInt(readCookie("miniSprite2coords0"));
    vaMiniInitialY   = parseInt(readCookie("miniSprite2coords1"));
    lastTargetIndex  = parseInt(readCookie("lastTargetIndex")); 
    imageId          = parseInt(readCookie("imageId")); 
    targetTracker    = JSON.parse(readCookie("targetTracker"));
    lastRole         = readCookie("lastRole");
    targetsVerified  = parseInt(readCookie("targetsVerified"));
    tagCount         = parseInt(readCookie("tagCount"));
    verifyCount      = parseInt(readCookie("verifyCount"));
    startTime        = parseInt(readCookie("startTime"));
    vaBehavior       = parseInt(readCookie("behavior"));
    vaMagnitude      = parseInt(readCookie("magnitude"));
    vaAcceleration   = parseInt(readCookie("acceleration"));
    
    if (isNaN(targetsVerified)) { targetsVerified = 0; }
    if (isNaN(tagCount)) { tagCount = 0; }
    if (isNaN(verifyCount)) { verifyCount = 0; }
    if (isNaN(imageId)) { imageId = 15; }
    
    /* User was tagging/verifying for this long. */
    timeSpentTaggingVerifying = (new Date().getTime()) - parseInt(readCookie("elsapsedTime")) - startTime;
  } else {
    document.cookie = 'deleted=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  
  /* This searches for the gamepad at multiple indices. For some reason it isn't
   * always at index 0.
   */
  function pollGamepads() {
    var gamepads = navigator.getGamepads();
    for (var idx = 0; idx < gamepads.length; ++idx) {
      var gamepad = gamepads[idx];
      if (gamepad) {
        clearInterval(interval);
      }
    }
    gameLoop();
  }
  
  function gameLoop() {
    /* In chrome, it needs to do this any time it wants input. The entire syntax
     * for handling these gamepads seems to differ a lot between browsers.
     */
    var gamepads = navigator.getGamepads();
    
    /* Gamepad axis 0 varies from -1 to 1. 1 is all the way to the right. */
    var stickX =  gamepads[0].axes[0];
    /* Gamepad axis 1 is the y-axis. 1 is all the way down. */
    var stickY = -gamepads[0].axes[1];
    
    /* These are boolean values. */
    var accelButton = gamepads[0].buttons[5].pressed;
    aButton = gamepads[0].buttons[0].pressed;
    
    if (accelButton) { user.acceleration = 0.03; }
    else {
      if (user.magnitude < 0.01) { user.acceleration = 0; }
      else { user.acceleration = -0.03; }
    }
    
    /* Check for larger values so you really have to move the stick to move the
     * sprite. The stick is super sensitive so it would look weird without this.
     */
    if ((stickX < 0.5 && stickX > -0.5) && (stickY < 0.5 && stickY > -0.5)) {
      directionX = saveDirectionX;
      directionY = saveDirectionY;
    } else {
      /* The direction array is components of the angle. This is slightly
       * different from the stick array. If I used the stick array, I could slow
       * down by pressing the stick forward only a little.
       */
      directionX = stickX / (Math.sqrt(stickX * stickX + stickY * stickY));
      directionY = stickY / (Math.sqrt(stickX * stickX + stickY * stickY));
      
      /* Save direction allows the inertial movement when you stop moving the
       * stick.
       */
      saveDirectionX = directionX;
      saveDirectionY = directionY;
    }
    
    angle = Math.atan2(directionY, directionX);
    
    handleTargets();
    
    /* The significance of doing it this way instead of just using gpRecorder0
     * and gpRecorder1 as arguments is this way, it can never leave the canal.
     * It asks if it would be in the canal after taking one more step, not
     * whether it is in the canal right now.
     */
    var nextX        = gpRecorder[0] + magnitude * directionX;
    var nextY        = gpRecorder[1] + magnitude * directionY;
    var nextPosition = [nextX, nextY];
    if (inside(nextPosition, canalTriacontapentagon)){
      logCookie();
      gpUpdateMap({x1: gpRecorder[0], y1: gpRecorder[1]});
    } else {
      /* If it hits the canal edge, magnitude is reset to 1. */
      magnitude = 0;
      user.acceleration = 0;
    }
    
    ultraRecorder();
    
    /* Data is logged at the end of the seven minutes. */
    if (elapsedTime > sevenMinutesInMillis) {
      elapsedTime = sevenMinutesInMillis + 1;
      logger();
      vaLogger(true);
    } else {
      window.setTimeout(gameLoop, framesPerSecond60);
    }
  };
  
  /* Update the map (canvas shifts). */
  function gpUpdateMap(msg) {
    /* Shifts the canvas based on the local coordinates of the user. It shifts
     * direction depending on what edge or corner you're on.
     */
    var gpShifter = function() {
      if (gpSpriteX> 400 && gpSpriteY < 300) {
        gpHandleShift(magnitude * Math.abs(directionX), magnitude * Math.abs(directionY));
      } else if (gpSpriteX > 400) {
        gpHandleShift(magnitude * Math.abs(directionX, 0));
      } else if (gpSpriteY < 300) {
        gpHandleShift(0, magnitude * Math.abs(directionY));
      }
      
      if (gpSpriteX < 300 && gpSpriteY > 400) {
        gpHandleShift(-magnitude * Math.abs(directionX), -magnitude * Math.abs(directionY));
      } else if (gpSpriteX < 300) {
        gpHandleShift(-magnitude * Math.abs(directionX, 0));
      } else if (gpSpriteY > 400) {
        gpHandleShift(0, -magnitude * Math.abs(directionY));
      }
      
      var gpHandleShift = function(x, y) {
        canvasShiftX += x;
        canvasShiftY -= y;
        gpSpriteX    -= x;
        gpSpriteY    += y;
        
        gpRecorder[0] = gpSpriteX + canvasShiftX;
        gpRecorder[1] = gpSpriteY + canvasShiftY;
        
        canvasLeftMargin -= x;
        canvasTopMargin  += y;
        
        canvas.style.marginLeft = canvasLeftMargin + STRINGS.PX;
        canvas.style.marginTop  = canvasTopMargin  + STRINGS.PX;
        userSprite.style.left   = gpSpriteX        + STRINGS.PX;
        userSprite.style.top    = gpSpriteY        + STRINGS.PX;
        
        updateTargets();
      };
      
      gpShifter();
      gpSpriteX += magnitude * directionX;
      gpSpriteY += magnitude * directionY;
      
      /* Local coordinates + canvas offset = relatively global coordinates
       * (+14, +4412 offset).
       */
      gpRecorder[0] = gpSpriteX + canvasShiftX;
      gpRecorder[1] = gpSpriteY + canvasShiftY;
      
      userSprite.style.left      = gpSpriteX + STRINGS.PX;
      userSprite.style.top       = gpSpriteY + STRINGS.PX;
      userSprite.style.transform = STRINGS.ROTATE + '(' + -2 * angle +
         STRINGS.DEGREES + ')';
         
     // TODO: Update minisprite coordinates. */
    };
  };
  
  /* Update the target sprite positions. */
  function updateTargets() {
    targets.forEach(function(target, idx, arr) {
      target.style.left = (target.xPos - canvasShiftX) + STRINGS.PX;
      target.style.top  = (target.yPos - canvasShiftY) + STRINGS.PX;
    });
  };
  
  /* Handle clicking on the targets. */
  function handleTargets() {
    var idx = targets.findIndex(function(target, idx, arr) {
      /* You can't steal a target va already started. */
      var vaOnTarget  = target === va.target && va.onTarget;
      var closeEnough = Math.abs(gpRecorder[0] - target.xPos) < 50 &&
        Math.abs(gpRecorder[1] - target.yPos) < 50;
      var slowEnough = magnitude < 1;
      
      /* If the virtual agent is not working on the arget, you're close enough,
       * moving slow enough, and pressing the a button, it executes.
       */
      return !vaOnTarget && closeEnough && slowEnough && aButton;
    });
    
    if (-1 !== idx) {
      var targetClicked = targets[idx];
      if (targetClicked.type === 0) {
        /* The target at this index will load as a va verifies target when it
         * restarts.
         */
        targetTracker[idx] = 2;
        
        /* Used in the log. */
        lastRole = 'tagging';
        lastTargetIndex = idx;
        imageId += 1;
        tagCount += 1; // TODO: Update this on return from tagging.
        logCookie();
        window.location.replace(LOCATIONS.TAG);
      } else if (targetClicked.type === 1) {
        targetTracker[idx] = 3;
        lastRole = 'verifying';
        imageId += 1;
        targetsVerified += 1;
        verifyCount += 1;
        updateScore();
        logCookie();
        window.location.replace(LOCATIONS.VERIFY);
      }
    }
  };
  
  /* This function checks if a point (array with x and y coordinate) is in a
   * polygon (two-dimensional array). I copied it straight from stack overflow
   * and have no idea how it works.
   */
  function inside(point, polygon) {
    /* The coordinates of the boat are for the top left corner, not the center,
     * so they are tweaked a little from the (+14, +4412). Probably not tweaked
     * well but still...
     */     
    var boatX = point[0] + 15;
    var boatY = point[1] + 4400;
    
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i, ++i) {
      var xi = polygon[i][0];
      var yi = polygon[i][1];
      var xj = polygon[j][0];
      var yj = polygon[j][1];
      
      var intersect = (((yi > boatY) !== (yj > boatY)) && 
        (boatX < (xj - xi) * (boatY - yi) / (yj - yi) + xi));
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  };
  
  function vaUpdateMap(msg) {
    va.sprite.style.left = (va.position.x - canvasShiftX) + STRINGS.PX;
    va.sprite.style.top  = (va.position.y - canvasShiftY) + STRINGS.PX;
    
    // TODO: update minimap sprite for the virtual agent.
    
    /* Virtual agent does not rotate, but it does not look good with the current
     * sprite.
     */
  };
  
  function ultraRecorder() {
    var endTime = new Date();
    elapsedTime = endTime - startTime;
    // TODO: log data to user agent.
  };
  
  function vaUltraRecorder() {
    var endTime = new Date();
    elapsedTime = endTime - startTime;
    
    var entry = {
      x:      va.position.x,
      y:      va.position.y,
      accel:  va.accel,
      action: va.lastRole,
      time:   elapsedTime
    };
    
    // TODO: log data to virtual agent.
  };
  
  function logger() {
    var xhr = new XMLHttpRequest();
    xhr.open(HTTP_VERBS.POST, LOCATIONS.SAVE);
    xhr.setRequestHeader(HTTP_REQUEST_HEADERS.CONTENT_TYPE,
      HTTP_HEADER_VALUES.APPLICATION + HTTP_HEADER_VALUES.FORM_ENCODED
    );
    xhr.send("record=" +  log);
    // TODO: save Log object.
  }
  
  function vaLogger(done) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_STATUS_CODES.OK) {
          if (done) {
            window.location.replace(LOCATIONS.SURVEY2);
          }
        }
      }
    });
    xhr.open(HTTP_VERBS.POST, LOCATIONS.VA_SAVE);
    xhr.setRequestHeader(HTTP_REQUEST_HEADERS.CONTENT_TYPE,
      HTTP_HEADER_VALUES.APPLICATION + HTTP_HEADER_VALUES.FORM_ENCODED
    );
    xhr.send("vaRecord=" +  vaLog);
    // TODO: save va Log object.
  };
  
  function logCookie() {
    return;
    document.cookie = "gpRecorder0=" + gpRecorder[0] + ";";
    document.cookie = "gpRecorder1=" + gpRecorder[1] + ";";
    document.cookie = "gpRecorder2=" + canvasShiftX + ";";
    document.cookie = "gpRecorder3=" + canvasShiftY + ";";
    document.cookie = "gpSpriteCoords0=" + gpSpriteX + ";";
    document.cookie = "gpSpriteCoords1=" + gpSpriteY + ";";
    document.cookie = "canvasLeftMargin=" + canvasLeftMargin + ";";
    document.cookie = "canvasTopMargin=" + canvasTopMargin + ";";		
    document.cookie = "miniSprite1coords0=" + miniSprite1coords[0] + ";";		
    document.cookie = "miniSprite1coords1=" + miniSprite1coords[1] + ";";
    document.cookie = "miniSprite2coords0=" + miniSprite2coords[0] + ";";		
    document.cookie = "miniSprite2coords1=" + miniSprite2coords[1] + ";";
    /* This is to store an array in a cookie. JSON parse to read it. */
    document.cookie = "targetTracker=" + "[" + targetTracker.join(",") + "]"; 
    document.cookie = "lastTargetIndex=" + lastTargetIndex + ";";
    document.cookie = "targetsVerified=" + targetsVerified + ";";
    document.cookie = "tagCount=" + tagCount + ";";
    document.cookie = "verifyCount=" + verifyCount + ";";
    document.cookie = "vaPosX=" + va.position.x + ";";
    document.cookie = "vaPosY=" + va.position.y + ";";
    document.cookie = "imageId=" + imageId + ";";
    document.cookie = "lastRole=" + lastRole + ";"; 
    document.cookie = "vaLastRole=" + va.lastRole + ";"; 
    document.cookie = "startTime=" + startTime + ";";
    document.cookie = "elapsedTime=" + elapsedTime + ";";
    document.cookie = "vaOnTarget=" + va.onTarget + ";";
    document.cookie = "vaTargetX=" + va.target.x + ";";
    document.cookie = "vaTargetY=" + va.target.y + ";";
    document.cookie = "vaTargetIndex=" + va.target.index + ";";
    document.cookie = "vaTask=" + va.task + ";";
    document.cookie = "behavior= " + va.behavior + ";";
    document.cookie = "magnitude= " + va.magnitude + ";";
    document.cookie = "acceleration=" + va.acceleration + ";";
  };
  
  /* Reads the cookie as a string. This was also copied straight from stack
   * overflow so I don't know how it works. But it do.
   */
  function readCookie(key) {
    var regex = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)');
    var result = regex.exec(document.cookie);
    if (null !== result) {
      return result[1];
    } else {
      return result;
    }
  };
  
  function updateClock() {
    var minutes = 6 - Math.floor((elapsedTime / 1000) / 60);
    var seconds = 60 - Math.floor(elapsedTime / 1000) % 60;
    if (60 === seconds) {
      seconds = 0;
      minutes += 1;
    }
    
    if (seconds >= 10) {
      clock.innerHTML = '' + minutes + ':' + seconds;
    } else {
      clock.innerHTML = '' + minutes + ':0' + seconds;
    }
  };
  
  function updateScore() {
    scoreDiv.innerHTML = "Verified images: " + targetsVerified;
  }
  
  window.addEventListener(EVENTS.LOAD, function(event) {
    var loadTime = window.performance.timing.domContentLoadedEventEnd -
      window.performance.timing.connectStart;
    
    /* Polyfill for gamepadconnected event. */
    if (!(STRINGS.ON_GAMEPAD_CONNECTED in window)) {
      interval = setInterval(pollGamepads, 500);
    }
    /* Fast forward virtual agent. */
    //TODO: fastforward va.
  });
  
  window.addEventListener(EVENTS.DOM_CONTENT_LOADED, function(event) {
    buddySprite = document.getElementById(ELEMENT_IDS.buddySprite);
    canvas      = document.getElementById(ELEMENT_IDS.canvas);
    clock       = document.getElementById(ELEMENT_IDS.clock);
    divWrapper  = document.getElementById(ELEMENT_IDS.divWrapper);
    gowanusMap  = document.getElementById(ELEMENT_IDS.gowanusMap);
    minimap     = document.getElementById(ELEMENT_IDS.minimap);
    miniSprite1 = document.getElementById(ELEMENT_IDS.miniSprite1);
    miniSprite2 = document.getElementById(ELEMENT_IDS.miniSprite2);
    scoreDiv    = document.getElementById(ELEMENT_IDS.scoreDiv);
    userSprite  = document.getElementById(ELEMENT_IDS.userSprite);
    
    
    ctx            = canvas.getContext(STRINGS.TWO_D);
    minimapContext = minimap.getContext(STRINGS.TWO_D);
    
    ctx.drawImage(gowanusMap, 0, 0);
    minimapContext.drawImage(canvas, 0, 480, 4066, 5000, 0, 0, 200, 228);
    
    gowanusMap.addEventListener(EVENTS.LOAD, function(event) {
      ctx.drawImage(this, 0, 0);
      canvas.style.marginTop = canvasTopMargin + STRINGS.PX;
      minimapContext.drawImage(this, 0, 480, 4066, 5000, 0, 0, 200, 228);
    });
    
    /* Initialize the virtual agent. */
    // TODO: initialize virtual agent.
    va = new VirtualAgent(
      vaInitialX,
      vaInitialY,
      vaMiniInitialX,
      vaMiniInitialY,
      vaMagnitude,
      vaBehavior);
    // TODO: Choose target, initialize, and update. */
//    va.update();
    
    /* Initialize user agent. */
    user = new UserAgent(
      gpSpriteX,
      gpSpriteY,
      userMiniInitialX,
      userMiniInitialY
    );
    //TODO: initialize user agent.
    
    /* Initialize targets. */
    //TODO: initialize targets.
    
    updateClock();
    updateScore();
  });
  
  class Log {
    /* Make a new log with the given capacity. If capacity is undefined, default
     * to 1023.
     */
    constructor(capacity) {
      if (undefined === capacity) capacity = 1023;
      this.capacity = capacity;
      this.log = [];
    }
				
    /* If the log is full, flush to the server. Append the entry to the end of
     * the log.
     */
    append(entry) {
      if (this.isFull()) this.flush();
      this.log.push(entry);
    }
				
    /* Flush the log to the server and empty the log. */
    flush() {
      var xhr = new XMLHttpRequest();
      xhr.open(HTTP_VERBS.POST, LOCATIONS.APPEND);
      xhr.setRequestHeader(HTTP_REQUEST_HEADERS.CONTENT_TYPE,
      HTTP_HEADER_VALUES.APPLICATION + HTTP_HEADER_VALUES.JSON + ';' +
      HTTP_HEADER_VALUES.CHARSET + '=' + HTTP_HEADER_VALUES.UTF_8);
      xhr.send(JSON.stringify(this.log));
      this.log = [];
      return this;
    }
				
    /* Check if the log is full. */
    isFull() {
      return this.log.length === this.capacity;
    }
  };
  
  class Target {
    constructor(x, y, id, index, type) {
      this.element = document.createElement(ELEMENTS.IMG);
      this.element.setAttribute(ATTRIBUTES.WIDTH , 50);
      this.element.setAttribute(ATTRIBUTES.HEIGHT, 50);
      this.element.classList.add(CLASSES.TARGET);
      this.xPos = x - 14;
      this.yPos = y - 14;
      this.element.style.left = this.xPos + STRINGS.PX;
      this.element.style.top  = this.yPos + STRINGS.PX; 
      this.miniElement = document.createElement(ELEMENTS.IMG);
      this.miniElement.setAttribute(ATTRIBUTES.WIDTH , 15);
      this.miniElement.setAttribute(ATTRIBUTES.HEIGHT, 15);
      this.miniElement.classList.add(CLASSES.TARGET);
      this.miniElement.style.left = ((x -  107) * 0.048 + 501) + STRINGS.PX;
      this.miniElement.style.top  = ((y - 4864) * 0.046 + 691) + STRINGS.PX;
      
      switch (type) {
        case 0:
          this.element.src     = IMAGES.TAG_TARGET;
          this.miniElement.src = IMAGES.MINI_TARGET;
          break;
        case 1:
          this.element.src     = IMAGES.VERIFY_TARGET;
          this.miniElement.src = IMAGES.VERIFY_TARGET;
          break;
        case 2:
          this.element.src     = IMAGES.VA_VERIFY_TARGET;
          this.miniElement.src = IMAGES.VA_VERIFY_TARGET;
      }
    }
  };
  
  class Agent {
    constructor(x, y, mx, my) {
      this.element = null;
      this.miniElement = null;
      this.position = {x: x, y: y};
      this.miniPosition = {x: mx, y: my};
      this.magnitude = 0;
      this.acceleration = 0;
      this.log = new Log();
    }
    
    initializee() {
      this.counter = 0; // TODO: check if this is necessary
      this.theta = 0;
      this.saveSpeed = 0;
      this.rotate = 0;
    }
  };
  
  class UserAgent extends Agent {
    constructor(x, y) {
      super(x, y);
      this.element = userSprite;
    }
  };
  
  class VirtualAgent extends Agent {
    constructor(x, y, mx, my, magnitude, acceleration, behavior) {
      super(x, y, mx, my);
      this.behavior     = behavior;
      this.sprite       = buddySprite;
      this.initialized  = false;
      this.magnitude    = magnitude;
      this.acceleration = acceleration;
      this.target       = null;
      // TODO: fast forward behavior.
    }
    
    initialize(addDelay) {
      super.initialize();
      var now = new Date().getTime();
      this.onTarget = false;
      this.randomTaggingVerifyingTimeIndex = Math.floor(Math.random() * 5);
      this.tagAndVerifyDelayStart = now;
      /* 0 for tagging, 1 for verifying. */
      this.task = 0;
      this.startDelayStart = now;
      /* After a target or when the page loads, it initializes with the start
       * delay. If you come back to the page in the middle of its movement, it
       * will not have a start delay.
       */
       if (addDelay) {
         this.startDelay = startDelayData[Math.floor(Math.random() * 42)];
       } else {
         this.startDelay = 0;
       }

       this.randomAccelIndex = Math.floor(Math.random() * 47);
       /* This system handles the probabilities of getting each of the four
        * representative acceleration patterns.
        */
       if (this.randomAccelIndex < 16) { this.randomAccelIndex = 0; }
       else if (this.randomAccelIndex < 26) { this.randomAccelIndex = 1; }
       else if (this.randomAccelIndex < 44) { this.randomAccelIndex = 2; }
       else { this.randomAccelIndex = 3; }
       
       this.chooseTarget();
       this.initialized = true;
    }
    /* Choose the first target, then wait for a random amount of time, before
     * moving toward the target. Delay is optional, depending on when the va is
     * being started. it's a boolean.
     */
    start(addDelay) {
      if (!this.initialized) { this.initialize(addDelay); }
      this.lastRole = 'navigating';
      this.handleFlash();
      this.tagAndVerify();
      if (addDelay) { this.update(); }
    }
    
    /* Makes the virtual agent and its minimap icon flash to indicate that it is
     * tagging/verifying. Loops independently of the other events.
     */
    handleFlash() {
      if (this.onTarget) {
        if (this.element.style.visibility === STYLES.HIDDEN) {
          this.element.style.visibility     = STYLE.VISIBLE;
          this.miniElement.style.visibility = STYLE.VISIBLE;
        } else {
          this.element.style.visibility     = STYLES.HIDDEN;
          this.miniElement.style.visibility = STYLES.HIDDEN;
        }
      } else {
        this.element.visibility           = STYLES.VISIBLE;
        this.miniElement.style.visibility = STYLE.VISIBLE;
      }
    
      window.setTimeout(handleFlash, 500);
    }
    
    /* Handle the targets for the virtual agent. */
    tagAndVerify() {
      var now = new Date().getTime();
      if (!va.onTarget) {
        /* This time is constantly updated if you are not on the target so you
         * get  the exact start time when it is on the target.
         */
        this.tagAndVerifyDelayStart = now;
      } else {
        var endTime = now;
        /* There is only one random index for both of these because both arrays
         * are the same size.
         */
        var timeToTag =
          tagTimeData[this.randomTaggingVerifyingTimeIndex] * 1000;
        
        // TODO: fastfowarding
        if (this.task === 0 && 
          endTime - this.tagAndVerifyDelayStart >= timeToTag) {
          /* This becomes a user verifies target. */
          targetTracker[this.target.index] = 1;
          
          //targets[this.target.index].element.src = IMAGES.USER_VERIFY_TARGET;
          //targets[this.target.index].miniElement.src = 
          //  IMAGES.USER_VERIFY_TARGET;
          //setAttribute(
          //  ATTRIBUTES.ID, STRINGS.USER_VERIFY_TARGET + va.target.index
          //);
          // TODO: minimap targets.
          updateTargets();
          this.lastRole = 'tagging';
          /* Refreshes all the values for the va, but doesn't restart any of the
           * main functions. True means add the delay. But if it's
           * fastforwarding it won't add the delay (see if statement on line
           * 320). In hindsight, it should still add the delay, just divided by
           * 10.
           */
          this.initialize(true);
        } else if (this.task === 1 && 
          endTime - this.tagAndVerifyDelayStart >= timeToVerify) {
            delete targetTracker[this.target.index];
            targetsVerified += 1;
            updateScore();
            updateTargets();
            
            this.lastRole = 'verifying';
            this.initialize(true);
        }
        
        // TODO: fastforwarding
        /* Tag and verify at ten fps. */
        window.setTimeout(vaTagAndVerify, 100);
      }
    }
    
    chooseTarget() {
      var vaTarget           = null;
      var tagTarget          = null;
      var verifyTarget       = null;
      var noTargetsAvailable = targetTracker.length === 0;
      
      /* Just a random location to go when it's done. Otherwise it will search
       * for targets until it breaks.
       */
      if (noTargetsAvailable) { vaTarget = [1000, 3500, 0]; }
      else {
        tagTarget = this.closestTag();
        verifyTarget = this.closestVerify();
        if (Math.random() < preferenceData[this.behavior] &&
          null !== tagTarget) {
          vaTarget = tagTarget;
        }
        else {
          vaTarget = verifyTarget;
        }
      }
      this.target = vaTarget;
      
      if (targetTracker[this.target.index] === 0) this.task = 0;
      else if (targetTracker[this.target.index] === 2) this.task = 1;
      
      this.startingDistanceToTarget = this.distance(
        this.position.x, this.position.y, this.target.x, this.target.y
      );
    }
    
    closestTag() {
      var tagTarget = null;
      var leastDistance = 10000;
      var nextDistance = 0;
      for (var idx = 0; idx < targets.length; ++idx) {
        if (targetTracker[idx] === 0) {
          nextDistance = this.distance(
            this.position.x, this.position.y, targets[idx].x, targets[idx].y
          );
          if (nextDistance < leastDistance) {
            leastDistance = nextDistance;
            tagTarget = targets[idx];
          }
        }
      }
      return tagTarget
    }
    
    closestVerify () {
      var verifyTarget = null;
      var leastDistance = 10000;
      var nextDistance = 0;
      for (var idx = 0; idx < tagets.length; ++idx) {
        /* don't go after the new verifying point if you're fast forwarding. */
        if (!this.fastForward || idx !== lastTargetIndex) {
          if (targetTracker[idx] === 2) {
            nextDistance = this.distance(
              this.position.x, this.position.y, targets[idx].x, targets[idx].y
            );
            if (nextDistance < leastDistance) {
              leastDistance = nextDistance;
              verifyTarget = targets[idx];
            }
          }
        }
      }
      return verifyTarget;
    }
    
    /* finds the exact angle to the target. */
    chooseDirection() {
      /* adding 14 to the x coordinate and 4412 to the y coordinate is how you
       * get from the recorders to the global position. Probably because the
       * canvas starts at roughly that offset.
       */
      return Math.atan2(
        this.target.y + (this.position.y + 4412),
        this.target.x - (this.position.x +   14)
      );
    }
    
    findPath() {
      var options = [];
      var startDistance = this.distance(
        this.position.x, this.position.y, this.target.x, this.target.y
      );
      /* if close to target, just go to the target, don't navigate through
       * canal.
       */
      if (startDistance < 100) {
        return this.chooseDirection();
      }
      
      /* This is movement algorithm. Start by looking in 24 evenly spaced
       * directions. See what is the farthest distance you can go in each of
       * those 24 directions.
       */
      for (var direction = 0; direction < 24; ++direction) {
        for (var steps = 0; steps < 1000; steps += 10) {
          var x = this.position.x + steps * Math.cos(direction * Math.PI / 12);
          var y = this.position.y - steps * Math.sin(direction * Math.PI / 12);
          if (inside([x, y], vaCanalTriacontapentagon)) {
            if (endDistance < startDistance) options[tryDirection] = steps; 
            var endDistance = this.distance(x, y, this.target.x, this.target.y);
            /* if it takes va closer, save it. */
            if (endDistance < startDistance) {
              options[direction] = steps;
            } else {
              options[direction] = 0;
            }
          }
          else break;
        }
      }
      /* save the biggest number in the array, multiply the index by pi/12 to
       * get the angle.
       */
      return (options.indexOf(Math.max(...options))) * Math.PI / 12;
    }
    
    /* just distance formula. */
    distance(x1, y1, x2, y2) {
      x1 +=   14;
      y1 += 4412;
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    
    /* Decide whether or not to accelerate and decide what direction to go. */
    update() {
      var now = new Date().getTime();
      var endTime = now;
      if (this.counter === 0 && 
        endTime - this.StartDelayStart < this.startDelay &&
        !this.fastForward) {
        window.setTimeout(this.update.bind(this), framesPerSecond60);
          
        /* If it isn't constantly emitting no change, it will not update
         * properly when the user moves.
         */
        vaUpdateMap({x: 0, y: 0});
      } else {
        var currentDistanceToTarget = this.distance(
          this.position.x, this.position.y, this.target.x, this.target.y
        );
        var progress = 
          1 - currentDistanceToTarget / this.startingDistanceToTarget;
        
        /* since the data is a list of proportions at which there is switch,
         * this code figure out if it is supposed to acc or decel.
         */
        if (progress < accelerationData[this.randomAccelIndex][this.counter]) {
          this.acceleration  = 0.03 * (this.counter % 2 === 0 ? 1 : -1);
          this.magnitude    += this.acceleration;
        } else {
          this.counter += 1;
        }
        
        if (this.magnitude < 0.03) {
          this.magnitude    = 0;
          this.acceleration = 0;
        }
        
        /* Speed divided by deceleration gives the number of frames it would
         * take to decelerate. Speed/2 is average speed going from speed to 0.
         * Frames it would take to decelerate times average speed = distance it
         * would take to get to 0 speed. Formula simplified.
         */
        if (this.magnitude > this.saveSpeed) {
          /* killDistance handles the excess speed va has at the end. */
          this.killDistance = this.magnitude * this.magnitude * 100 / 6;
        } else {
          /* if va starts decelerating,  decrease the amount of distance va
           * needs to slow down.
           */
          this.killDistance -= this.magnitude;
        }
        
        var fuzz    = Math.random() * 0.3;
        var cosFuzz = Math.cos(this.theta + 1.57);
        
        var angle = this.findPath();
        var dx    = this.magnitude * Math.cos(angle);
        var dy    = this.magnitude * Math.sin(angle);
        var x     = this.position.x + dx;
        var y     = this.position.y - dy;
        if (currentDistanceToTarget > 85 && 
          inside([x, y], vaCanalTriacontapentagon)) {
          this.angle = angle;
          this.saveSpeed = this.magnitude;
          this.position.x = x;
          this.position.y = y;
          
          vaUpdateMap({x: dx, y: dy});
          this.onTarget = false;
        /* If va is near the target, make sure the counter is set so that it's
         * only decelerating at this point.
         */
        } else if (currentDistanceToTarget <= 85 && this.killDistance > 4) {
          this.counter = accelerationData[this.randomAccelIndex].length - 1;
          var dx = this.magnitude * Math.cos(this.angle + fuzz + cosFuzz);
          var dy = this.magnitude * Math.sin(this.angle + fuzz + cosFuzz);
          var x  = this.position.x + dx;
          var y  = this.position.y - dy;
          /* without this va would only bounce back when it is past 85 pixels
           * away. But it can run into the side of the canal before that, in
           * which case it should reverse direction.
           */
          if (this.magnitude > 0.3 && 
            !inside([x, y], vaCanalTriacontapentagon)) {
            this.angle += Math.PI;
          }
        
          if (inside([x, y], vaCanalTriacontapentagon)) {
            /* go directly to target. */
            if (currentDistanceToTarget > 35 && this.killDistance <= 85) {
              this.angle = this.chooseDirection();
            }
          
            this.position.x += dx;
            this.position.y -= dy;
          
            vaUpdateMap({x: dx, y: dy});
          
            this.onTarget = false;
            /* the higher this value, the curvier its path. Obviously this is a
             * terrible, robotic way of doing it, but I don't know how to make a
             * fuzzy curved path.
             */
            this.theta += Math.random() - 0.333;
          }
        } else if (currentDistanceToTarget < 35 &&
          inside([this.position.x, this.position.y], vaCanalTriacontapentagon)) {
          this.onTarget = true;
          vaUpdateMap({x: 0, y: 0});
        }
        
        window.setTimeout(this.update.bind(this), framesPerSecond60);
        vaUltraRecorder();
      }
    }
  };
  
})(window, document);