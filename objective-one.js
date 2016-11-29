(function(window, document) {

  var canvas = document.getElementById(ELEMENT_IDS.canvas);
  var minimap = document.getElementById(ELEMENT_IDS.minimap);
  var gowanusMap = document.getElementById(ELEMENT_IDS.gowanusMap);
  var divWrapper = document.getElementById(ELEMENT_IDS.divWrapper);
  var clock = document.getElementById(ELEMENT_IDS.clock);
  var scoreDiv = document.getElementById(ELEMENT_IDS.scoreDiv);
  var ctx = canvas.getContext("2d");
  var minimapContext = minimap.getContext("2d");
  
  var canvasTopMargin = -4400; //The map is scrolled by changing the top and left margins.
  var canvasLeftMargin = 0;
  var loadTime = 0; //Load time is factored into how long the va should fast forward
  
  var userSprite = document.getElementById(ELEMENT_IDS.userSprite);
  var buddySprite = document.getElementById(ELEMENT_IDS.buddySprite);
  var miniSprite1 = document.getElementById(ELEMENT_IDS.miniSprite1);
  var miniSprite2 = document.getElementById(ELEMENT_IDS.miniSprite2);

  var rotate = 0;
  var log = '';

  var imageId = 1; //This is used to tell the tag and verify html which image to load, instead of using an html template system.
  var lastRole = null;
  var startTime = 0;
  var elapsedTime = 0;
  var timeSpentTaggingVerifying = 0;
  var lastTargetIndex = null;
  var tagCount = 0;
  var verifyCount = 0;

  var interval = null; //All the gamepad variables are initialized here.
  var stick = [0, 0];
  var aButton = false;
  var rightAccelButton     = false;
  var leftAccelButton      = false;
  var rightAccelButtonPrev = false;
  var leftAccelButtonPrev  = false;
  var impulseStartTime = 0;
  var gamepads = [];
  var gpIdx = -1;
  
  var gpSpriteCoords = [50, 470];
  var magnitude  = 0;
  var magnitude0 = 0;
  var userT     = 0;
  var userTPrev = 0;
  var userT0    = 0;
  var direction = [0, 0];
  var saveDirection = [0,0];
  var angle = 1.57;
  var va = null;
  var b = 0.6;

  if (!readCookie('deleted') && readCookie("gpRecorder0") != null) { //this if-else handles saving the game using cookie. It only follows the cookies path if the user moved, not if there are cookies in general.
    restoreState();
    restoreVA();
    setUpVA();  
  }
  else { //if there are no cookies:
    lastRole = 'navigating';
    document.cookie = 'deleted=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    targetInitializer(); //targetInitializer creates the targets.
    Map.updateTargets(); //updateTargets draws the targets.
  }
  updateClock();
  updateScore();

  if (gowanusMap.complete) {
    imageLoaded.call(gowanusMap);
  }
  else {
   gowanusMap.addEventListener(EVENTS.LOAD, imageLoaded);
  }

  userSprite.style.left = gpSpriteCoords[0] + "px";
  userSprite.style.top = gpSpriteCoords[1] + "px";
  canvas.style.marginLeft = canvasLeftMargin + "px";
  canvas.style.marginTop = canvasTopMargin + "px";
  miniSprite1.style.left = Map.miniSprite1coords[0] + "px";
  miniSprite1.style.top = Map.miniSprite1coords[1] + "px";
  miniSprite2.style.left = Map.miniSprite2coords[0] + "px";
  miniSprite2.style.top = Map.miniSprite2coords[1] + "px";

  function restoreState() {
    console.log("there be cookies");
    Map.gpRecorder[0] = parseInt(readCookie("gpRecorder0"));
    Map.gpRecorder[1] = parseInt(readCookie("gpRecorder1")); 
    Map.gpRecorder[2] = parseInt(readCookie("gpRecorder2")); 
    Map.gpRecorder[3] = parseInt(readCookie("gpRecorder3")); 
    gpSpriteCoords[0] = parseInt(readCookie("gpSpriteCoords0"));
    gpSpriteCoords[1] = parseInt(readCookie("gpSpriteCoords1"));
    canvasLeftMargin = parseInt(readCookie("canvasLeftMargin"));
    canvasTopMargin = parseInt(readCookie("canvasTopMargin"));
    Map.miniSprite1coords[0] = parseInt(readCookie("miniSprite1coords0"));
    Map.miniSprite1coords[1] = parseInt(readCookie("miniSprite1coords1"));      
    Map.miniSprite2coords[0] = parseInt(readCookie("miniSprite2coords0"));
    Map.miniSprite2coords[1] = parseInt(readCookie("miniSprite2coords1"));
    userT = parseFloat(readCookie("userT"));
    userTPrev = parseFloat(readCookie("userTPrev"));
    lastTargetIndex = parseInt(readCookie("lastTargetIndex")); //lastTargetIndex is used so va doesn't go after the point you made during fastForwarding
    imageId = parseInt(readCookie("imageId")); 
    Map.targetTracker = JSON.parse(readCookie("targetTracker"));
    Map.tagTracker = JSON.parse(readCookie("tagTracker"));
    lastRole = readCookie("lastRole"); //this is for the log I think.
    log = localStorage.getItem("userLog"); //Cookies can't save things that are multiple lines, so I use localStorage instead.
    Map.targetsVerified = parseInt(readCookie("targetsVerified"));
    tagCount = parseInt(readCookie("tagCount"));
    verifyCount = parseInt(readCookie("verifyCount"));
    
    if (lastRole === "tagging") {
      Map.tagTracker[lastTargetIndex] = parseInt(readCookie("numTags"));
    } else if (lastRole === "verifying") {
      Map.targetsVerified += parseInt(readCookie("numVerifiedTags"));
    }
    lastRole = 'navigating';
    
    //if (isNaN(Map.targetsVerified)) { Map.targetsVerified = 0; }
    //if (isNaN(imageId)) { imageId = 15; }
    startTime = parseInt(readCookie("startTime")); //startTime is always the time when the entire program first start.
    var temp = new Date().getTime();
    var temp2 = parseInt(readCookie("elapsedTime"));
    timeSpentTaggingVerifying = temp - (temp2 + startTime); //User was tagging/verifying for this long.
  }

  function restoreVA() {       
    va = new VA.VirtualAgent(parseInt(readCookie("vaPosX")), parseInt(readCookie("vaPosY")), parseFloat(readCookie("vaD")), parseInt(readCookie("vaBehavior")), startTime); //it is drawn onto the old position.
    va.setLog(localStorage.getItem("vaLog"));
    va.restoreState(JSON.parse(readCookie("vaState"))); // restore va state for fast-forwarding.
    va.sprite.style.transform = "rotate(" + (this.angle? this.angle:0) + "deg)";
  }

  function setUpVA() {
    targetInitializer(); //targetInitializer creates the targets.

    if (va.target.index === lastTargetIndex) { // User took VA's tag target, so it will have to go for another
      va.targetValid = false;
    }

    if (va.getLog() === '') {
      va.setLog(localStorage.getItem("vaLog"));
    }
    
    va.fastForward = true;
    var frameCount = timeSpentTaggingVerifying * 60/1000;
    va.now = Date.now();
    va.impulseStartTime += timeSpentTaggingVerifying;
    for (var t = 0; t < frameCount; ++t) {
      va.update(); //fastForwarding
      va.tagAndVerify();
      va.now += 1 / 60 * 1000;
    }
    var t = va.now - Date.now();
    va.impulseStartTime -= t;
    va.fastForward = false;

    if (Map.targetTracker[va.target.index] == 0) va.task = 0;
    else if (Map.targetTracker[va.target.index] == 2) va.task = 1;
    
    localStorage.setItem("vaLog", va.getLog());
    
    Map.updateTargets();
    va.handleFlash();
  }

  function imageLoaded() {
    ctx.drawImage(this, 0, 0); 
    canvas.style.marginTop = canvasTopMargin + "px";
    minimapContext.drawImage(this, 0, 480, 4066, 5000, 0, 0, 200, 228);
    if (!readCookie("gpRecorder0")) {
      var button = document.createElement('button');
      button.addEventListener('click', function(event) {
        button.parentElement.removeChild(button);
        window.addEventListener('unload', function(event) {
          localStorage.setItem("userLog", log);
          localStorage.setItem("vaLog", va.getLog());
          logCookie();
        });
        startTime = new Date().getTime();
        var behavior = (Math.random() < 0.5) ? 0 : 1;
        va = new VA.VirtualAgent(20, 550, 0, behavior, startTime);
        va.start(true);//true meaning start with the delay.
        interval = setInterval(pollGamepads, 500);
      });
      button.textContent = 'start';
      document.body.appendChild(button);
    } else {
      interval = setInterval(pollGamepads, 500);
      va.startDelayStart = new Date().getTime();
      va.update();
      va.tagAndVerify();
    }
  }
  
  function targetInitializer() { //I never really figured out how to use the Target class properly, so now I just use this method in conjunction with the class.
    for (var i = 0; i <= 19; i++) { //The way this is set up, each of the three target arrays are all length 20, they are just blank in the indices for which there is no target of that type. This is important for how the arrays are handled in other functions.
      if (Map.targetTracker[i] == 0) {
        Map.tagTargets[i] = document.createElement("IMG");
        Map.tagTargets[i].setAttribute("id", "tagTarget" + i);
        divWrapper.appendChild(Map.tagTargets[i]);
        Map.targetSprites[i] = document.createElement("IMG");
        Map.targetSprites[i].setAttribute("id", "miniTarget" + i);
        divWrapper.appendChild(Map.targetSprites[i]); //If you attach it to the document body, it goes under the canvas, so I attached it to the div.
        new Target(Map.targetDCoordinates[i], "tagTarget", i, Map.targetTracker[i]);
      }        
      else if (Map.targetTracker[i] == 1) {
        Map.userVerifyTargets[i] = document.createElement("IMG");
        Map.userVerifyTargets[i].setAttribute("id", "userVerifyTarget" + i);
        divWrapper.appendChild(Map.userVerifyTargets[i]);
        Map.targetSprites[i] = document.createElement("IMG");
        Map.targetSprites[i].setAttribute("id", "miniTarget" + i);
        divWrapper.appendChild(Map.targetSprites[i]);
        new Target(Map.targetDCoordinates[i], "userVerifyTarget", i, Map.targetTracker[i]);
      }        
      else if (Map.targetTracker[i] == 2) {
        Map.vaVerifyTargets[i] = document.createElement("IMG");
        Map.vaVerifyTargets[i].setAttribute("id", "vaVerifyTarget" + i);
        divWrapper.appendChild(Map.vaVerifyTargets[i]);
        Map.targetSprites[i] = document.createElement("IMG");
        Map.targetSprites[i].setAttribute("id", "miniTarget" + i);
        divWrapper.appendChild(Map.targetSprites[i]);
        new Target(Map.targetDCoordinates[i], "vaVerifyTarget", i, Map.targetTracker[i]);
      }
      else if (Map.targetTracker[i] == 3) continue;
    }
  }
  
  
  
  //All the initializing is done at this point.

  function pollGamepads() { //This searches for the gamepad at multiple indices. For some reason it isn't always at index 0.
    gamepads = navigator.getGamepads();
    for (var i = 0; i < gamepads.length; i++) {
      var gp = gamepads[i];
      if (gp) {
        console.log("Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");
      
        if (gp.id.indexOf('STANDARD GAMEPAD Vendor: 046d') !== -1 && gp.id.indexOf("Product: c216") !== -1) {
          gpIdx = i;
          clearInterval(interval);
        }
      }
    }

    if (gpIdx !== -1) { //If the gamepad doesn't work, it probably wasn't at index 0, and this is the source of that problem.
      gameLoop();
    }
  }

  function gameLoop() {
    gamepads = navigator.getGamepads(); //in chrome, it needs to do this any time it wants input. The entire syntax for handling these gamepads seems to differ a lot between browsers.
    aButton = (gamepads[gpIdx]).buttons[0].pressed; //this is a boolean
    leftAccelButton  = (gamepads[gpIdx]).buttons[4].pressed;
    rightAccelButton = (gamepads[gpIdx]).buttons[5].pressed;
    if (rightAccelButton && !rightAccelButtonPrev && !leftAccelButton) {
      magnitude0 = magnitude + 0.01;
      magnitude  = magnitude0;
      userT0     = userT;
      impulseStartTime = Date.now();
    } else if (leftAccelButton && !leftAccelButtonPrev && !rightAccelButton) {
      magnitude0 = magnitude - 0.01;
      magnitude  = magnitude0;
      userT0     = userT;
      impulseStartTime = Date.now();
    } else{
      if (magnitude < 0.005 && magnitude > -0.005) {
        magnitude = 0;
      } else {
        var t = (Date.now() - impulseStartTime) / 1000;
        magnitude = magnitude0 * Math.exp(-b * t);
        userT = Math.min(1, Math.max(0, userT0 + magnitude0 / b * (1 - Math.exp(-b * t))));
        var dx = Map.d2x(userT) - Map.d2x(userTPrev);
        var dy = Map.d2y(userT) - Map.d2y(userTPrev);
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
      }
    }

    handleTargets();
    
    gpUpdateMap();
    ultraRecorder();
    
    leftAccelButtonPrev  = leftAccelButton;
    rightAccelButtonPrev = rightAccelButton;
    userTPrev            = userT;


    
    elapsedTime = Math.max(elapsedTime, va.getElapsedTime());
    if (elapsedTime > 300000 || !userTargetAvailable()) { //data is only logged at the end of the 5 minutes.
      elapsedTime = 300000;
      logger();
      va.logger(true);
    } else {
      window.setTimeout(gameLoop, (1000/60));
    }
  }

  function userTargetAvailable() { // If there is nothing for the user to do, then the platform can go to the survey
    for (var i = 0; i < 20; i++)
      if (Map.targetTracker[i] < 2)
        return true;
    return false;
  }

//    socket.on('gpUpdateMap', function(msg) { //I don't really use the msg from the server. It's sort of a vestige from the dragging form of the program. You probably don't need to emit this either, since there's only one user. 
  function gpUpdateMap(msg) {
    function gpShifter() { //This shifts the canvas based on the local coordinates of the user. It shifts direction depending on what edge or corner you're on.
      if (gpSpriteCoords[0] < 300 && Map.d2x(userT) < Map.d2x(userTPrev)) {
        gpHandleShift(Map.d2x(userT) - Map.d2x(userTPrev), 0);
      }
      
      if (gpSpriteCoords[0] > 400 && Map.d2x(userT) > Map.d2x(userTPrev)) {
        gpHandleShift(Map.d2x(userT) - Map.d2x(userTPrev), 0);
      }
      
      if (gpSpriteCoords[1] < 300 && Map.d2y(userT) < Map.d2y(userTPrev)) {
        gpHandleShift(0, Map.d2y(userT) - Map.d2y(userTPrev));
      } 
      
      if (gpSpriteCoords[1] > 400 && Map.d2y(userT) > Map.d2y(userTPrev)) {
        gpHandleShift(0, Map.d2y(userT) - Map.d2y(userTPrev));
      }
    };
    
    function gpHandleShift(x, y) {
      Map.gpRecorder[2] += x; //Map.gpRecorder 2 and 3 are the total x and y shift of the canvas. 
      Map.gpRecorder[3] += y;
      gpSpriteCoords[0] -= x;
      gpSpriteCoords[1] -= y;
      Map.gpRecorder[0] = gpSpriteCoords[0] + Map.gpRecorder[2]; //I only just noticed this adds up to 0. This should get deleted.      
      Map.gpRecorder[1] = gpSpriteCoords[1] + Map.gpRecorder[3];
      canvasLeftMargin -= x;
      canvasTopMargin  -= y;
      canvas.style.marginLeft = canvasLeftMargin + "px";
      canvas.style.marginTop = canvasTopMargin + "px";
      userSprite.style.left = gpSpriteCoords[0] + "px";
      userSprite.style.top = gpSpriteCoords[1] + "px";
      Map.updateTargets();
    };
    
    gpShifter();
    gpSpriteCoords[0] += Map.d2x(userT) - Map.d2x(userTPrev);
    gpSpriteCoords[1] += Map.d2y(userT) - Map.d2y(userTPrev);
    Map.gpRecorder[0] = gpSpriteCoords[0] + Map.gpRecorder[2];  //local coordinates + canvas offset = relatively global coordinates (+14, +4412 offset)    
    Map.gpRecorder[1] = gpSpriteCoords[1] + Map.gpRecorder[3];
    userSprite.style.left = gpSpriteCoords[0] + 'px';
    userSprite.style.top = gpSpriteCoords[1] + 'px';
    userSprite.style.transform = "rotate(" + angle + "deg)"; 
    Map.miniSprite1coords[0] += (Map.d2x(userT) - Map.d2x(userTPrev)) * 0.047; //this changes the coordinates of the minisprite. I tried to do this intelligently by actually finding the ratio from the map to the minimap, but it didn't work so I just tried different numbers until it looked decent enough.
    Map.miniSprite1coords[1] += (Map.d2y(userT) - Map.d2y(userTPrev)) * 0.045;
    miniSprite1.style.left = Map.miniSprite1coords[0] + "px";
    miniSprite1.style.top = Map.miniSprite1coords[1] + "px";
  };

  function handleTargets() { //This handles clicking on the targets.
    for (var i = 0; i <= 19; i++) {
      if (i == va.target.index  &&  va.onTarget) continue; //You can't steal a target va already started.
      if ((Map.targetTracker[i] == 0)  &&  (Math.abs(Map.gpRecorder[0] - Map.tagTargets[i].xPos) < 50)  &&  (Math.abs(Map.gpRecorder[1] - Map.tagTargets[i].yPos) < 50)  &&  (magnitude<1)  &&  (aButton)) { //If it's a tag target, and you're close, and moving slow, and pressing the a button, it executes.
        Map.tagTargets[i].remove();
        Map.targetSprites[i].remove();
        Map.targetTracker[i] = 2; //The target at this index will load as a va verifies target when it restarts.
        lastRole = "tagging"; //used in the log
        lastTargetIndex = i; 
        va.lastUserTarget = i;
        imageId++;
        tagCount++; //Used in the log
        ultraRecorder();
        logCookie();
        localStorage.setItem("userLog", log);
        localStorage.setItem("vaLog", va.getLog());
        window.location.replace('tag.html'); //I stopped using server requests since I stopped using html templates.
      }
    }
    for (var i = 0; i <= 19; i++) {
      if ((Map.targetTracker[i] == 1)  &&  (Math.abs(Map.gpRecorder[0] - Map.userVerifyTargets[i].xPos) < 50)  &&  (Math.abs(Map.gpRecorder[1] - Map.userVerifyTargets[i].yPos) < 50)  &&  (magnitude<1)  &&  (aButton)) {
        Map.userVerifyTargets[i].remove();
        Map.targetSprites[i].remove();
        Map.targetTracker[i] = 3;
        lastRole = "verifying";
        lastTargetIndex = i; 
        va.lastUserTarget = i;
        imageId++;
        verifyCount++;
        updateScore();
        ultraRecorder();
        logCookie();
        localStorage.setItem("vaLog", va.getLog());
        localStorage.setItem("userLog", log);
        window.location.replace('verify.html');
      }
    }
  }
  
  function ultraRecorder() {
    endTime = new Date();
    elapsedTime = endTime - startTime;
    var iAccel = 'no trigger';
    if (rightAccelButton && !leftAccelButton && !rightAccelButtonPrev) {
      iAccel = 'right trigger';
    } else if (leftAccelButton && !rightAccelButton && !leftAccelButtonPrev) {
      iAccel = 'leftTrigger'
    }
    log += truncate(elapsedTime, 1) + ", "  + truncate(Map.gpRecorder[0], 1) + ", " + truncate(Map.gpRecorder[1], 1) + ", " + truncate(userT, 4) + ", " + iAccel + ", " + lastRole + ", " + lastTargetIndex + '\n';
    //the += "/n" part allows it to write on a new line each time.
  }
  

  function logger() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/save");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("record=" +  log);
  }
  
  function logCookie() {
    document.cookie = "gpRecorder0=" + Map.gpRecorder[0] + ";";
    document.cookie = "gpRecorder1=" + Map.gpRecorder[1] + ";";
    document.cookie = "gpRecorder2=" + Map.gpRecorder[2] + ";";
    document.cookie = "gpRecorder3=" + Map.gpRecorder[3] + ";";
    document.cookie = "gpSpriteCoords0=" + gpSpriteCoords[0] + ";";
    document.cookie = "gpSpriteCoords1=" + gpSpriteCoords[1] + ";";
    document.cookie = "canvasLeftMargin=" + canvasLeftMargin + ";";
    document.cookie = "canvasTopMargin=" + canvasTopMargin + ";";    
    document.cookie = "miniSprite1coords0=" + Map.miniSprite1coords[0] + ";";    
    document.cookie = "miniSprite1coords1=" + Map.miniSprite1coords[1] + ";";
    document.cookie = "miniSprite2coords0=" + Map.miniSprite2coords[0] + ";";    
    document.cookie = "miniSprite2coords1=" + Map.miniSprite2coords[1] + ";";
    document.cookie = "targetTracker=" + "[" + Map.targetTracker.join(",") + "]"; //this is to store an array in a cookie. JSON parse to read it.
    document.cookie = "tagTracker=" + "[" + Map.tagTracker.join(",") + "]"; // this is to store an array in a cookie. JSON parse to read it.
    document.cookie = "lastTargetIndex=" + lastTargetIndex + ";";
    document.cookie = "targetsVerified=" + Map.targetsVerified + ";";
    document.cookie = "tagCount=" + tagCount + ";";
    document.cookie = "verifyCount=" + verifyCount + ";";
    document.cookie = "vaPosX=" + va.position.x + ";";
    document.cookie = "vaPosY=" + va.position.y + ";";
    document.cookie = "vaD=" + va.mapProportion + ";";
    document.cookie = "imageId=" + imageId + ";";
    document.cookie = "lastRole=" + lastRole + ";"; 
    document.cookie = "startTime=" + startTime + ";";
    document.cookie = "elapsedTime=" + elapsedTime + ";";
    document.cookie = "userTPrev=" + userTPrev + ";";
    document.cookie = "userT=" + userT + ";";
    document.cookie = "vaBehavior= " + va.behavior + ";";
    document.cookie = "vaState=" + JSON.stringify(va.saveState()); + ";"
  }
  function readCookie(key){ //reads the cookie as a string. This was also copied straight from stack overflow so I don't know how it works. But it do.
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
  }
  
  function updateClock() {
    if (va) elapsedTime = Math.max(elapsedTime, va.getElapsedTime());
    var minutes = 4 - Math.floor((elapsedTime / 1000)/60);
    var seconds = 60 - Math.floor((elapsedTime / 1000) % 60);
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    if (seconds >= 10) {
      clock.innerHTML = '' + minutes + ':' + seconds;
    }
    else {
      clock.innerHTML = '' + minutes + ':0' + seconds;
    }
    window.setTimeout(updateClock, 1000);
  }
  function updateScore() {
    scoreDiv.innerHTML = "Verified tags: " + Map.targetsVerified;
  }
})(window, document);