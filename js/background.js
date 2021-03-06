var filter = {
    urls: ["<all_urls>"],
    types: [ "main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
};

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    var headerInfo = JSON.parse(localStorage['salmonMHH']);
    var url = details.url;
    if (isChange(details.url)) {
        for (var i = 0; i < headerInfo.length; i++) {
            if (!headerInfo[i].notChanged && headerInfo[i].display) {
                for (var j = 0; j < details.requestHeaders.length; j++) {
                    if (details.requestHeaders[j].name == headerInfo[i].name) {
                        details.requestHeaders[j].value = headerInfo[i].value;
                        break;
                    }
                }
                //no found, self add header
                if (j == details.requestHeaders.length) {
                    details.requestHeaders.push({name: headerInfo[i].name, value: headerInfo[i].value});
                }
            }
        }
    }
    return {requestHeaders: details.requestHeaders};
}, filter, ["blocking", "requestHeaders"]);

function isChange(_url)
{
    var host = _url.split('/')[2];
    if(localStorage['includeUrlText'] != undefined) {
        var includeUrl = localStorage['includeUrlText'].split(';');
        if (includeUrl.length == 0) {
            return true;
        }
        for (var i = 0; i < includeUrl.length; i++) {
            var reg = includeUrl[i].replace(/\./g, '\\\.');
            if (host.match(reg) != null) {
                return true;
            }
        }
    } else {
        return true;
    }
}

function randomIP()
{
    //perhaps has local area network ip address
     return Math.floor(Math.random()*225)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255);
}
