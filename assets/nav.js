/* Highlight active nav item based on current path */
(function(){
  var path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.topnav a[data-nav]').forEach(function(a){
    var navPath = a.getAttribute('data-nav');
    if (navPath === '/') {
      if (path === '/' || path === '') a.classList.add('active');
    } else if (path === navPath || path.indexOf(navPath + '/') === 0) {
      a.classList.add('active');
    }
  });
})();
