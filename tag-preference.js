(function(window, document) {
  var CSS_CLASSES = {
    ACCEPT:        'accept',
    ACCEPT_CANCEL: 'accept-cancel',
    BLANK_SPACE:   'blank-space',
    CANCEL:        'cancel',
    TAG:           'tag',
    TAG_FRAME:     'tag-frame'
  };
  
  var ELEMENTS = {
    DIV:   'div',
    INPUT: 'input',
    SPAN:  'span'
  };
  
  var ELEMENT_IDS = {
    COUNTDOWN:     'countdown',
    NEXT_BUTTON:   'next-button',
    SWITCH_BUTTON: 'switch-button',
    TAG_IMAGE:     'tag-image',
    WRAPPER:       'wrapper'
  };
  
  var ERROR_MESSAGES = {
    FAIL_TO_SAVE: 'Could not save data on server...discard this trial...!!!'
  };
  
  var EVENTS = {
    BEFORE_UNLOAD:      'beforeunload',
    CLICK:              'click',
    DOM_CONTENT_LOADED: 'DOMContentLoaded',
    KEYDOWN:            'keydown',
    LOAD:               'load',
    MOUSEDOWN:          'mousedown',
    MOUSEMOVE:          'mousemove',
    MOUSEUP:            'mouseup',
    READY_STATE_CHANGE: 'readystatechange'
  };
  
  var HTTP_CODES = {
    OK: 200
  };
  
  var HTTP_HEADERS = {
    CONTENT_TYPE: 'Content-Type'
  };
  
  var HTTP_VERBS = {
    GET:  'GET',
    POST: 'POST'
  };
  
  var KEYS = {
    ENTER:  'Enter',
    ESCAPE: 'Escape'
  };
  
  var LOCATIONS = {
    APP_PRACTICE:  'app-practice.html',
    INITIAL_TIME:  'initialtime',
    SAVE_TAGGED:   'savetagged',
    SAVE_TIME:     'savetime',
    VERIFY:        'verify-preference',
    WRITE_TO_DISK: 'write'
  }
  
  var STORAGE_KEYS = {
    NUM_IMAGES_TAGGED: 'num-images-tagged',
    NUM_TAGS:          'num-tags',
    TAG_IMAGE_ID:      'tag-image-id',
    TAGS:              'tags',
    TIME_REMAINING:    'time-remaining',
    TIME_TAGGING:      'time-tagging',
    TIMES_TAGGED:      'times-tagged'
  };
  
  var STRINGS = {
    ACCEPT:           'Accept',
    APPLICATION_JSON: 'application/json',
    CANCEL:           'Cancel',
    CHARSET:          'charset',
    CONJOIN_HEADER:   '; ',
    EQUALS_SYMBOL:    '=',
    FUNCTION:         'function',
    PNG:              '.png',
    PX:               'px',
    UTF_8:            'UTF-8',
  };
  
  var TOPICS = {
    ACCEPTED_TAG:       'accepted-tag',
    BEGIN_VERIFICATION: 'begin-verification',
    BEGIN_TAGGING:      'begin-tagging',
    CANCELLED_TAG:      'cancelled-tag',
    DONE:               'done',
    LOADED:             'loaded',
    NEXT_IMAGE:         'next-image',
    SWITCH_TASKS:       'switch-tasks'
  };
  
  var NUM_IMAGES = 100;
  
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
  
  var TagFrame = function() {
    this.container = document.createElement(ELEMENTS.DIV);
    this.container.classList.add(CSS_CLASSES.TAG_FRAME);
    this.input = document.createElement(ELEMENTS.INPUT);

    this.element = document.createElement(ELEMENTS.DIV);
    this.element.classList.add(CSS_CLASSES.BLANK_SPACE);
    var acceptCancelDiv = document.createElement(ELEMENTS.DIV);
    acceptCancelDiv.classList.add(CSS_CLASSES.ACCEPT_CANCEL);
    
    this.accept = document.createElement(ELEMENTS.SPAN);
    this.accept.textContent = STRINGS.ACCEPT;
    this.accept.classList.add(CSS_CLASSES.ACCEPT);
    
    this.cancel = document.createElement(ELEMENTS.SPAN);
    this.cancel.textContent = STRINGS.CANCEL;
    this.cancel.classList.add(CSS_CLASSES.CANCEL);
    
    acceptCancelDiv.appendChild(this.accept);
    acceptCancelDiv.appendChild(this.cancel);
    
    this.container.appendChild(this.input);
    this.container.appendChild(this.element);
    this.container.appendChild(acceptCancelDiv);
    
    this.width        = 127;
    this.height       = 127;
    this.heightOffset =  33; /* TODO: make this dynamic with the size of the input element. */
    this.widthOffset  =   2;
    this.minLeft      =  -2;
    this.minTop       = -33; /* TODO: make this dynamic with the size of the input element. */
    
    this.handleMousemoveCallback = this.handleMousemove.bind(this);
    this.handleMouseupCallback   = this.handleMouseup.bind(this);
    
    events.subscribe(TOPICS.BEGIN_TAGGING, this.show.bind(this));
    events.subscribe(TOPICS.NEXT_IMAGE, this.hide.bind(this));
    this.element.addEventListener(EVENTS.MOUSEDOWN, this.handleMousedown.bind(this));
    this.accept.addEventListener(EVENTS.CLICK, this.acceptTag.bind(this));
    this.cancel.addEventListener(EVENTS.CLICK, this.cancelTag.bind(this));
    this.input.addEventListener(EVENTS.KEYDOWN, this.handleKeydown.bind(this));
  };
  
  TagFrame.prototype.show = function(info) {
    info.parent.appendChild(this.container);
    
    this.maxLeft = info.width - this.width - this.widthOffset;
    this.maxTop  = info.height - this.height - this.heightOffset;
    
    this.setPosition(info.x - this.width / 2, info.y - this.height / 2 - this.heightOffset);
    this.input.focus();
  };
  
  TagFrame.prototype.hide = function() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.input.value = '';
    }
  }
  
  TagFrame.prototype.setPosition = function(x, y) {
    var left = Math.max(this.minLeft, x);
    left = Math.min(this.maxLeft, left);
    
    var top = Math.max(this.minTop, y);
    top = Math.min(this.maxTop, top);
    this.container.style.left = left + STRINGS.PX;
    this.container.style.top  = top  + STRINGS.PX;

    this.left = left;
    this.top  = top;
  }
  
  TagFrame.prototype.acceptTag = function(event) {
    var tag = new Tag(this.left + this.widthOffset, this.top + this.height / 2 + this.heightOffset / 2, this.input.value);
    this.container.parentNode.replaceChild(tag.element, this.container);
    
    var info = {
      x: this.left + this.widthOffset,
      y: this.top + this.height / 2 + this.heightOffset / 2,
      tag: this.input.value
    };
    
    this.input.value = '';
    events.publish(TOPICS.ACCEPTED_TAG, info);
  };
  
  TagFrame.prototype.cancelTag = function(event) {
    this.container.parentNode.removeChild(this.container);
    this.input.value = '';
    events.publish(TOPICS.CANCELLED_TAG)
  };
  
  TagFrame.prototype.handleKeydown = function(event) {
    if (event.key === KEYS.ENTER) {
      event.preventDefault();
      event.stopPropagation();
      this.acceptTag();
    }
    
    if (event.key === KEYS.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      this.cancelTag();
    }
  };
  
  TagFrame.prototype.handleMousedown = function(event) {
    document.addEventListener(EVENTS.MOUSEMOVE, this.handleMousemoveCallback);
    document.addEventListener(EVENTS.MOUSEUP, this.handleMouseupCallback);
    event.preventDefault();
    event.stopPropagation();
  };
  
  TagFrame.prototype.handleMousemove = function(event) {
    this.setPosition(this.left + event.movementX, this.top + event.movementY);
    event.preventDefault();
    event.stopPropagation();
  };
  
  TagFrame.prototype.handleMouseup = function(event) {
    document.removeEventListener(EVENTS.MOUSEMOVE, this.handleMousemoveCallback);
    document.removeEventListener(EVENTS.MOUSEUP, this.handleMouseupCallback);
    event.preventDefault();
    event.stopPropagation();
    this.input.focus();
  };
  
  var Tag = function(x, y, tag) {
    this.element = document.createElement(ELEMENTS.SPAN);
    this.element.classList.add(CSS_CLASSES.TAG);
    this.setPosition(x, y);
    this.element.textContent = tag;
    this.nextImageSubscriber = events.subscribe(TOPICS.NEXT_IMAGE, this.hide.bind(this));
  };
  
  Tag.prototype.setPosition = function(x, y) {
    this.element.style.left = x + STRINGS.PX;
    this.element.style.top  = y + STRINGS.PX;
  };
  
  Tag.prototype.hide = function() {
    this.element.parentNode.removeChild(this.element);
    this.nextImageSubscriber.remove();
  };
  
  var NextButton = function() {
    this.element = document.getElementById(ELEMENT_IDS.NEXT_BUTTON);
    this.element.addEventListener(EVENTS.CLICK, this.next.bind(this));
  };
  
  NextButton.prototype.next = function(event) {
    events.publish(TOPICS.NEXT_IMAGE);
  };
  
  var SwitchTasks = function() {
    this.element = document.getElementById(ELEMENT_IDS.SWITCH_BUTTON);
    this.element.addEventListener(EVENTS.CLICK, this.change.bind(this));
  };
  
  SwitchTasks.prototype.change = function() {
    events.publish(TOPICS.SWITCH_TASKS, function() {
      window.location.replace(LOCATIONS.VERIFY);
    });
  };
  
  var Countdown = function(initialTime) {
    this.initialTime = initialTime;
    this.timeRemaining = initialTime;
    this.totalTime = 0;
    this.element = document.getElementById(ELEMENT_IDS.COUNTDOWN);
    this.formatTime();
  };
  
  Countdown.prototype.formatTime = function() {
    var minutes = Math.floor(this.timeRemaining / 60);
    var seconds = this.timeRemaining % 60;
    if (seconds >= 10) {
      this.element.textContent = '' + minutes + ':' + seconds;
    } else {
      this.element.textContent = '' + minutes + ':0' + seconds;
    }
  };
  
  Countdown.prototype.start = function() {
    window.setTimeout(this.tick.bind(this), 1000);
  };
  
  Countdown.prototype.tick = function() {
    this.timeRemaining -= 1;
    this.formatTime();
    
    this.totalTime += 1;
    
    if (0 === this.timeRemaining) {
      events.publish(TOPICS.DONE);
    } else {
      window.setTimeout(this.tick.bind(this), 1000);
    }
  };
  
  var Wrapper = function() {
    this.element = document.getElementById(ELEMENT_IDS.WRAPPER);
    this.img     = document.getElementById(ELEMENT_IDS.TAG_IMAGE);
    this.img.addEventListener(EVENTS.LOAD, this.setupImgListener.bind(this));
    
    this.countdown = new Countdown(0);
    
    this.tags = [];
    this.numImagesTagged = 1;
    this.switched = false;
    
    if (sessionStorage.getItem(STORAGE_KEYS.TAG_IMAGE_ID)) {
      var imageId = sessionStorage.getItem(STORAGE_KEYS.TAG_IMAGE_ID);
      this.img.src = this.img.src.replace(/[0-9]+.png/, imageId + STRINGS.PNG);
    }
    
    this.handleClickCallback = this.handleClick.bind(this);
    events.subscribe(TOPICS.NEXT_IMAGE, this.showNextImage.bind(this));
    events.subscribe(TOPICS.ACCEPTED_TAG, this.pushTag.bind(this));
    events.subscribe(TOPICS.SWITCH_TASKS, this.switchTasks.bind(this));
    events.subscribe(TOPICS.DONE, this.finish.bind(this));
    events.subscribe(TOPICS.BEFORE_UNLOAD, this.saveTime.bind(this));
    events.subscribe(TOPICS.LOADED, (function(info) {
      this.countdown.start();
    }).bind(this));
  };
  
  Wrapper.prototype.handleClick = function(event) {
    this.img.removeEventListener(EVENTS.CLICK, this.handleClickCallback);
    var info = { 
      x: event.offsetX,
      y: event.offsetY,
      width: this.img.width,
      height: this.img.height,
      parent: this.element
    };
    events.publish(TOPICS.BEGIN_TAGGING, info);
    events.subscribe(TOPICS.ACCEPTED_TAG, this.restoreEventListener.bind(this));
    events.subscribe(TOPICS.CANCELLED_TAG, this.restoreEventListener.bind(this));
  };
  
  Wrapper.prototype.setupImgListener = function(event) {
    this.img.addEventListener(EVENTS.CLICK, this.handleClickCallback);
  }
  
  Wrapper.prototype.restoreEventListener = function(info) {
    this.img.addEventListener(EVENTS.CLICK, this.handleClickCallback);
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
    
    this.numImagesTagged += 1;
  };
  
  Wrapper.prototype.getImageId = function() {
    var dotIndex = this.img.src.lastIndexOf('.');
    var firstNumberIndex = dotIndex - 1;
    while (!isNaN(Number.parseInt(this.img.src[firstNumberIndex])) && firstNumberIndex >= 0) {
      --firstNumberIndex;
    }
    return Number.parseInt(this.img.src.substring(firstNumberIndex + 1, dotIndex));
  }
  
  Wrapper.prototype.switchTasks = function(info) {
    this.switched = true;
    this.save(info);
  };
  
  Wrapper.prototype.save = function(info) {
    var xhr = new XMLHttpRequest();
    var contentTypeString = STRINGS.APPLICATION_JSON + STRINGS.CONJOIN_HEADER + STRINGS.CHARSET + STRINGS.EQUALS_SYMBOL + STRINGS.UTF_8;
    var data = {
      numTags:         this.tags.length,
      numImagesTagged: this.numImagesTagged,
      timeTagging:     this.countdown.initialTime - this.countdown.timeRemaining,
      imageId:         this.getImageId() + 1,
      switched:        this.switched
    };
    
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_CODES.OK) {
          if (typeof info === STRINGS.FUNCTION) {
            info();
          }
        } else {
          console.log(ERROR_MESSAGES.FAIL_TO_SAVE);
        }
      }
    });
    xhr.open(HTTP_VERBS.POST, LOCATIONS.SAVE_TAGGED);
    xhr.setRequestHeader(HTTP_HEADERS.CONTENT_TYPE, contentTypeString);
    xhr.send(JSON.stringify(data));
  };

  Wrapper.prototype.saveTime = function(info) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_CODES.OK) {
          window.dispatchEvent(EVENTS.BEFORE_UNLOAD, info);
        }
      }
    });
    var contentTypeString = STRINGS.APPLICATION_JSON + STRINGS.CONJOIN_HEADER + STRINGS.CHARSET + STRINGS.EQUALS_SYMBOL + STRINGS.UTF_8;
    var data = {
      timeTagging:   this.countdown.initialTime - this.countdown.timeRemaining, 
      timeRemaining: this.countdown.timeRemaining
    };
    xhr.open(HTTP_VERBS.POST, LOCATIONS.SAVE_TIME);
    xhr.setRequestHeader(HTTP_HEADERS.CONTENT_TYPE, contentTypeString);
    xhr.send(JSON.stringify(data));
  };
  
  Wrapper.prototype.finish = function(info) {
    var contentTypeString = STRINGS.APPLICATION_JSON + STRINGS.CONJOIN_HEADER + STRINGS.CHARSET + STRINGS.EQUALS_SYMBOL + STRINGS.UTF_8;
    var data = {
      numVerifiedTags:   this.numVerifiedTags,
      numImagesVerified: this.numImagesVerified,
      timeVerifying:     this.countdown.initialTime - this.countdown.timeRemaining,
    };
    var xhr = new XMLHttpRequest();
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_CODES.OK) {
          window.location.replace(LOCATIONS.APP_PRACTICE);
        }
      }
    });
    xhr.open(HTTP_VERBS.POST, LOCATIONS.WRITE_TO_DISK);
    xhr.setRequestHeader(HTTP_HEADERS.CONTENT_TYPE, contentTypeString);
    xhr.send(JSON.stringify(data));
  };
  
  Wrapper.prototype.pushTag = function(info) {
    this.tags.push(info);
  }
  
  window.addEventListener(EVENTS.LOAD, function(event) {
    events.publish(TOPICS.LOADED);
  });
  
  window.addEventListener(EVENTS.BEFORE_UNLOAD, function(event) {
    events.publish(TOPICS.BEFORE_UNLOAD, event);
    event.preventDefault();
  });
  
  document.addEventListener(EVENTS.DOM_CONTENT_LOADED, function(event) {
    var eventStage = new Wrapper();
    var nextButton = new NextButton();
    var switchTasks = new SwitchTasks();
    var tagFrame = new TagFrame();
    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener(EVENTS.READY_STATE_CHANGE, function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === HTTP_CODES.OK) {
          var timeRemaining = Number.parseInt(xhr.responseText);
          eventStage.countdown.initialTime = timeRemaining;
          eventStage.countdown.timeRemaining = timeRemaining;
          eventStage.countdown.formatTime();
        }
      }
    });
    xhr.open(HTTP_VERBS.GET, LOCATIONS.INITIAL_TIME);
    xhr.send(null);
  });
})(window, document);