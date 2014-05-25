function getUrl(urlId){
	return "http://www.douban.com/group/topic/" + urlId + "/";
}
function init(){
	var banDiv = document.getElementsByClassName("ban_list")[0];
	var clearLink = document.getElementById('clearLink');
	clearLink.addEventListener("click", function(){
        chrome.storage.sync.clear();
        location.reload();
    }, false);
    banDiv.insertAdjacentElement('afterBegin', clearLink);
    console.log(banDiv);
	chrome.storage.sync.get(null, function(items){
		var allKeys = Object.keys(items);
		for(var i = 0; i < allKeys.length; ++i){
			var urlId = allKeys[i];
			var title = items[urlId];
			var oneRow = document.createElement('tr');
			var oneCol = document.createElement('td');
			var banLinkTr = document.createElement('tr');
			var banLink = document.createElement('a');
			var url = getUrl(urlId);


			banLink.innerText = url;
			banLink.setAttribute("href", url);
			banLink.setAttribute("target", "_blank");
			banLink.setAttribute("class", "url");
			oneCol.insertAdjacentElement("afterBegin", banLink);

			oneRow.insertAdjacentElement("afterBegin", oneCol);

			oneCol = document.createElement('td');
			oneCol.innerText = title;
			oneCol.setAttribute("nowrap", "nowrap");
			oneCol.setAttribute("class", "title");

			oneRow.insertAdjacentElement("beforeEnd", oneCol);

			banDiv.insertAdjacentElement("beforeEnd", oneRow);
		}
	});
}
window.addEventListener("DOMContentLoaded", init, false);
