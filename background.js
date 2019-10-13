var eq = [0,0,0,0,0,0,0,0,0,0,0,0];
var cTabObj = {};
var mono = false;
var gain = 1;

//Initializes biquads with filter type and frequencies
initBandBiquads = function () {
  cTabObj.audioCtx.latencyHint = "playback";
  cTabObj.band1.type = "lowshelf";
  cTabObj.band1.frequency.setValueAtTime(30, cTabObj.audioCtx.currentTime);
  cTabObj.band2.type = "peaking";
  cTabObj.band2.frequency.setValueAtTime(60, cTabObj.audioCtx.currentTime);
  //cTabObj.band2.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band3.type = "peaking";
  cTabObj.band3.frequency.setValueAtTime(90, cTabObj.audioCtx.currentTime);
  //cTabObj.band3.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band4.type = "peaking";
  cTabObj.band4.frequency.setValueAtTime(160, cTabObj.audioCtx.currentTime);
  //cTabObj.band4.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band5.type = "peaking";
  cTabObj.band5.frequency.setValueAtTime(300, cTabObj.audioCtx.currentTime);
  //cTabObj.band5.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band6.type = "peaking";
  cTabObj.band6.frequency.setValueAtTime(500, cTabObj.audioCtx.currentTime);
  //cTabObj.band6.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band7.type = "peaking";
  cTabObj.band7.frequency.setValueAtTime(900, cTabObj.audioCtx.currentTime);
  //cTabObj.band7.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band8.type = "peaking";
  cTabObj.band8.frequency.setValueAtTime(1600, cTabObj.audioCtx.currentTime);
  //cTabObj.band8.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band9.type = "peaking";
  cTabObj.band9.frequency.setValueAtTime(3000, cTabObj.audioCtx.currentTime);
  //cTabObj.band9.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band10.type = "peaking";
  cTabObj.band10.frequency.setValueAtTime(5000, cTabObj.audioCtx.currentTime);
  //cTabObj.band10.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band11.type = "peaking";
  cTabObj.band11.frequency.setValueAtTime(9000, cTabObj.audioCtx.currentTime);
  //cTabObj.band11.Q.setValueAtTime(5, cTabObj.audioCtx.currentTime);
  cTabObj.band12.type = "highshelf";
  cTabObj.band12.frequency.setValueAtTime(16000, cTabObj.audioCtx.currentTime);
  cTabObj.gainNode.gain.setValueAtTime(1, cTabObj.audioCtx.currentTime);
}

getTabStream = function () {
  //Close audiostream if it already exists
  //Gets audiostream from tab
  if (cTabObj.stream) {
    cTabObj.stream.getAudioTracks()[0].stop();
    cTabObj.audioCtx.close();
    cTabObj = {};
  }
  chrome.tabCapture.capture({audio: true, video: false}, (c) => {
    if (chrome.runtime.lastError) {}
    if(c){
      createAudio(c);
      initBandBiquads();

      cTabObj.band1.gain.setValueAtTime(eq[0], cTabObj.audioCtx.currentTime);
      cTabObj.band2.gain.setValueAtTime(eq[1], cTabObj.audioCtx.currentTime);
      cTabObj.band3.gain.setValueAtTime(eq[2], cTabObj.audioCtx.currentTime);
      cTabObj.band4.gain.setValueAtTime(eq[3], cTabObj.audioCtx.currentTime);
      cTabObj.band5.gain.setValueAtTime(eq[4], cTabObj.audioCtx.currentTime);
      cTabObj.band6.gain.setValueAtTime(eq[5], cTabObj.audioCtx.currentTime);
      cTabObj.band7.gain.setValueAtTime(eq[6], cTabObj.audioCtx.currentTime);
      cTabObj.band8.gain.setValueAtTime(eq[7], cTabObj.audioCtx.currentTime);
      cTabObj.band9.gain.setValueAtTime(eq[8], cTabObj.audioCtx.currentTime);
      cTabObj.band10.gain.setValueAtTime(eq[9], cTabObj.audioCtx.currentTime);
      cTabObj.band11.gain.setValueAtTime(eq[10], cTabObj.audioCtx.currentTime);
      cTabObj.band12.gain.setValueAtTime(eq[11], cTabObj.audioCtx.currentTime);
      cTabObj.gainNode.gain.setValueAtTime(gain, cTabObj.audioCtx.currentTime);
      connect();
    }
  })
}

//Creates audio context and biquads
createAudio = function (a) {
  cTabObj.stream = a;
  cTabObj.audioCtx = new AudioContext;
  cTabObj.streamOutput = cTabObj.audioCtx.createMediaStreamSource(cTabObj.stream);
  cTabObj.gainNode = cTabObj.audioCtx.createGain();
  cTabObj.band1 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band2 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band3 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band4 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band5 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band6 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band7 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band8 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band9 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band10 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band11 = cTabObj.audioCtx.createBiquadFilter();
  cTabObj.band12 = cTabObj.audioCtx.createBiquadFilter();
};

//Connects biquads to output stream
connect = function () {
  cTabObj.streamOutput.connect(cTabObj.band1);
  cTabObj.band1.connect(cTabObj.band2);
  cTabObj.band2.connect(cTabObj.band3);
  cTabObj.band3.connect(cTabObj.band4);
  cTabObj.band4.connect(cTabObj.band5);
  cTabObj.band5.connect(cTabObj.band6);
  cTabObj.band6.connect(cTabObj.band7);
  cTabObj.band7.connect(cTabObj.band8);
  cTabObj.band8.connect(cTabObj.band9);
  cTabObj.band9.connect(cTabObj.band10);
  cTabObj.band10.connect(cTabObj.band11);
  cTabObj.band11.connect(cTabObj.band12);
  cTabObj.band12.connect(cTabObj.gainNode);
  cTabObj.gainNode.connect(cTabObj.audioCtx.destination);
};

closeAudio = function () {
  if (cTabObj.stream) {
    cTabObj.stream.getAudioTracks()[0].stop();
    cTabObj.audioCtx.close();
    cTabObj = {};
    location.reload();
  }
}



chrome.runtime.onMessage.addListener(function (element) {
  if(element == "popupOpened"){
    getTabStream();
    chrome.runtime.sendMessage({type: "bandValues", value: eq});
    chrome.runtime.sendMessage({type: "monoValue", value: mono});
    chrome.runtime.sendMessage({type: "gainValue", value: gain});
  }
  else if(!cTabObj.stream && element !== "reset"){
    getTabStream();
  }
  if(element == "reset"){
    if(cTabObj.stream){
      closeAudio();
    }
  }

  if(element.type) {
    if(element.type.substr(0,4) == "band"){
      eq[parseInt(element.type.substr(4),10)-1] = parseInt(element.value);
    }
    if(cTabObj.stream){
      switch(element.type){
        case "band1":
            cTabObj.band1.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band2":
            cTabObj.band2.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band3":
            cTabObj.band3.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band4":
            cTabObj.band4.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band5":
            cTabObj.band5.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band6":
            cTabObj.band6.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band7":
            cTabObj.band7.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band8":
            cTabObj.band8.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band9":
            cTabObj.band9.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band10":
            cTabObj.band10.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band11":
            cTabObj.band11.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "band12":
            cTabObj.band12.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "gain":
            gain = element.value;
            cTabObj.gainNode.gain.setValueAtTime(element.value, cTabObj.audioCtx.currentTime);
          break;
        case "mono":
            mono = element.value;
          break;
      }
    }
  }
});