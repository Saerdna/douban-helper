// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Global accessor that the popup uses.

function gao(tabId, tabUrl, pageType) {
  chrome.tabs.sendMessage(tabId, {status: "start", tabUrl: tabUrl, pageType: pageType}, function(response){
    console.log(response);
  }); 
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
// Ensure the current selected tab is set up.
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if(change.status == "complete"){
    pageType = getPageType(tab.url);
    if(pageType != null){
      chrome.pageAction.show(tabId);
      gao(tabId, tab.url, pageType);
    }
  }
});
