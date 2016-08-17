(function(window, document) {
  var STRINGS = {
    ACCEPT_ALT:            'accept',
    ACCEPT_SRC:            './accept.png',
    APPLICATION_JSON:      'application/json',
    CHARSET:               'charset',
    PNG:                   '.png',
    PX:                    'px',
    REJECT_ALT:            'reject',
    REJECT_SRC:            './reject.png',
    TEXT:                  'text',
    UTF_8:                 'UTF-8',
  };
  
  var ATTRIBUTES = {
    ALT:   'alt',
    SRC:   'src',
    TYPE:  'type'
  };
  
  var CSS_CLASSES = {
    ACCEPTED:  'accepted',
    ACTIVE:    'active',
    REJECTED:  'rejected',
    TO_VERIFY: 'to-verify'
  };
  
  var ELEMENTS = {
    DIV:   'div',
    IMG:   'img',
    INPUT: 'input',
    SPAN:  'span'
  };
  
  var ELEMENT_IDS = {
    COUNTDOWN:             'countdown',
    NEXT_BUTTON:           'next-button',
    SWITCH_BUTTON:         'switch-button',
    VERIFY_ACTION_WRAPPER: 'verify-action-wrapper',
    VERIFY_IMAGE:          'verify-image',
    WRAPPER:               'wrapper'
  };
  
  var EVENTS = {
    CLICK:              'click',
    DOM_CONTENT_LOADED: 'DOMContentLoaded',
    KEYDOWN:            'keydown',
    LOAD:               'load',
    READY_STATE_CHANGE: 'readystatechange'
  };
  
  var HTTP_CODES = {
    OK: 200
  };
  
  var HTTP_HEADERS = {
    CONTENT_TYPE: 'Content-Type'
  };
  
  var KEYS = {
    ENTER:  'Enter',
    ESCAPE: 'Escape'
  };
  
  var LOCATIONS = {
    SAVE_VERIFIED: '/saveverified',
    SERVER:        'file:///C:/Users/Diner/Documents/Gowanus/EAGER/diletta/foo.html',
    SPLASH:        'file:///C:/Users/Diner/Documents/Gowanus/EAGER/diletta/splash.html',
    TAG:           'file:///C:/Users/Diner/Documents/Gowanus/EAGER/diletta/tag.html',
    THANKS:        'file:///C:/Users/Diner/Documents/Gowanus/EAGER/diletta/foo.html'
  };
  
  var STORAGE_KEYS = {
    NUM_IMAGES_VERIFIED: 'num-images-verified',
    NUM_VERIFIED_TAGS:   'num-verified-tags',
    TIME_REMAINING:      'time-remaining',
    TIME_VERIFYING:      'time-verifying',
    TIMES_VERIFIED:      'times-verified',
    VERIFY_IMAGE_ID:     'verify-image-id'
  };
  
  var TOPICS = {
    ACCEPT:             'accept',
    ACCEPT_EDIT:        'accept-edit',
    BEGIN_VERIFICATION: 'begin-verification',
    DONE:               'done',
    ESCAPE_REJECT:      'escape-reject',
    NEXT_IMAGE:         'next-image',
    REJECT:             'reject',
    REJECT_EDIT:        'reject-edit',
    SWITCH_TASKS:       'switch-tasks'
  };
  
  var XHR = {
    POST: 'POST'
  };
  
  var NUM_IMAGES = 118;
  
  var TAGS_TO_VERIFY = [
    [{x: 325, y: 210, tag: 'buoy'}],
    [{x: 262, y: 168, tag: 'bridge'}],
    [{x: 325, y:  74, tag: 'canoe'}],
    [{x: 283, y: 108, tag: 'buoy'}],
    [{x: 136, y: 210, tag: 'construction'}],
    [{x:  88, y: 194, tag: 'truck'}],
    [{x: 225, y: 107, tag: 'rock'}],
    [{x: 260, y: 210, tag: 'leaves'}],
    [{x: 242, y:  13, tag: 'wheel'}],
    [{x: 302, y: 106, tag: 'boat'}],
    [{x: 178, y: 162, tag: 'building'}],
    [{x: 200, y: 169, tag: 'boat'}],
    [{x: 158, y: 165, tag: 'truck'}],
    [{x: 245, y: 140, tag: 'wall'}],
    [{x: 272, y: 124, tag: 'wall'}],
    [{x:  92, y: 175, tag: 'bridge'}],
    [{x: 226, y: 210, tag: 'life vest'}],
    [{x: 186, y: 136, tag: 'boat'}],              
    [{x: 308, y: 210, tag: 'wheel'}],
    [{x:  46, y: 116, tag: 'tube'}],
    [{x:  83, y: 133, tag: 'building'}],
    [{x: 268, y: 210, tag: 'wheel'}],
    [{x: 265, y: 201, tag: 'boat'}],
    [{x:  67, y:  41, tag: 'buildings'}],
    [{x: 214, y:  73, tag: 'boat'}],
    [{x: 187, y:  14, tag: 'building'} , {x: 275, y: 88, tag: 'buoy'}],
    [{x: 117, y:  20, tag: 'pipes'}    , {x:  53, y: 87, tag: 'buoy'}],
    [{x: 230, y:  63, tag: 'wall'}],
    [{x:  77, y:  81, tag: 'bridge'}],
    [{x: 223, y:  64, tag: 'ball'}],
    [{x: 134, y:  47, tag: 'wall'}     , {x: 160, y: 210, tag: 'bag'}],
    [{x: 111, y:  29, tag: 'plant'}],
    [{x: 244, y: 113, tag: 'bag'}],
    [{x:  54, y:  34, tag: 'wall'}     , {x: 240, y: 129, tag: 'net'}],
    [{x: 295, y:  12, tag: 'tube'}],
    [{x: 150, y: 100, tag: 'wheel'}],
    [{x: 300, y: 186, tag: 'plant'}],
    [{x: 193, y: 210, tag: 'flag'}],
    [{x: 297, y: 123, tag: 'plant'}],
    [{x: 163, y: 127, tag: 'pelican'}],
    [{x: 296, y: 149, tag: 'wall'}],
    [{x: 325, y: 170, tag: 'boat'}],
    [{x: 322, y: 106, tag: 'tree'}],
    [{x: 325, y: 176, tag: 'truck'}],
    [{x: 256, y: 124, tag: 'wall'}     , {x: 325, y: 157, tag: 'tank'}],
    [{x: 232, y: 195, tag: 'tree'}],
    [{x: 322, y: 205, tag: 'rocks'}    , {x: 117, y: 195, tag: 'bird'}],
    [{x: 305, y: 173, tag: 'wall'}],
    [{x: 322, y:  42, tag: 'bridge'}   , {x:  59, y: 210, tag: 'plastic bottles'}],
    [{x: 254, y: 104, tag: 'stones'}   , {x: 159, y: 183, tag: 'wood planks'}],
    [{x: 325, y: 179, tag: 'boat'}],
    [{x: 247, y: 128, tag: 'piles'}],
    [{x: 281, y: 120, tag: 'tube'}],
    [{x: 139, y: 189, tag: 'bridge'}],
    [{x: 114, y: 170, tag: 'wall'}],
    [{x: 325, y:  63, tag: 'plant'}],
    [{x:  22, y: 181, tag: 'piles'}],
    [{x: 186, y:  93, tag: 'wall'}],
    [{x: 118, y:  60, tag: 'bridge'}],
    [{x: 285, y:  79, tag: 'bridge'}],
    [{x: 124, y:  24, tag: 'bridge'}   , {x: 325, y:  92, tag: 'buoys'}],
    [{x: 103, y: 113, tag: 'tree'}     , {x: 262, y: 202, tag: 'buoys'}],
    [{x: 270, y: 110, tag: 'building'}],
    [{x: 316, y:  73, tag: 'building'}],
    [{x: 325, y: 130, tag: 'plant'}    , {x:   2, y: 210, tag: 'murky water'}],
    [{x: 325, y: 137, tag: 'plants'}],
    [{x:  89, y:  81, tag: 'buildings'}],
    [{x: 325, y: 114, tag: 'plant'}],
    [{x: 253, y: 128, tag: 'plants'}],
    [{x: 179, y:  73, tag: 'buildings'}],
    [{x: 106, y: 153, tag: 'piles'}],
    [{x: 175, y:  26, tag: 'tree'}     , {x: 309, y: 110, tag: 'concrete debris'}],
    [{x: 101, y: 147, tag: 'piles'}],
    [{x: 256, y:  62, tag: 'plants'}   , {x: 270, y: 139, tag: 'stones'}],
    [{x: 285, y:  99, tag: 'wall'}],
    [{x: 167, y:  55, tag: 'wall'}],
    [{x: 144, y:  22, tag: 'building'}],
    [{x: 257, y:  61, tag: 'wall'}],
    [{x: 255, y: 101, tag: 'rocks'}],
    [{x:  80, y:  70, tag: 'rocks'}],
    [{x:  48, y:  51, tag: 'buildings'}],
    [{x:  74, y:   4, tag: 'piles'}    , {x: 161, y: 103, tag: 'plastic barrier'}],
    [{x: 273, y:  48, tag: 'tree'}     , {x: 184, y:  54, tag: 'water tower'}],
    [{x: 283, y:  38, tag: 'building'}],
    [{x: 144, y:   9, tag: 'bridge'}],
    [{x: 155, y:  44, tag: 'buildings'}],
    [{x: 152, y:  40, tag: 'plant'}],
    [{x: 294, y:  99, tag: 'wall'}     , {x: 121, y:  34, tag: 'bulldozer'}],
    [{x: 161, y:  99, tag: 'tree'}],
    [{x: 303, y: 185, tag: 'rocks'}    , {x:  22, y:   3, tag: 'rag'}],
    [{x: 312, y: 210, tag: 'twigs'}],
    [{x: 172, y:  54, tag: 'stones'}],
    [{x: 101, y:  63, tag: 'bridge'}],
    [{x: 173, y:  81, tag: 'wall'}     , {x: 238, y:  13, tag: 'wires'}],
    [{x: 234, y:  55, tag: 'wall'}     , {x:  22, y:  31, tag: 'pipe'}],
    [{x: 281, y:  30, tag: 'wall'}],
    [{x: 220, y:  75, tag: 'piles'}],
    [{x: 271, y:  18, tag: 'buildings'}, {x:   1, y:  54, tag: 'boat'}],
    [{x: 164, y:  18, tag: 'building'}],
    [{x: 176, y:  52, tag: 'wood'}],
    [{x: 230, y:  73, tag: 'boat'}],
    [{x: 125, y:  48, tag: 'buildings'}],
    [{x: 305, y:  80, tag: 'boat'}],
    [{x: 195, y:   9, tag: 'buildings'}, {x:  57, y: 102, tag: 'buoy'}],
    [{x: 268, y:  61, tag: 'grass'}],
    [{x: 189, y:  57, tag: 'highway'}],
    [{x: 267, y:  75, tag: 'plants'}],
    [{x: 193, y:   8, tag: 'plants'}],
    [{x: 263, y:  49, tag: 'plants'}   , {x: 176, y: 119, tag: 'buoy'}, {x:   0, y:  20, tag: 'water tower'}],
    [{x: 154, y:  17, tag: 'building'}],
    [{x: 234, y:  64, tag: 'plants'}   , {x: 127, y:   4, tag: 'scaffolding'}],
    [{x: 186, y:  66, tag: 'plants'}],
    [{x: 173, y:  91, tag: 'piles'}    , {x:   0, y: 134, tag: 'buoy'}],
    [{x: 186, y:  24, tag: 'building'}],
    [{x: 122, y:  10, tag: 'storage'}  , {x: 163, y:  52, tag: 'boat'}],
    [{x: 298, y:  55, tag: 'wall'}     , {x: 170, y:  39, tag: 'tube'}, {x:  11, y: 205, tag: 'leaves'}],
    [{x: 276, y:  64, tag: 'wall'}     , {x:  35, y:  25, tag: 'net'}],
    [{x: 169, y: 136, tag: 'rock'}] 
  ];
  
  var events = (function() {
    var topics = {};
    var hOP = topics.hasOwnProperty;
    
    return {
      subscribe: function(topic, listener) {
        /* Create the topic if it does not exist yet. */
        if (!hOP.call(topics, topic)) {
          topics[topic] = [];
        }
        
        /* Add listener to queue. */
        var idx = topics[topic].push(listener) - 1;
        
        /* Provide handle (to enable removal of a listener). */
        return {
          remove: function() {
            delete topics[topic][idx];
          }
        };
      },
      
      publish: function(topic, info) {
        /* If the topic does not exist (or there are no listeners), do nothing. */
        if (!hOP.call(topics, topic)) { return; }
        
        /* Execute each listener on the topic. */
        topics[topic].forEach(function(listener) {
          listener(info !== undefined ? info : {});
        });
      }
    };
  })();
  
  var TagToVerify = function(xPos, yPos, textContent) {
    /* Initialize the element (set its class, position, and text content). */
    this.element = document.createElement(ELEMENTS.SPAN);
    this.element.classList.add(CSS_CLASSES.TO_VERIFY);
    this.setPosition(xPos, yPos);
    this.element.textContent = textContent;
    this.input = document.createElement(ELEMENTS.INPUT);
    this.input.setAttribute(ATTRIBUTES.TYPE, STRINGS.TEXT);
    this.input.addEventListener(EVENTS.KEYDOWN, this.keydown.bind(this));
    
    
    /* Add click event listeners to this element. */
    this.element.addEventListener(EVENTS.CLICK, this.beginVerification.bind(this));
    this.removeSubscriber = events.subscribe(TOPICS.NEXT_IMAGE, this.remove.bind(this));
  };
  
  TagToVerify.prototype.setPosition = function(xPos, yPos) {
    this.element.style.left = xPos + STRINGS.PX;
    this.element.style.top  = yPos + STRINGS.PX;
  };
  
  TagToVerify.prototype.beginVerification = function(event) {
    this.element.classList.add(CSS_CLASSES.ACTIVE);
    this.element.classList.remove(CSS_CLASSES.ACCEPTED);
    this.element.classList.remove(CSS_CLASSES.REJECTED);
    events.publish(TOPICS.BEGIN_VERIFICATION);
    this.acceptSubscriber = events.subscribe(TOPICS.ACCEPT, this.accepted.bind(this));
    this.rejectSubscriber = events.subscribe(TOPICS.REJECT, this.rejected.bind(this));
  };
  
  TagToVerify.prototype.accepted = function(info) {
    this.element.classList.remove(CSS_CLASSES.ACTIVE);
    this.element.classList.add(CSS_CLASSES.ACCEPTED);
    this.unsubscribe();
  };
  
  TagToVerify.prototype.rejected = function(info) {
    this.element.classList.remove(CSS_CLASSES.ACTIVE);
    this.element.classList.add(CSS_CLASSES.REJECTED);
    
    this.input.value = this.element.textContent;
    
    /* Copy attributes. */
    for (var idx = 0, len = this.element.attributes.length; idx < len; ++idx) {
      this.input.setAttribute(this.element.attributes[idx].name, this.element.attributes[idx].value);
    }
    
    /* Copy children. */
    //do {
    //  input.appendChild(this.element.firstChild)
    //} while(this.element.firstChild);
    
    this.element.parentNode.replaceChild(this.input, this.element);
    this.input.focus();
    this.input.select();
    
    this.acceptEditSubscriber = events.subscribe(TOPICS.ACCEPT_EDIT, this.acceptedEdit.bind(this));
    this.rejectEditSubscriber = events.subscribe(TOPICS.REJECT_EDIT, this.rejectedEdit.bind(this));
  };
  
  TagToVerify.prototype.acceptedEdit = function(event) {
    this.element.classList.remove(CSS_CLASSES.REJECTED);
    this.element.classList.add(CSS_CLASSES.ACCEPTED);
    this.element.textContent = this.input.value;
    this.input.parentNode.replaceChild(this.element, this.input);
    
    this.unsubscribe();
  };
  
  TagToVerify.prototype.rejectedEdit = function(event) {
    this.input.parentNode.replaceChild(this.element, this.input);
    this.unsubscribe();
  };
  
  TagToVerify.prototype.keydown = function(event) {
    if (event.key === KEYS.ENTER) {
      event.preventDefault();
      event.stopPropagation();
      events.publish(TOPICS.ACCEPT_EDIT);
      events.publish(TOPICS.ENTER_ACCEPT);
    }
    
    if (event.key === KEYS.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      events.publish(TOPICS.REJECT_EDIT);
      events.publish(TOPICS.ESCAPE_REJECT);
    }
  };
  
  TagToVerify.prototype.unsubscribe = function() {
    if (this.acceptSubscriber) {
      this.acceptSubscriber.remove();
    }
    if (this.rejectSubscriber) {
      this.rejectSubscriber.remove();
    }
    if (this.acceptEditSubscriber) {
      this.acceptEditSubscriber.remove();
    }
    if (this.rejectEditSubscriber) {
      this.rejectEditSubscriber.remove();
    }
//    this.removeSubscriber.remove();
  };
  
  TagToVerify.prototype.remove = function(info) {
    this.unsubscribe();
    this.removeSubscriber.remove();
    this.element.parentNode.removeChild(this.element);
  }
  
  var VerifyAction = function(imgSrc, textContent, action) {
    this.element = document.createElement(ELEMENTS.IMG);
    this.element.setAttribute(ATTRIBUTES.SRC, imgSrc);
    this.element.setAttribute(ATTRIBUTES.ALT, textContent);
    this.action = action.bind(this);
    this.element.addEventListener(EVENTS.CLICK, this.action);
    events.subscribe(TOPICS.BEGIN_VERIFICATION, this.show.bind(this));
  };
  
  VerifyAction.prototype.show = function() {
    var verifyActionWrapper = document.getElementById(ELEMENT_IDS.VERIFY_ACTION_WRAPPER);
    if (!verifyActionWrapper.contains(this.element)) {
      verifyActionWrapper.appendChild(this.element);
    }
  }
  
  VerifyAction.prototype.hide = function() {
//    this.element.parentNode.removeChild(this.element);
     var verifyActionWrapper = document.getElementById(ELEMENT_IDS.VERIFY_ACTION_WRAPPER);
    if (verifyActionWrapper.contains(this.element)) {
      verifyActionWrapper.removeChild(this.element);
    }
  };
  
  VerifyAction.prototype.setAction = function(action) {
    this.element.removeEventListener(EVENTS.CLICK, this.action);
    this.action = action.bind(this);
    this.element.addEventListener(EVENTS.CLICK, this.action);
  };
  
  var Button = function(id) {
    this.button = document.getElementById(id);
    this.button.addEventListener(EVENTS.CLICK, this.next.bind(this));
  };
  
  Button.prototype.next = function(event) {
    events.publish(TOPICS.NEXT_IMAGE);
  };
  
  var SwitchTasks = function() {
    this.element = document.getElementById(ELEMENT_IDS.SWITCH_BUTTON);
  };
  
  SwitchTasks.prototype.change = function() {
    var numImagesVerifiedKey = STORAGE_KEYS.NUM_IMAGES_VERIFIED;
    var numVerifiedTagsKey   = STORAGE_KEYS.NUM_VERIFIED_TAGS;
    var timeVerifyingKey     = STORAGE_KEYS.TIME_VERIFYING;
    
    var timesVerified = 0;
    if (sessionStorage.getItem(STORAGE_KEYS.TIMES_VERIFIED)) {
      timesVerified = Number.parseInt(sessionStorage.getItem(STORAGE_KEYS.TIMES_VERIFIED));
    }
    
    numImagesVerifiedKey += ('-' + timesVerified)
    numVerifiedTagsKey   += ('-' + timesVerified);
    timeVerifyingKey     += ('-' + timesVerified);
    
    var numImagesVerified = sessionStorage.getItem(STORAGE_KEYS.NUM_IMAGES_VERIFIED);
    var numVerifiedTags   = sessionStorage.getItem(STORAGE_KEYS.NUM_VERIFIED_TAGS);
    var timeVerifying     = sessionStorage.getItem(STORAGE_KEYS.TIME_VERIFYING);
    
    if (null === numImagesVerified) {
      numImagesVerified = 1;
    }
    
    sessionStorage.setItem(numImagesVerifiedKey, numImagesVerified);
    sessionStorage.setItem(numVerifiedTagsKey, numVerifiedTags);
    sessionStorage.setItem(timeVerifyingKey, timeVerifying);
    
    sessionStorage.setItem(STORAGE_KEYS.TIMES_VERIFIED, timesVerified + 1);
    
    events.publish(TOPICS.SWITCH_TASKS, function() {
      window.location = LOCATIONS.TAG;
    });
  };
  
  var Wrapper = function() {
    this.element      = document.getElementById(ELEMENT_IDS.WRAPPER);
    this.img          = document.getElementById(ELEMENT_IDS.VERIFY_IMAGE);
    this.button       = new Button(ELEMENT_IDS.NEXT_BUTTON, this);
    this.tagsToVerify = [];
    this.verifiedTags = [];
    this.numVerifiedTags = 0;
    this.numImagesVerified = 1;
    
    var imageId = 1;

	var imageId = parseInt(readCookie("imageId"));
    this.img.src = this.img.src.replace(/[0-9]+.png/, imageId + ".png");
    
    var tags = TAGS_TO_VERIFY[imageId - 1];
    
    var tagToVerify = null;
    for (var idx = 0; idx < tags.length; ++idx) {
      tagToVerify = new TagToVerify(tags[idx].x, tags[idx].y, tags[idx].tag);
      this.element.appendChild(tagToVerify.element);
//      this.tagsToVerify.push(tagToVerify);
    }
    events.subscribe(TOPICS.NEXT_IMAGE, this.showNextImage.bind(this));
    events.subscribe(TOPICS.ACCEPT, this.updateVerifiedTags.bind(this));
    events.subscribe(TOPICS.ACCEPT_EDIT, this.updateVerifiedTags.bind(this));
    events.subscribe(TOPICS.SWITCH_TASKS, this.switchTasks.bind(this));
    events.subscribe(TOPICS.DONE, this.save.bind(this));
  };
  
  Wrapper.prototype.showNextImage = function(event) {
    /* Get the source for the next image and load it. */
    var imageId = this.getImageId();
    if (NUM_IMAGES == imageId) {
      imageId = 1;
    } else {
      imageId += 1;
    }
    this.img.src = this.img.src.replace(/[0-9]+.png/, imageId + STRINGS.PNG);
    
    /* Clear the list of tags to verify, then add the tags for the next image. */
//    this.tagsToVerify = [];
    var tagToVerify = null;
    for (idx = 0; idx < TAGS_TO_VERIFY[imageId - 1].length; ++idx) {
      tagToVerify = new TagToVerify(TAGS_TO_VERIFY[imageId - 1][idx].x, TAGS_TO_VERIFY[imageId - 1][idx].y, TAGS_TO_VERIFY[imageId - 1][idx].tag);
      this.element.appendChild(tagToVerify.element);
//      this.tagsToVerify.push(tagToVerify);
    }
    
    this.numImagesVerified += 1;
    sessionStorage.setItem(STORAGE_KEYS.NUM_IMAGES_VERIFIED, this.numImagesVerified);
    
  };
  
  Wrapper.prototype.getImageId = function() {
    var dotIndex = this.img.src.lastIndexOf('.');
    var firstNumberIndex = dotIndex - 1;
    while (!isNaN(Number.parseInt(this.img.src[firstNumberIndex])) && firstNumberIndex >= 0) {
      --firstNumberIndex;
    }
    return Number.parseInt(this.img.src.substring(firstNumberIndex + 1, dotIndex));
  };
  
  Wrapper.prototype.updateVerifiedTags = function() {
    this.numVerifiedTags++;
    sessionStorage.setItem(STORAGE_KEYS.NUM_VERIFIED_TAGS, this.numVerifiedTags);
  };

  Wrapper.prototype.switchTasks = function(info) {
    /* if (sessionStorage.getItem(STORAGE_KEYS.NUM_VERIFIED_TAGS)) {
      var numPreviousVerifiedTags = Number.parseInt(sessionStorage.getItem(STORAGE_KEYS.NUM_VERIFIED_TAGS));
      sessionStorage.setItem(STORAGE_KEYS.NUM_VERIFIED_TAGS, numPreviousVerifiedTags + this.numVerifiedTags);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.NUM_VERIFIED_TAGS, this.numVerifiedTags);
    } */
    
    sessionStorage.setItem(STORAGE_KEYS.VERIFY_IMAGE_ID, this.getImageId() + 1);
    
    if (info) {
      info();
    }
  };
  
  Wrapper.prototype.save = function(info) {
    /* var xhr = new XMLHttpRequest();
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_CODES.OK){
          window.location = LOCATIONS.SERVER;
        }
      }
    });
    xhr.open(XHR.POST, LOCATIONS.SAVE_VERIFIED);
    xhr.setRequestHeader(HTTP_HEADERS.CONTENT_TYPE, STRINGS.APPLICATION_JSON + ';' + STRINGS.CHARSET + '=' + STRINGS.UTF_8);
    xhr.send(JSON.stringify(this.verifiedTags)); */
    if (sessionStorage.getItem(STORAGE_KEYS.NUM_VERIFIED_TAGS)) {
      var numPreviousVerifiedTags = sessionStorage.getItem(STORAGE_KEYS.NUM_VERIFIED_TAGS);
      sessionStorage.setItem(STORAGE_KEYS.NUM_VERIFIED_TAGS, numPreviousVerifiedTags + this.numVerifiedTags);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.NUM_VERIFIED_TAGS, this.numVerifiedTags);
    }
//    window.location = LOCATIONS.THANKS;
  };
  
  var acceptActionCallback = function(event) {
    this.hide();
    events.publish(TOPICS.ACCEPT);
  };
  
  var rejectActionCallback = function(event) {
    events.publish(TOPICS.REJECT);
    this.setAction(rejectEditActionCallback);
  }
  
  var acceptEditActionCallback = function(event) {
    this.hide();
    this.setAction(acceptActionCallback.bind(this));
    events.publish(TOPICS.ACCEPT_EDIT);
  }
  
  var rejectEditActionCallback = function(event) {
    this.hide();
    this.setAction(rejectActionCallback.bind(this));
    events.publish(TOPICS.REJECT_EDIT);
  };
  
  document.addEventListener(EVENTS.DOM_CONTENT_LOADED, function(event) {
    var eventStage = new Wrapper();
    
    var acceptAction = new VerifyAction(STRINGS.ACCEPT_SRC, STRINGS.ACCEPT_ALT, acceptActionCallback);
    var rejectAction = new VerifyAction(STRINGS.REJECT_SRC, STRINGS.REJECT_ALT, rejectActionCallback);
    
    var switchTasks = new SwitchTasks();
    
    var setAcceptAction = function(info) {
      acceptAction.setAction(acceptEditActionCallback.bind(acceptAction));
    };
    
    var setRejectAction = function(info) {
      rejectAction.hide();
      rejectAction.setAction(rejectActionCallback.bind(rejectAction));
    };
    
    var resetAcceptAction = function(info) {
      acceptAction.hide();
      acceptAction.setAction(acceptActionCallback.bind(acceptAction));
    };
    
    var setEnterActions = function(info) {
      acceptAction.hide();
      acceptAction.setAction(acceptActionCallback.bind(acceptAction));
      rejectAction.hide();
      rejectAction.setAction(rejectActionCallback.bind(rejectAction));
    };
    
    var setEscapeActions = function(info) {
      acceptAction.hide();
      acceptAction.setAction(acceptActionCallback.bind(acceptAction));
      rejectAction.hide();
      rejectAction.setAction(rejectActionCallback.bind(rejectAction));
    };
    
    events.subscribe(TOPICS.ACCEPT, rejectAction.hide.bind(rejectAction));
    events.subscribe(TOPICS.REJECT, setAcceptAction);
    events.subscribe(TOPICS.ACCEPT_EDIT, setRejectAction);
    events.subscribe(TOPICS.REJECT_EDIT, resetAcceptAction);
    events.subscribe(TOPICS.ENTER_ACCEPT, setEnterActions);
    events.subscribe(TOPICS.ESCAPE_REJECT, setEscapeActions);

  });
  function readCookie(key){
    var result;
	return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
  }
})(window, document);