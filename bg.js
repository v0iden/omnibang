// !bang background
// author: Fernando Iazeolla
// license: GPLv2

function escapeString(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};


// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    console.log('inputChanged: ' + text);
    var results = text.split(" "); // ["yt", "wintergatan"]
    var bang = (results.shift()); // first element of array
    var stringquery = results.join("%20");
    var queryURL = escapeString(make_queryURL(take_searchengine(bang), stringquery));
    suggest([{ content: ">" + (queryURL), description: (queryURL) }]);

  }
);

// configuration ...
var defaultengine = 'g';
var linkstart = ">";

// Load bangs from json
const bangs_json_path = chrome.runtime.getURL('bangs.json');
fetch(bangs_json_path)
  .then(response => response.json())
  .then(data => { banglist = data });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {
    if (text.charAt(0) == linkstart) { queryURL = text.slice(1); } // Keep all characters except first (0 index)
    else {
      var results = text.split(" "); // ["yt", "wintergatan"]
      var bang = (results.shift()); // return and remove first element of array
      var stringquery = results.join("%20");
      var queryURL = make_queryURL(take_searchengine(bang), stringquery);
    }

    navigate(queryURL);
  }
);

function take_searchengine(bang) {
  var baseURL = undefined;
  // var localelang = window.navigator.language;
  baseURL = banglist[bang];
  if (!baseURL) { baseURL = banglist[defaultengine]; }
  return baseURL;
};

function make_queryURL(baseURL, stringquery) {
  var queryURL = baseURL.replace('%s', stringquery);
  return queryURL;
};

function navigate(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: url });
  });
};

window.addEventListener('click', function (e) {
  if (e.target.href !== undefined) {
    chrome.tabs.create({ url: e.target.href })
  }
});
