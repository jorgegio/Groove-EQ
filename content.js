document.addEventListener('DOMContentLoaded', function () {
  window.onload = function(){
    chrome.runtime.sendMessage("popupOpened");
  }

  var mono = false;

  updateSliders = function(sliderValue, sliderId){
    chrome.runtime.sendMessage({type: sliderId, value: sliderValue});
  }
  updateMono = function(){
    if(mono){
      document.getElementById("radio-a").checked = true;
    } else {
      document.getElementById("radio-b").checked = true;
    }
    chrome.runtime.sendMessage({type: "mono", value: mono});
  }
  updateGain = function(gainValue){
    chrome.runtime.sendMessage({type: "gain", value: gainValue});
  }
  updatePower = function(powerValue){
    chrome.runtime.sendMessage({type: "power", value: powerValue});
  }

  chrome.runtime.onMessage.addListener(function (element) {
    if (element.type == "bandValues") {
      for(i = 0; i<12; i++){
        document.getElementById("band"+(i+1)).value = (element.value[i]);
      }
    }
    if(element.type == "monoValue"){
      mono = element.value;
      if(mono){
        document.getElementById("radio-a").checked = true;
      } else {
        document.getElementById("radio-b").checked = true;
      }
    }
    if(element.type == "gainValue"){
      document.getElementById('gain').value = element.value;
    }
    if(element.type == "powerValue"){
      document.getElementById('onOff').checked = element.value;
    }
  });

  document.getElementById('gain').addEventListener('click',function(e){
    updateGain(e.target.value);
  });
  document.getElementById('onOff').addEventListener('click',function(e){
    updatePower(e.target.checked);
  })

  Array.from(document.getElementsByClassName('slider')).forEach(function(element) {
    //Call upon slider update onclick  
    element.addEventListener('click', function(e){
      if(element.id !='gain'){
        if(e.target.id){
          updateSliders(e.target.value, e.target.id);
        }
      } else updateGain();
    });
    //Reset sliders on double click
    element.addEventListener('dblclick', function(e){
      if(e.target.id !='gain'){
        e.target.value = 0;
        updateSliders(e.target.value, e.target.id);
      } else {
        e.target.value = 1;
        updateGain();
      }
    });
  });

  //Reset band sliders
  document.getElementById('reset').onclick = function () {
    Array.from(document.getElementsByClassName('band')).forEach((bSlider) => {
      bSlider.value = 0;
      updateSliders(bSlider.value, bSlider.id);
    });
    mono = false;
    document.getElementById('gain').value = 1;
    updateGain(1);
    updateMono();
    document.getElementById('onOff').checked = true;
    updatePower(true);
    chrome.runtime.sendMessage("reset");
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
}, false);