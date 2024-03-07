

var searchInput = document.getElementById('search');

var searchBlock = document.createElement('main');
searchBlock.className = 'searchblock';
searchBlock.innerHTML = '<h1>Recherche</h1><h4><button id="searchClose" title="arrêter la recherche">×</button><span></span></h4><ol id="searchResults"></ol><div id="noResultsFound" style="display: none"><p>Aucun résultat.</p></div>';

var mainBlock;

var elasticLoaded = false;

searchInput.onfocus = function(e) {
  mainBlock = document.getElementsByTagName('main')[0];
  mainBlock.style.opacity = 0.4;
  mainBlock.style.display = "block";
  searchBlock.style.display = "none";
  mainBlock.after(searchBlock);

  if (!elasticLoaded) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '/js/search.min.js');
    document.head.appendChild(script);
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '/js/elasticlunr.min.js');
    document.head.appendChild(script);
    elasticLoaded = true;
  }

  // close searchBlock
  var searchClose = document.getElementById("searchClose");
  searchClose.onclick = function(e) {
    console.log("close");
    searchBlock.style.display = "none";
    mainBlock.style.display = "block";
    mainBlock.style.opacity = 1;
    searchInput.value = "";
  }
}

searchInput.oninput = function(e) {
  mainBlock = document.getElementsByTagName('main')[0];
  searchTerm = searchBlock.getElementsByTagName('span')[0];
  searchTerm.innerHTML = searchInput.value;
  if (searchInput.value.length > 2) {
      searchBlock.style.display = "block";
      mainBlock.style.display = "none";
  }
  if (searchInput.value.length < 1) {
      searchBlock.style.display = "none";
      mainBlock.style.display = "block";
  }
}

searchInput.onblur = function(e) {
  mainBlock = document.getElementsByTagName('main')[0];
  searchInput.value = "";
  mainBlock.style.opacity = 1;

  const results = window.searchIndex.search(e.target.value, {
    bool: "OR",
    expand: true,
  });
  _paq.push(['trackSiteSearch',e.target.value, false, results?.length]);
}
