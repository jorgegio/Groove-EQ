console.log("Background running");
var eqBands = [0,0,0,0,0,0,0,0,0,0,0,0];
var mono = false;
var gain = 0;

chrome.runtime.onMessage.addListener(function (element) {
  if (element == "getValues"){
    console.log("Sending values... beep boop");
    chrome.runtime.sendMessage({type: "bandValues", value: eqBands});
    chrome.runtime.sendMessage({type: "monoValue", value: mono});
    chrome.runtime.sendMessage({type: "gainValue", value: gain});
  }
  if(element.type) {
    eqBands[parseInt(element.type.substr(4),10)-1] = parseInt(element.value);
    console.log("Listened for values: ", eqBands);
  }
  if(element.type == "mono"){
    mono = element.value;
    console.log("Background received mono");
  }
  if(element.type == "gain"){
    gain = element.value;
    console.log("Background received gain");
  }
});
