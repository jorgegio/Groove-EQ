let eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const frequencies = [
  50,
  100,
  200,
  400,
  600,
  700,
  900,
  1600,
  3000,
  5000,
  9000,
  16000,
];
let cTabObj = {};
let power = true;
let mono = false;
let maxChannelCount = 6;
let gain = 1;

let windowState;
let fullScreen;

//Initializes biquads with filter type and frequencies
const initBandBiquads = () => {
  cTabObj.audioCtx.latencyHint = "playback";
  cTabObj.bands[0].type = "lowshelf";
  cTabObj.bands[0].frequency.setValueAtTime(
    frequencies[0],
    cTabObj.audioCtx.currentTime
  );
  for (let i = 1; i < 11; i++) {
    cTabObj.bands[i].type = "peaking";
    cTabObj.bands[i].frequency.setValueAtTime(
      frequencies[i],
      cTabObj.audioCtx.currentTime
    );
  }
  cTabObj.bands[11].type = "highshelf";
  cTabObj.bands[11].frequency.setValueAtTime(
    frequencies[11],
    cTabObj.audioCtx.currentTime
  );
  cTabObj.gainNode.gain.setValueAtTime(1, cTabObj.audioCtx.currentTime);
};

const getTabStream = () => {
  //Close audiostream if it already exists
  closeAudio();
  //Gets audiostream from tab
  chrome.tabCapture.capture({ audio: true, video: false }, (c) => {
    if (chrome.runtime.lastError) {
    }
    if (c) {
      createAudio(c);
      initBandBiquads();
      for (let i = 0; i < 12; i++) {
        cTabObj.bands[i].gain.setValueAtTime(
          eq[i],
          cTabObj.audioCtx.currentTime
        );
      }
      cTabObj.gainNode.gain.setValueAtTime(gain, cTabObj.audioCtx.currentTime);
      connect();
      monoConnect();
    }
  });
};

//Creates audio context and biquads
const createAudio = (a) => {
  cTabObj.stream = a;
  cTabObj.audioCtx = new AudioContext();
  cTabObj.streamOutput = cTabObj.audioCtx.createMediaStreamSource(
    cTabObj.stream
  );
  cTabObj.gainNode = cTabObj.audioCtx.createGain();
  cTabObj.bands = [];
  for (let i = 0; i < 12; i++) {
    cTabObj.bands.push(cTabObj.audioCtx.createBiquadFilter());
  }

  maxChannelCount = cTabObj.audioCtx.destination.maxChannelCount;
};

//Connects biquads to output stream
const connect = () => {
  cTabObj.streamOutput.connect(cTabObj.bands[0]);
  for (let i = 1; i < 12; i++) {
    cTabObj.bands[i - 1].connect(cTabObj.bands[i]);
  }
  cTabObj.bands[11].connect(cTabObj.gainNode);
  cTabObj.gainNode.connect(cTabObj.audioCtx.destination);
};

const monoConnect = () => {
  cTabObj.audioCtx.destination.channelCount = mono ? 1 : maxChannelCount;
};

const closeAudio = () => {
  if (cTabObj.stream) {
    cTabObj.stream.getAudioTracks()[0].stop();
    cTabObj.audioCtx.close();
    cTabObj = {};
  }
};

chrome.tabCapture.onStatusChanged.addListener((e) => {
  console.log("status changed", e);

  if (e.fullscreen && e.status === "active") {
    chrome.windows.getCurrent((currWindow) => {
      console.log("currWindow", currWindow);

    //   if (e.fullscreen) {
    //     chrome.windows.update(currWindow.id, { state: "fullscreen" });
    //   } else {
    //     chrome.windows.update(currWindow.id, { state: "normal" });
    //   }
    });
  }

  // fullscreen = true;
  // if (b.status == "active" && b.tabId) {
  // 	chrome.windows.getCurrent(function (a) {
  // 		var c = a.id;
  // 		if (false !== fullscreen) {
  // 			if (true === b.fullscreen) {
  // 				windowState = a.state;
  // 				chrome.windows.update(c, { state: "fullscreen" }, null);
  // 			} else {
  // 				chrome.windows.update(c, { state: windowState }, null);
  // 			}
  // 		} else {
  // 			chrome.windows.update(c, { state: a.state }, null);
  // 		}
  // 	});
  // }
});

chrome.runtime.onMessage.addListener(function (element) {
  if (element == "popupOpened") {
    power ? getTabStream() : closeAudio();
    chrome.runtime.sendMessage({ type: "bandValues", value: eq });
    chrome.runtime.sendMessage({ type: "monoValue", value: mono });
    chrome.runtime.sendMessage({ type: "gainValue", value: gain });
    chrome.runtime.sendMessage({ type: "powerValue", value: power });
  }
  if (element.type) {
    let bandId = parseInt(element.type.substr(4), 10) - 1;
    if (element.type.substr(0, 4) == "band") {
      eq[bandId] = parseInt(element.value);
    }
    if (element.type == "power") {
      power = element.value;
      power ? getTabStream() : closeAudio();
    }
    if (cTabObj.stream) {
      switch (element.type.substr(0, 4)) {
        case "band":
          cTabObj.bands[bandId].gain.setValueAtTime(
            element.value,
            cTabObj.audioCtx.currentTime
          );
          break;
        case "gain":
          gain = element.value;
          if (isFinite(gain)) {
            cTabObj.gainNode.gain.setValueAtTime(
              (gain * gain) / 3,
              cTabObj.audioCtx.currentTime
            );
          }
          break;
        case "mono":
          mono = element.value;
          monoConnect();
          break;
      }
    }
  }
});
