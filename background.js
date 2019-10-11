var eqBands = [0,0,0,0,0,0,0,0,0,0,0,0];
//[30,60,90,160,300,500,900,1600,3000,5000,9000,16000]
var mono = false;
var gain = 0;
const context = new window.AudioContext;

function getTabStream(){
  chrome.tabCapture.capture({audio: true, video: false}, (stream) => {
    console.log(stream);
    const sourceNode = context.createMediaStreamSource(stream);
    const eq = context.createGain();
    sourceNode.connect(eq);
    eq.connect(context.destination);
  });
}

chrome.runtime.onMessage.addListener(function (element) {
  if (element == "getValues"){
    getTabStream();
    chrome.runtime.sendMessage({type: "bandValues", value: eqBands});
    chrome.runtime.sendMessage({type: "monoValue", value: mono});
    chrome.runtime.sendMessage({type: "gainValue", value: gain});
  }
  if(element.type) {
    eqBands[parseInt(element.type.substr(4),10)-1] = parseInt(element.value);
  }
  if(element.type == "mono"){
    mono = element.value;
  }
  if(element.type == "gain"){
    gain = element.value;
  }
});