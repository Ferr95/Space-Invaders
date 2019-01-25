/**
 input.js

 Davide Ferri 517176

 File la gestione dell'input dell'utente
*/
var drag = false;


//callback per i tasti della tastiera
document.onkeydown = function(event) {
  if(livello > 0) {
  if(event.keyCode === 37 || event.keyCode === 100) {
    //Left
    astronave.pressLeft = true;
    astronave.pressRight = false;
  } else {
      if(event.keyCode === 39 || event.keyCode === 102) {
        //Right
        astronave.pressRight = true;
        astronave.pressLeft = false;
    } else {
      if(event.keyCode === 32) {
        //Space
      if(!stoSparando) {
         astronave.sparo = true; //Posso sparare un missile alla volta
         suonoSparo.stop();
         suonoSparo.play();
       }
    }
    }
  }
}
}


document.onkeyup = function(event) {
  if(event.keyCode === 37 || event.keyCode === 100) {
    //Left
    astronave.pressLeft = false;
  } else {

      if(event.keyCode === 39 || event.keyCode === 102) {
        //Right
        astronave.pressRight = false;

    } else {
      if(event.keyCode == 32) {
        //Space
        astronave.sparo = false;
      }
    }
  }

}

document.onmousedown = function(event) {
  if(livello === 0) {
    livello++;
    suonoSchemataPrincipale.play();
  }

  if(gameOver === true) {
    gameOver = false;
    reset();
  } else{
    //Voglio fare drag&drop
    if(!drag) {
      if(event.offsetX < astronave.x + astronave.width && astronave.x < event.offsetX
       && event.offsetY < astronave.y + astronave.height && astronave.y < event.offsetY) {
         //Ho cliccato dentro l'astronave
         drag = true;
      }
     }
  }
}

document.onmousemove = function(event) {
  if(drag) {
  event.offsetX = astronave.x;
  event.layerX = astronave.x;
  astronave.x = (event.offsetX || event.layerX) - astronave.width/2;
  }
}

document.onmouseup = function(event) {
  drag = false;
}
