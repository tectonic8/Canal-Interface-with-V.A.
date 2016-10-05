(function(window, document) {
  window.addEventListener('DOMContentLoaded', function(event) {
    var cookies = document.cookie.split(';');
    for (var idx = 0; idx < cookies.length; ++idx) {
      var cookie = cookies[idx];
      var eqPos  = cookie.indexOf('=');
      var name   = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  });
})(window, document);