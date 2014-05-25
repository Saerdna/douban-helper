
var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // 我们只接受来自我们自己的消息
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "BAN_PAGE")) {
    var urlId = event.data.urlId;
    var item = new Object();
    item[urlId] = event.data.title;
    chrome.storage.sync.set(item);
  }
  if (event.data.type && (event.data.type == "RECOVER_PAGE")){
    var urlId = event.data.urlId;
    chrome.storage.sync.remove(urlId);
  }
  if(event.data.type && (event.data.type == "CLEAR_BAN_PAGE")){
    chrome.storage.sync.clear();
  }
}, false);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.status == "start" && request.pageType == "postList"){
            var solveResult = solve();
            sendResponse({result: solveResult});
        }
        if (request.status == "start" && request.pageType == "postPage"){
            addButton(request.tabUrl);
        }
});

function getUrlId(tabUrl){
    var patt = RegExp("\\d+", "g");
    return tabUrl.match(patt)[0];
}

function addButton(tabUrl){
    console.log(tabUrl);
    var urlId = getUrlId(tabUrl);
    console.log(urlId);
    var reportDiv = document.getElementsByClassName('report')[0];
    var myDiv = document.createElement('div');
    var recoLink = document.createElement('a');
    var banLink = document.createElement('a');
    
    recoLink.innerText = "recover it";
    recoLink.addEventListener("click", function(){
        window.postMessage({type: "RECOVER_PAGE", "urlId": urlId}, "*");
    }, false);

    var title = document.getElementById('content').getElementsByTagName('h1')[0].innerText;
    banLink.innerText = "drop it";
    banLink.addEventListener("click", function(){
        window.postMessage({ type: "BAN_PAGE", "urlId": urlId, "title": title}, "*");
    }, false);
    
    myDiv.setAttribute('align', 'right');
    myDiv.insertAdjacentElement('afterBegin', banLink);
    myDiv.insertAdjacentElement('afterBegin', document.createElement('tr'));
    myDiv.insertAdjacentElement('afterBegin', recoLink);
    

    reportDiv.insertAdjacentElement('beforeBegin', myDiv);
}
function solve(){
    var postList = document.getElementsByClassName("pl");
    var nodeList = new Array();
    
    for(var i = 0; i < postList.length; ++i){
        nodeList.push(postList[i]);
    }
    nodeList.forEach(function(node){
        var post = node.getElementsByClassName("title")[0];
        var urlId = getUrlId(post.getAttribute('href'));
        var replyNum = node.getElementsByClassName("td-reply")[0].innerText.split("回应")[0];
        chrome.storage.sync.get(urlId, function(item){
            if(item[urlId] != null){
                //console.log(item[urlId]);
                node.setAttribute("class", "hide");
            }else{
                if(replyNum <= 20){
                    node.setAttribute("bgcolor", "66FFFF");
                }
            }
        });
    });
    return true;
}
function getPageType(tabUrl){
    var pattArr = {"http://www.douban.com/group/topic/\\d+/": "postPage", "http://www.douban.com/group/": "postList"}
    for(var patt in pattArr){
        var pattReg = RegExp(patt, "g");
        if(tabUrl.match(pattReg)) {
            return pattArr[patt];
        }
    }
    console.log("tabUrl:" + tabUrl);
    return null;
}
