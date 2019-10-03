document.addEventListener('DOMContentLoaded', function () {
  //Reset band sliders
  document.getElementById('reset').onclick = function () {
    Array.from(document.getElementsByClassName("band")).forEach((bSlider) => {
      bSlider.value = 0;
    });
    console.log("RESET!");
  };
  //Reset sliders on double click
  document.getElementById('band1').ondblclick = function () {band1.value = 0;}
  document.getElementById('band2').ondblclick = function () {band2.value = 0;}
  document.getElementById('band3').ondblclick = function () {band3.value = 0;}
  document.getElementById('band4').ondblclick = function () {band4.value = 0;}
  document.getElementById('band5').ondblclick = function () {band5.value = 0;}
  document.getElementById('band6').ondblclick = function () {band6.value = 0;}
  document.getElementById('band7').ondblclick = function () {band7.value = 0;}
  document.getElementById('band8').ondblclick = function () {band8.value = 0;}
  document.getElementById('band9').ondblclick = function () {band9.value = 0;}
  document.getElementById('band10').ondblclick = function () {band10.value = 0;}
  document.getElementById('band11').ondblclick = function () {band11.value = 0;}
  document.getElementById('band12').ondblclick = function () {band12.value = 0;}

  //Mono toggle (incomplete)
  document.getElementById('mono').onclick = function () {
    Array.from(document.getElementsByClassName("band")).forEach((bSlider) => {
      console.log("The value of " + bSlider.id + " is " + bSlider.value);
  
    });
    console.log("Mono");
  };
}, false);