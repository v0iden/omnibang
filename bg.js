// !bang background
// author: Fernando Iazeolla
// license: GPLv2


// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    console.log('inputChanged: ' + text);
    // suggest([
    //   {content: ">http://www.autistici.org/0xFE/!bang/", description: "goto !bang web site"},
    //   {content: ">http://www.autistici.org/0xFE/!bang/man.php", description: "goto !bang online documentation"}
    // ]);
  });

//chrome.omnibox.onInputStarted.addListener(
//	function(){
//		console.log('inputStarted: ');
//    	//add web site sugestion
//	}
//);
// function readBangs(json) {
//   var arr = 
// }
// configuration ...
var searchsigil = '!';
var defaultengine = 'g';
var gosigil = '>';

// Load bangs from json
const bangs_json_path = chrome.runtime.getURL('bangs.json')
fetch(bangs_json_path)
  .then(response => response.json())
  .then(data => {arr = data});


// chrome.runtime.onStartup.addListener(
//   console.log("Online")
// );

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {

    var res = text.split(" ");
    // console.log(res)
    var searchengine = ("!" + res.shift());
    // console.log(searchengine)
    if (searchengine.charAt(0) != searchsigil) { res.unshift(searchengine); searchengine = "null"; }
    var stringquery = res.join("%20");
    //alert(searchengine+' '+stringquery);
    //console.log('search engine: ' + searchengine+ ' string query: '+stringquery);
    //alert('search engine: ' + searchengine+ ' string query: '+stringquery+take_searchengine(searchengine));
    //alert(make_queryURL(take_searchengine(searchengine),stringquery));
    var queryURL = make_queryURL(take_searchengine(searchengine), stringquery);
    //alert(queryURL);
    navigate(queryURL);
  });
function take_searchengine(ss) {
  var ret = undefined;
  var localelang = window.navigator.language;

  var engin = ss.substr(1);
  ret = arr[engin];
  if (!ret) { ret = arr[defaultengine]; }
  return ret;
};
function make_queryURL(searchengine, stringquery) {
  var ret = searchengine.replace('%s', stringquery);
  return ret;
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
