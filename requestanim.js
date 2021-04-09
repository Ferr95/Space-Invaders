/**
	requestanim.js
	Davide Ferri

	File di utilità
*/

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function(callback) {
		      window.setTimeout(callback, 1000 / 60);
		   };
})();

window.addEventListener("load",function() {
  init(); },true);
