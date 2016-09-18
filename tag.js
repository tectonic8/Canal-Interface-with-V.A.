(function(window, document) {
	/*changes so far: changed filepath in html, 
	removed useless stuff (buttons and countdown)
	changed filepath in LOCATIONS object*/
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
    FINISH_BUTTON: 'finish-button',
    TAG_IMAGE:     'tag-image',
    WRAPPER:       'wrapper'
  };
  
  var EVENTS = {
    CLICK:              'click',
    DOM_CONTENT_LOADED: 'DOMContentLoaded',
    KEYDOWN:            'keydown',
    LOAD:               'load',
    MOUSEDOWN:          'mousedown',
    MOUSEMOVE:          'mousemove',
    MOUSEUP:            'mouseup'
  };
  
  var KEYS = {
    ENTER:  'Enter',
    ESCAPE: 'Escape'
  };
  
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
    ACCEPT: 'Accept',
    CANCEL: 'Cancel',
    PNG:    '.png',
    PX:     'px'
  };
  
  var TOPICS = {
    ACCEPTED_TAG:  'accepted-tag',
    BEGIN_TAGGING: 'begin-tagging',
    CANCELLED_TAG: 'cancelled-tag',
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
  };
  
  Tag.prototype.setPosition = function(x, y) {
    this.element.style.left = x + STRINGS.PX;
    this.element.style.top  = y + STRINGS.PX;
  };
  
  Tag.prototype.hide = function() {
    this.element.parentNode.removeChild(this.element);
  };
  
  var Wrapper = function() {
    this.element = document.getElementById(ELEMENT_IDS.WRAPPER);
    this.img     = document.getElementById(ELEMENT_IDS.TAG_IMAGE);
    this.img.addEventListener(EVENTS.LOAD, this.setupImgListener.bind(this));
    
    this.tags = [];
    this.numImagesTagged = 0;
    
	var imageId = parseInt(readCookie("imageId"));
    this.img.src = this.img.src.replace(/[0-9]+.png/, imageId + ".png");
    
    this.handleClickCallback = this.handleClick.bind(this);
    events.subscribe(TOPICS.ACCEPTED_TAG, this.pushTag.bind(this));
    
    var handleFinish = function(event) {
      document.cookie = "numTags=" + this.tags.length + ";";
      window.location.replace('index.html');
    };
    
    document.getElementById(ELEMENT_IDS.FINISH_BUTTON).addEventListener(EVENTS.CLICK, handleFinish.bind(this));
    
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
  
  Wrapper.prototype.pushTag = function(info) {
    this.tags.push(info);
    //sessionStorage.setItem(STORAGE_KEYS.TAGS, this.tags);
    sessionStorage.setItem(STORAGE_KEYS.TAGS, info.tag);
    sessionStorage.setItem(STORAGE_KEYS.NUM_TAGS, this.tags.length);
    
    /* if (sessionStorage.getItem(STORAGE_KEYS.NUM_TAGS)) {
      var numPreviousVerifiedTags = Number.parseInt(sessionStorage.getItem(STORAGE_KEYS.NUM_TAGS));
      sessionStorage.setItem(STORAGE_KEYS.NUM_TAGS, numPreviousVerifiedTags + 1);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.NUM_TAGS, this.tags.length);
    } */
  }
  
  document.addEventListener(EVENTS.DOM_CONTENT_LOADED, function(event) {
    var eventStage = new Wrapper();
    var tagFrame = new TagFrame();
  });
  function readCookie(key){
    var result;
	return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
  }
})(window, document);