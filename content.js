document.addEventListener('DOMContentLoaded', function () {
  window.onload = function(){
    chrome.runtime.sendMessage("getValues");
  }


  var mono = false;
  var gain = 0;

  function updateSliders(sliderValue, sliderId){
    chrome.runtime.sendMessage({type: sliderId, value: document.getElementById(sliderId).value});
  }
  function updateMono(){
    if(mono){
      document.getElementById("radio-a").checked = true;
    } else {
      document.getElementById("radio-b").checked = true;
    }
    chrome.runtime.sendMessage({type: "mono", value: mono});
  }
  function updateGain(){
    chrome.runtime.sendMessage({type: "gain", value: gain});
  }

  chrome.runtime.onMessage.addListener(function (element) {
    if (element.type == "bandValues") {
      console.log("Received from background: ", element.value);
      for(i = 0; i< element.value.length; i++){
        document.getElementById("band"+(i+1)).value=(element.value[i]);
      }
    }
    if(element.type == "monoValue"){
      console.log("Entered mono check");
      mono = element.value;
      if(mono){
        document.getElementById("radio-a").checked = true;
      } else {
        document.getElementById("radio-b").checked = true;
      }
    }
    if(element.type == "gainValue"){
      gain = element.value;
    }
  });


  Array.from(document.getElementsByClassName('slider')).forEach(function(element) {
    //Call upon array update onclick  
    element.addEventListener('click', function(e){
      if(e.target.id){
        updateSliders(e.target.value, e.target.id);
      }
    });
    //Reset sliders on double click
    element.addEventListener('dblclick', function(e){
      e.target.value = 0;
      updateSliders(e.target.value, e.target.id);
    });
  });
  

  //Reset band sliders
  document.getElementById('reset').onclick = function () {
    Array.from(document.getElementsByClassName("band")).forEach((bSlider) => {
      bSlider.value = 0;
      updateSliders(bSlider.value, bSlider.id);
    });
    mono = false;
    updateMono();
    console.log("RESET!");
  };
  
  //Mono toggle
  document.getElementById('radio-a').onclick = function() {
    mono = true;
    updateMono();
  }
  document.getElementById('radio-b').onclick = function() {
    mono = false;
    updateMono();
  }
  
  document.getElementById('mono').onclick = function () {
    if(mono){
      console.log("Mono");
    } else console.log("Stereo");
  };
}, false);