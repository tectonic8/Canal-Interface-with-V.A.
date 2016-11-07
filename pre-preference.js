(function(window, document) {

  document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById("ready-button");

    button.addEventListener("click", function(event) {
      if (Math.random() > 0.5) {
      	window.location.replace('tag-preference');
      }
      else {
      	window.location.replace('verify-preference');
      }
    });

  });
	
})(window, document);