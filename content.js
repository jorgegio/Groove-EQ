document.addEventListener('DOMContentLoaded', function () {

  var mono = false;
  var eqBands = [0,0,0,0,0,0,0,0,0,0,0,0];

  function updateSliders(sliderValue, sliderId){
    eqBands[parseInt(sliderId.substr(4),10)-1] = sliderValue;
    console.log(eqBands);
  }


  Array.from(document.getElementsByClassName('slider')).forEach(function(element) {
    //Call upon array update onclick  
    element.addEventListener('click', function(e){updateSliders(e.target.value, e.target.id);});
    //Reset sliders on double click
    element.addEventListener('dblclick', function(e){e.target.value = 0;});
  });
  

  //Reset band sliders
  document.getElementById('reset').onclick = function () {
    Array.from(document.getElementsByClassName("band")).forEach((bSlider) => {
      bSlider.value = 0;
      updateSliders(bSlider.value, bSlider.id);
    });
    console.log("RESET!");
  };
  
  //Mono toggle
  document.getElementById('radio-a').onclick = function() {mono = true;}
  document.getElementById('radio-b').onclick = function() {mono = false;}
  
  document.getElementById('mono').onclick = function () {
    if(mono){
      console.log("Mono");
    } else console.log("Stereo");
  };


}, false);