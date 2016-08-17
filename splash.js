(function(window, document) {
  var ELEMENT_IDS = {
    TAG_FIRST:    'tag-first',
    VERIFY_FIRST: 'verify-first'
  };
  
  var EVENTS = {
    CLICK:              'click',
    DOM_CONTENT_LOADED: 'DOMContentLoaded'
  };
  
  var LOCATIONS = {
    TAG:    'tag.html',
    VERIFY: 'verify.html',
  };
  
  var STORAGE_KEYS = {
    TIME_REMAINING: 'time-remaining',
    TRIAL_ID:       'trial-id'
  };

  document.addEventListener(EVENTS.DOM_CONTENT_LOADED, function(event) {
    var tagFirst    = document.getElementById(ELEMENT_IDS.TAG_FIRST);
    var verifyFirst = document.getElementById(ELEMENT_IDS.VERIFY_FIRST);
    
    var trialId     = 1;
    
    if (sessionStorage.getItem(STORAGE_KEYS.TRIAL_ID)) {
      trialId  = Number.parseInt(sessionStorage.getItem(STORAGE_KEYS.TRIAL_ID));
      trialId += 1;
    }
    
    sessionStorage.setItem(STORAGE_KEYS.TIME_REMAINING, 180);
    
    tagFirst.addEventListener(EVENTS.CLICK, function(event) {
      if (trialId > 3) {
        trialId = 1;
        sessionStorage.clear();
      }
      sessionStorage.setItem(STORAGE_KEYS.TRIAL_ID, trialId);
      window.location = LOCATIONS.TAG;
    });
    
    verifyFirst.addEventListener(EVENTS.CLICK, function(event) {
      if (trialId > 3) {
        trialId = 1;
        sessionStorage.clear();
      }
      sessionStorage.setItem(STORAGE_KEYS.TRIAL_ID, trialId);
      
      window.location = LOCATIONS.VERIFY;
    });
    
  });
})(window, document);