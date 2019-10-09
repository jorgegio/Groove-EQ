console.log("Background running");
var eqBands = [0,0,0,0,0,0,0,0,0,0,0,0];


chrome.runtime.onMessage.addListener(function (element) {
  if (element == "getValues"){
    console.log("Sending values... beep boop");
    chrome.runtime.sendMessage({type: "bandValues", value: eqBands});
  }
  if (element.type) {
    eqBands[parseInt(element.type.substr(4),10)-1] = parseInt(element.value);
    console.log("Listened for values: ", eqBands);
  }
});

function updateEq(tab) {
  console.log("Update Eq Message Sent");
  let msg = {
    txt: "hello"
  }
  chrome.tabs.sendMessage(tab.id, msg);
}
