var userSwitchData = [[0.01073028, 0.01550475, 0.01930014, 0.02298981, 0.02690030, 0.03131760, 0.03664462, 0.04365011, 0.05433514, 0.07851171],
 [0.01483318, 0.02143325, 0.02667986, 0.03178034, 0.03718607, 0.04329240, 0.05065629, 0.06034044, 0.07511107, 0.10853194],
 [0.01792642, 0.02590284, 0.03224354, 0.03840766, 0.04494067, 0.05232039, 0.06121991, 0.07292354, 0.09077436, 0.13116466],
 [0.02050489, 0.02962860, 0.03688134, 0.04393208, 0.05140477, 0.05984596, 0.07002555, 0.08341259, 0.10383101, 0.15003091],
 [0.02275768, 0.03288378, 0.04093334, 0.04875872, 0.05705241, 0.06642100, 0.07771898, 0.09257680, 0.11523851, 0.16651420],
 [0.02478088, 0.03580721, 0.04457239, 0.05309346, 0.06212447, 0.07232594, 0.08462834, 0.10080704, 0.12548342, 0.18131762],
 [0.02663117, 0.03848079, 0.04790043, 0.05705773, 0.06676306, 0.07772624, 0.09094720, 0.10833390, 0.13485277, 0.19485589],
 [0.02834528, 0.04095758, 0.05098352, 0.06073022, 0.07106022, 0.08272904, 0.09680096, 0.11530676, 0.14353249, 0.20739768],
 [0.02994857, 0.04327427, 0.05386730, 0.06416531, 0.07507960, 0.08740844, 0.10227632, 0.12182885, 0.15165112, 0.21912871],
 [0.03145946, 0.04545743, 0.05658487, 0.06740241, 0.07886733, 0.09181815, 0.10743610, 0.12797505, 0.15930183, 0.23018363],
 [0.03289178, 0.04752707, 0.05916114, 0.07047119, 0.08245809, 0.09599856, 0.11232758, 0.13380165, 0.16655472, 0.24066371],
 [0.03425626, 0.04949868, 0.06161537, 0.07339461, 0.08587878, 0.09998095, 0.11698736, 0.13935226, 0.17346406, 0.25064737],
 [0.03556139, 0.05138453, 0.06396286, 0.07619087, 0.08915067, 0.10379012, 0.12144447, 0.14466144, 0.18007286, 0.26019679],
 [0.03681404, 0.05319455, 0.06621595, 0.07887469, 0.09229100, 0.10744613, 0.12572235, 0.14975714, 0.18641593, 0.26936222],
 [0.03801986, 0.05493690, 0.06838481, 0.08145818, 0.09531393, 0.11096546, 0.12984030, 0.15466234, 0.19252186, 0.27818499],
 [0.03918355, 0.05661839, 0.07047790, 0.08395142, 0.09823126, 0.11436184, 0.13381440, 0.15939618, 0.19841449, 0.28669957],
 [0.04030910, 0.05824475, 0.07250238, 0.08636292, 0.10105296, 0.11764689, 0.13765822, 0.16397484, 0.20411395, 0.29493502],
 [0.04139989, 0.05982089, 0.07446434, 0.08869996, 0.10378752, 0.12083049, 0.14138334, 0.16841210, 0.20963740, 0.30291615],
 [0.04245885, 0.06135103, 0.07636904, 0.09096878, 0.10644226, 0.12392117, 0.14499973, 0.17271985, 0.21499964, 0.31066433],
 [0.04348849, 0.06283882, 0.07822103, 0.09317482, 0.10902354, 0.12692632, 0.14851605, 0.17690840, 0.22021349, 0.31819810]];

var userImpulseData =  [[7,  9,  9, 10, 11, 12, 12, 13, 14, 17],
                        [8, 9, 10, 11, 12, 12, 13, 14, 16, 18],
                        [8, 10, 11, 12, 12, 13, 14, 15, 17, 19],
                        [9, 10, 11, 12, 13, 14, 15, 16, 17, 20],
                        [9, 11, 12, 12, 13, 14, 15, 16, 18, 21],
                        [9, 11, 12, 13, 14, 15, 16, 17, 18, 21],
                        [10, 11, 12, 13, 14, 15, 16, 17, 19, 22],
                        [10, 12, 13, 14, 15, 16, 17, 18, 20, 23],
                        [11, 12, 14, 15, 16, 17, 18, 19, 21, 24],
                        [11, 13, 15, 16, 17, 18, 19, 21, 23, 26]];


var startDelayData2 = [22,26,29,32,34,37,40,43,48,58];

var preferenceData = [0.088, 0.696]; //1 in the last index was made by me, it will not be randomly selected, only used when I want it to 100% verify

var b = 0.6;

var tagTimeData = [26.7, 12.7, 10.4, 27.4, 7.7]; 
var verifyTimeData = [6.2, 2.8, 3.2, 8.8, 3.9];

var divWrapper = document.getElementById(ELEMENT_IDS.divWrapper);

class VirtualAgent {
  constructor(x, y, d, behavior, st) {
    this.log = '';
    this.startTime = st;
    this.burstCD = 0;
    this.behavior = behavior;
    this.sprite = document.getElementById(ELEMENT_IDS.buddySprite);
    this.position = {x:d2x(d), y:d2y(d)};
    this.mapProportion = d;
    this.mapProportion0 = d;
    this.fastForward = false;
    this.targetValid = true;
  }
  
  initialize(addDelay, fastForward) {
    this.magnitude = 0;
    this.magnitude0 = 0;
    this.impulseBehavior = true;
    this.impulseIndex = Math.floor(Math.random()*userImpulseData.length); //accel interval
    this.onTarget = false;
    this.counter = 0;
    this.randomTaggingVerifyingTimeIndex = Math.floor(Math.random()*5);
    this.tagAndVerifyDelayStart = new Date().getTime();
    this.task = 0; //0 for tagging, 1 for verifying
    this.startDelayStart = new Date().getTime();
    //this.startDelay = addDelay? startDelayData[Math.floor(Math.random()*42)] : 0; //after a target or when the page loads, it initializes with the start delay. If you come back to the page in the middle of its movement, it will not have a start delay.
    this.startDelay = addDelay? startDelayData2[Math.floor(Math.random()*startDelayData2.length)] / 60 * 1000 : 0;
    this.theta = 0;
    this.saveSpeed = 0;
    
    this.randomAccelIndex = Math.floor(Math.random()*47);
    if (this.randomAccelIndex >= 1  &&  this.randomAccelIndex <= 15) //This system handles the probabilities of getting each of the 4 representative acceleration patterns.
      this.randomAccelIndex = 0;
    else if (this.randomAccelIndex >= 16  &&  this.randomAccelIndex <= 25)
      this.randomAccelIndex = 1;
    else if (this.randomAccelIndex >= 26  &&  this.randomAccelIndex <= 43)
      this.randomAccelIndex = 2;
    else if (this.randomAccelIndex >= 44  &&  this.randomAccelIndex <= 47)
      this.randomAccelIndex = 3;
      
    this.chooseTarget();
    this.targetValid = true;  

    if (fastForward) {
      this.framesRequiredDelay = this.startDelay / 1000 * 60;
      this.framesElapsed = 0;
      this.framesElapsedDelay = 0;
    }
  }

  saveState() {
    var framesElapsed = (new Date().getTime() - this.tagAndVerifyDelayStart) * 1000 * 60;
    var framesElapsedDelay = (new Date().getTime() - this.startDelayStart) * 1000 * 60;
    var framesRequiredDelay = this.startDelay * 1000 * 60;
    return {
      magnitude: this.magnitude,
      magnitude0: this.magnitude0,
      counter: this.counter,
      randomTaggingVerifyingTimeIndex: this.randomTaggingVerifyingTimeIndex,
      task: this.task,
      startDelay: this.startDelay,
      theta: this.theta,
      saveSpeed: this.saveSpeed,
      randomAccelIndex: this.randomAccelIndex,
      target: this.target,
      startingDistanceToTarget: this.startingDistanceToTarget,
      killDistance: this.killDistance,
      angle: this.angle,
      onTarget: this.onTarget,
      lastRole: this.lastRole,
      tagAndVerifyDelayStart: this.tagAndVerifyDelayStart,
      framesElapsed: framesElapsed,
      framesElapsedDelay: framesElapsedDelay,
      framesRequiredDelay: framesRequiredDelay,
      impulseBehavior: this.impulseBehavior,
      switchPoint: this.switchPoint,
      burstCD: this.burstCD,
      mapProportion: this.mapProportion,
      mapProportion0: this.mapProportion0,
      impulseStartTime: this.impulseStartTime,
      now: this.now,
      impulseIndex: this.impulseIndex,
      lastTargetIndex: this.lastTargetIndex,
      startTime: this.startTime
    };
  }

  restoreState(state) {
    this.magnitude = state.magnitude;
    this.magnitude0 = state.magnitude0;
    this.counter = state.counter;
    this.randomTaggingVerifyingTimeIndex = state.randomTaggingVerifyingTimeIndex;
    this.task = state.task;
    this.startDelay = state.startDelay;
    this.theta = state.theta;
    this.saveSpeed = state.saveSpeed;
    this.randomAccelIndex = state.randomAccelIndex;
    this.target = state.target;
    this.startingDistanceToTarget = state.startingDistanceToTarget;
    this.killDistance = state.killDistance;
    this.angle = state.angle;
    this.onTarget = state.onTarget;
    this.lastRole = state.lastRole;
    this.tagAndVerifyDelayStart = state.tagAndVerifyDelayStart;
    this.framesElapsed = state.framesElapsed;
    this.framesElapsedDelay = state.framesElapsedDelay;
    this.impulseBehavior = state.impulseBehavior;
    this.switchPoint = state.switchPoint;
    this.burstCD = state.burstCD;
    this.mapProportion = state.mapProportion;
    this.mapProportion0 = state.mapProportion0;
    this.impulseStartTime = state.impulseStartTime;
    this.now = state.now;
    this.impulseIndex = state.impulseIndex;
    this.lastTargetIndex = state.lastTargetIndex;
    this.startTime = state.startTime;
  }

  start(addDelay) {
  /* Choose the first target, then wait for a random amount of time,
   * before moving toward the target. For now, just wait 500 ms.
   */
    this.initialize(addDelay, false); //delay is optional, depending on when the va is being started. it's a boolean.
    this.handleFlash();
    this.tagAndVerify();
    if (addDelay) this.update();
  }
  
  chooseTarget() {
  /* Choose the current target for the virtual agent. */
    var vaTarget = null;
    var tagTarget = null;
    var verifyTarget = null;
    var thereAreNoAvailableTargets = true;
    for (var i = 0; i <= 19; i++) {
      if ((targetTracker[i] == 0) || (targetTracker[i] == 2)) thereAreNoAvailableTargets = false;
    }
    if (thereAreNoAvailableTargets) {
      vaTarget = [1000, 3500, -1, 0.2907]; //Just a random location to go when it's done. Otherwise it will search for targets until it breaks.
    }
    else {
      tagTarget = this.closestTag();
      verifyTarget = this.closestVerify();
      if (Math.random() < preferenceData[this.behavior]) {
        vaTarget = tagTarget;
      } else {
        vaTarget = verifyTarget;
      }
    }
    this.target = {x: vaTarget[0], y: vaTarget[1], index: vaTarget[2], mapProportion: vaTarget[3]};
    if (targetTracker[this.target.index] == 0) this.task = 0;
    else if (targetTracker[this.target.index] == 2) this.task = 1;

    this.startingDistanceToTarget = this.target.mapProportion - this.mapProportion;

    var switchIndex = (Math.floor(Math.abs(this.startingDistanceToTarget)*100)) % 5;

    var remainingDist = userSwitchData[switchIndex][Math.floor(Math.random()*userSwitchData[switchIndex].length)];

    this.switchPoint = this.target.mapProportion - Math.sign(this.startingDistanceToTarget)*remainingDist;

  }

  closestTag() {
    var tagTarget = null;
    var leastDistance = 10000;
    var nextDistance = 0;
    for (var i = 0; i <= 19; i++) {
      if (!this.targetValid && i == this.lastTargetIndex) continue;
      if (targetTracker[i] == 0) {
        nextDistance = Math.abs(this.mapProportion - targetDCoordinates[i]);
        if (nextDistance < leastDistance) {
          leastDistance = nextDistance;
          tagTarget = [targetsCoords[i][0], targetsCoords[i][1], i, targetDCoordinates[i]];
        }
      }
    }
    if (tagTarget === null) { //if there are no tag targets, return a verify target, even if it isn't the preference.
      return this.closestVerify();
    }
    else {
      return tagTarget;
    }
  }
          
  closestVerify() {
    var verifyTarget = null;
    var leastDistance = 10000;
    var nextDistance = 0;
    for (var i = 0; i <= 19; i++) {
      if (!this.targetValid && i == this.lastTargetIndex) continue;
      if (i == this.lastTargetIndex && this.fastForward) continue; //don't go after the new verifying point if you're fast forwarding
      if (targetTracker[i] == 2) {
        nextDistance = Math.abs(this.mapProportion - targetDCoordinates[i]);
        if (nextDistance < leastDistance) {
          leastDistance = nextDistance;
          verifyTarget = [targetsCoords[i][0], targetsCoords[i][1], i, targetDCoordinates[i]];
        }
      }
    }
    if (verifyTarget === null) {//if there are no verify targets, return a tag target, even if it wasn't the original preference.
      return this.closestTag();
    }
    else {
      return verifyTarget;
    }
  }

  impulse(distSign, towards, slow) { 
    // forward => target is to the right
    this.burstCD = userImpulseData[this.impulseIndex][Math.floor(Math.random()*userImpulseData[this.impulseIndex].length)]*(slow?4:1);                      
    this.magnitude0 = this.magnitude + 0.01*distSign*(towards?1:-1);
    if ((distSign == 1?true:false) == towards) {
      this.iAccel = 'right trigger';
    } else {
      this.iAccel = 'left trigger';
    }
    this.magnitude = this.magnitude0;
    this.mapProportion0 = this.mapProportion;
    this.impulseStartTime = this.now;
    this.startingDistanceToTarget = this.target.mapProportion - this.mapProportion;
    this.updateMap({x: 0, y: 0});
  }

  slowDown(initializeAfter, oldD) {
    if (this.magnitude < 0.005 && this.magnitude > -0.005) {
      this.magnitude = 0;
      if (initializeAfter) 
        this.initialize(false, this.fastForward);
      this.updateMap({x: 0, y: 0});
    } 
    else {
      var t = (this.now - this.impulseStartTime) / 1000;
      this.magnitude = this.magnitude0 * Math.exp(-b * t);
      this.mapProportion = Math.min(1, Math.max(0, this.mapProportion0 + this.magnitude0 / b * (1 - Math.exp(-b * t))));
      var x = d2x(this.mapProportion);// + 14;
      var y = d2y(this.mapProportion);// - 4412;
      var dx = x - d2x(oldD);
      var dy = y - d2y(oldD);
      this.position.x = x;
      this.position.y = y;
      this.updateMap({x: dx, y: dy});
      this.angle = Math.atan2(dy, dx) * 180 / Math.PI;
     }
  }
  
  update() {
    this.lastRole = 'navigating';
    this.iAccel = 'no trigger';
    var oldD = this.mapProportion;
    if (this.targetValid) {
      if (!this.fastForward) {
        this.now = Date.now();
      }

      if (this.now - this.startDelayStart < this.startDelay && !this.fastForward) {
        this.ultraRecorder();
        window.setTimeout(this.update.bind(this), (1000 / 60));
        this.updateMap({x:0, y:0});
        return;
      } 
      else if (this.fastForward && this.framesElapsedDelay < this.framesRequiredDelay) {
        this.ultraRecorder();
        this.framesElapsedDelay += 1;
        return;
      } 
      else {
        var currentDistanceToTarget = this.target.mapProportion - this.mapProportion;
        var speedAtTarget = 0;
        if (0 !== this.magnitude0) {
          speedAtTarget = this.magnitude0 - this.startingDistanceToTarget * b;
        }

        if (Math.abs(currentDistanceToTarget) < .0055 && Math.abs(this.magnitude) < 0.015 && this.target.index !== -1) {
          this.onTarget = true;

          if (this.task === 0) {
           this.lastRole = 'tagging';              
          }
          else {
            this.lastRole = 'verifying';
          }
          this.updateMap({x: 0, y: 0});
        }
        else if (this.impulseBehavior) { // Keep impulsing toward target until "close"
          if (this.burstCD == 0) {
            this.impulse(Math.sign(currentDistanceToTarget) , true, false);
          }
          else {
            this.slowDown(false, oldD);
          }
          if (Math.sign(currentDistanceToTarget)*(this.switchPoint - this.mapProportion) < 0) {
            this.impulseBehavior = false;
          }
        }
        else { // second part of user behavior
          if (Math.sign(this.target.mapProportion - this.switchPoint)*speedAtTarget > 0.01) { // If the virtual agent will overshoot then we hit the brake
            if (this.burstCD == 0) {
              var sign = Math.sign(this.target.mapProportion-this.switchPoint);
            this.impulse(sign,false, false);
            } 
            else {
              this.slowDown(false, oldD);
            }
          }
          else if (Math.sign(this.target.mapProportion - this.switchPoint)*speedAtTarget < 0.01) { // If the VA isn't fast enough to coast to the target, it will decrease its impulse rate, since it is close, so that it wont overshoot
            if (this.burstCD == 0 || (this.magnitude < 0.01 && this.magnitude > -0.01)) {
            this.impulse(Math.sign(currentDistanceToTarget),true,true);
            } 
            else {
              this.slowDown(false, oldD);
            }
          }
          else if (this.magnitude == 0) {
            this.impulse(Math.sign(currentDistanceToTarget),true,false);
          }
          else { // The VA will reach the target by coasting 
            this.slowDown(false, oldD);
          }
        }
      }
    } else { // VA's target has been taken
     this.slowDown(true, oldD);
    }

    if (this.burstCD > 0) this.burstCD -= 1;
        
    this.ultraRecorder();
   
    if (!this.fastForward) {
      window.setTimeout(this.update.bind(this), 1000 / 60);
    }
  }

      
  updateMap(msg) {
    this.sprite.style.left = this.position.x - gpRecorder[2] + "px";
    this.sprite.style.top = this.position.y - gpRecorder[3] + "px";
    miniSprite2coords[0] += (msg.x*0.047);
    miniSprite2coords[1] += (msg.y*0.045);
    miniSprite2.style.left = miniSprite2coords[0] + "px";
    miniSprite2.style.top = miniSprite2coords[1] + "px";
    this.sprite.style.transform = "rotate(" + this.angle + "deg)";
    //this.sprite.style.transform = "rotate(" + this.angle*(180/3.14)*-2 +"deg)"; // I considered having have the va sprite rotate as well, but it looks bad with the current sprite
  };

  tagAndVerify() { //This handle the targets for the va
    if (this.fastForward) {
      if (this.onTarget) {
        var framesRequiredTag = tagTimeData[this.randomTaggingVerifyingTimeIndex] * 60;
        var framesRequiredVerify = verifyTimeData[this.randomTaggingVerifyingTimeIndex] * 60;
        // If enough frames elapsed, then update targets / score
        if (this.task === 0 && this.framesElapsed >= framesRequiredTag) {
          if (tagTargets[this.target.index]) {
            tagTargets[this.target.index].remove();
          }
          if (targetSprites[this.target.index]) {
            targetSprites[this.target.index].remove();
          }
          targetTracker[this.target.index] = 1;
          userVerifyTargets [this.target.index] = document.createElement('IMG');
          userVerifyTargets [this.target.index].setAttribute('id', 'userVerifyTarget' + this.target.index);
          divWrapper.appendChild(userVerifyTargets[this.target.index]);
          targetSprites[this.target.index] = document.createElement('IMG');
          targetSprites[this.target.index].setAttribute('id', 'miniTarget' + this.target.index);
          divWrapper.appendChild(targetSprites[this.target.index]);
          new Target(targetDCoordinates[this.target.index], 'userVerifyTarget', this.target.index, targetTracker[this.target.index]);
          this.onTarget = false;
          this.lastTargetIndex = this.target.index;
          this.initialize(true, true);              
          //this.chooseTarget();
        } else if (this.task === 1 && this.framesElapsed >= framesRequiredVerify) {
          vaVerifyTargets[this.target.index].remove();
          targetSprites[this.target.index].remove();
          targetTracker[this.target.index] = 3;
          targetsVerified += tagTracker[this.target.index];
                
          this.onTarget = false;
          this.lastTargetIndex = this.target.index;
          this.initialize(true, true);
          //this.chooseTarget();
        }
          this.framesElapsed += 1;
      }
      return;
    }
    if (!this.onTarget) {
      this.tagAndVerifyDelayStart = new Date().getTime(); //this time is constantly updated if you are not on the target so you get the exact start time when it is on the target
    }
    else if (this.onTarget) {
      var endTime2 = new Date().getTime();
      var timeToTag = tagTimeData[this.randomTaggingVerifyingTimeIndex]*1000; //there is only one random index for both of these because both arrays are the same size.
      var timeToVerify = verifyTimeData[this.randomTaggingVerifyingTimeIndex]*1000;
      if ((this.task == 0)  &&  ((endTime2 - this.tagAndVerifyDelayStart) >= (timeToTag))) {
        if (tagTargets[this.target.index]) { tagTargets[this.target.index].remove(); }
        if (targetSprites[this.target.index]) { targetSprites[this.target.index].remove(); }
        targetTracker[this.target.index] = 1; //this becomes a user verifies target.
        
        userVerifyTargets[this.target.index] = document.createElement("IMG");
        userVerifyTargets[this.target.index].setAttribute("id", "userVerifyTarget" + this.target.index);
        divWrapper.appendChild(userVerifyTargets[this.target.index]);
        targetSprites[this.target.index] = document.createElement("IMG");
        targetSprites[this.target.index].setAttribute("id", "miniTarget" + this.target.index);
        divWrapper.appendChild(targetSprites[this.target.index]);
        new Target(targetDCoordinates[this.target.index], "userVerifyTarget", this.target.index, targetTracker[this.target.index]);
        updateTargets();
        
        this.onTarget = false;
        this.lastTargetIndex = this.target.index;
        this.initialize(true, false); //refreshes all the values for the va, but doesn't restart any of the main functions. True means add the delay. But if it's fastForwarding it won't add the delay (see if statement on line 320). In hindsight, it should still add the delay, just divided by 10.
        //this.chooseTarget();
      }
      else if ((this.task == 1)  &&  ((endTime2 - this.tagAndVerifyDelayStart) >= (timeToVerify))) {
        vaVerifyTargets[this.target.index].remove();
        targetSprites[this.target.index].remove();
        targetTracker[this.target.index] = 3;
        targetsVerified += tagTracker[this.target.index];
        updateScore();
        updateTargets();
        
        this.onTarget = false;
        this.lastTargetIndex = this.target.index;
        this.initialize(true, false);
        //this.chooseTarget();
      }
    }
    if(!this.fastForward) {
      window.setTimeout(this.tagAndVerify.bind(this), 100); //10fps
    }
  }

  handleFlash() { //This makes the va and it's minimap icon flash when its tagging to indicate that it is tagging/verifying. It loops independently of the other things.
    if (this.onTarget) {
      if (this.sprite.style.visibility == "hidden") {
        this.sprite.style.visibility = "visible";
        miniSprite2.style.visibility = "visible";
      }
      else {
        this.sprite.style.visibility = "hidden";
        miniSprite2.style.visibility = "hidden";
      }
    }
    else {
      this.sprite.style.visibility = "visible";
      miniSprite2.style.visibility = "visible";
    }
    window.setTimeout(this.handleFlash.bind(this), 500);
  }

  ultraRecorder() {
    var endTime2 = new Date();
    var elapsedTime = endTime2.getTime() - this.startTime;
    this.log += truncate(elapsedTime, 1) + ", " + truncate(this.position.x, 1) + ", " + truncate(this.position.y, 1) + ", " + truncate(this.mapProportion, 4) + ", " + this.iAccel + ", "+ this.lastRole + ", " + ", " + this.lastTargetIndex + ", " + this.target.index + ", " + this.behavior + '\n';
  }

  logger(done) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (done) {
            window.location.replace('survey2');
          }
        }
      }
    });
    xhr.open("POST", "/vaSave");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("vaRecord=" +  this.log);
  }

  getElapsedTIme() {
    return new Date().getTime() - this.startTime;
  }
}