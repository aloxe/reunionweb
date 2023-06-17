

const searchInput = document.getElementById('search');
searchInput.onfocus = function(e) {
  console.log("focus");

  // TODO load only once
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', '/js/search.js');
  document.head.appendChild(script);
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', '/js/elasticlunr.min.js');
  document.head.appendChild(script);
  var mainBlock = document.getElementsByTagName('main')[0];
  mainBlock.style.opacity = 0.4
  if (searchInput.value.length > 0) {
    mainBlock.style.height = 0;
    mainBlock.style.visibility = "hidden" 
    const searchBlock = document.createElement("main");
    searchBlock.innerHTML = '<h1>Recherche</h1><h4>Recherchez un mot, un nom, une phrase dans tous les articles du site</h4><ol id="searchResults"></ol><div id="noResultsFound" style="display: none"><p>Aucun résultat.</p></div>';
    mainBlock.before(searchBlock);
  }
}



searchInput.onblur = function(e) {
  console.log("blur");
  var mainBlock = document.getElementsByTagName('main')[1];
  var searchBlock = document.getElementsByTagName('main')[0];
  mainBlock.style.height = "auto";
  mainBlock.style.visibility = "visible"
  mainBlock.style.opacity = 1
  searchBlock.parentNode.removeChild(searchBlock);
}

// searchInput.onblur = function(e) {
//   const results = window.searchIndex.search(e.target.value, {
//     bool: "OR",
//     expand: true,
//   });
//   _paq.push(['trackSiteSearch',e.target.value, false, results?.length]);
//   }
