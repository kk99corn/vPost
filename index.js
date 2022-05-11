// https://stackoverflow.com/questions/56478681/send-post-request-from-chrome-extension
var onMessageHandler = function (message) {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);

    // code from https://stackoverflow.com/a/7404033/934239
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", message.url);
    for (var key in message.data) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", message.data[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}

chrome.runtime.onMessage.addListener(onMessageHandler);


function postData(url, data) {
    chrome.tabs.create(
        {url: chrome.runtime.getURL("index.html")},
        function (tab) {
            var handler = function (tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(handler);
                    chrome.tabs.sendMessage(tabId, {url: url, data: data});
                }
            }

            // in case we're faster than page load (usually):
            chrome.tabs.onUpdated.addListener(handler);
            // just in case we're too late with the listener:
            chrome.tabs.sendMessage(tab.id, {url: url, data: data});
        }
    );
}

document.getElementById("allCheck").onclick = function () {
    let url = document.getElementById("postUrl").value
    // Usage:
    postData(url, {"id": "world", "name": " ipsum"});
};
