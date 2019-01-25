/**
  personaggio.js
  Davide Ferri 517176

  File che descrive il personaggio principale
*/
var astronave = {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  pressLeft: false,
  pressRight: false,
  vite:3,
  sparo: false,

  reset: function() {
    astronave.x = 0;
    astronave.y = 0;
    astronave.pressLeft = false;
    astronave.pressRight = false;
    astronave.vite = 3;
    astronave.sparo = false;
  },

  drawAstronave : function() {

      ctx.save();

      //Disegno l'astronave a schermo
      drawObject(astronaveImg,astronave.x,astronave.y,astronave.width,astronave.height);


      ctx.restore();
  },

  updatePosizione: function() {

    //Mi sposto a destra o sinistra in base ai tasti premuti dall'utente
    if(!drag) {
    if(astronave.pressLeft) {
        astronave.x -= 5;
    } else {
      if(astronave.pressRight) {
        astronave.x += 5;
      }
    }
  }
   //Controlli per evitare che l'astronave esca dal canvas
   if(astronave.x < 0) {
     astronave.x = 0;
   }
   if(astronave.x > canvas.width - astronave.width) {
     astronave.x = canvas.width - astronave.width;
   }
 },


};

//Oggetto che rappresenta il missile dell'astronave
function missile() {
  this.x = 0;
  this.y = 0;
  this.testy = 0;
  this.width = 32;
  this.height = 32;
  this.speed = 20;
  this.prima = 0;




  this.drawMissile = function() {

    if(!this.prima) {
      this.prima = 1;
      this.x = astronave.x + 12;
    }

    //Disegno il missile a schermo
    drawObject(missileImg,this.x,astronave.y - 7 + this.y,this.width,this.height);
    this.testy = astronave.y - 7 + this.y;

    //Se ho raggiunto il limite del canvas smetto di disegnare il missile
    if(astronave.y - 7 + this.y < 0) { astronave.sparo = false; stoSparando = false; this.prima = 0; }
    this.y -= this.speed; //Cambio la posizione del missile
  }

  //Metodo che verifica la collisione tra un missile ed un muro
  this.testCollisioneMissileMuro = function() {

    //Verifico se l'array è definito
    if(arrayMuro !== undefined && arrayMuro !== null) {

      for(var i = 0;i<arrayMuro.length;i++) {
        if(arrayImg[i].img !== 0) {

        if(this.x < arrayMuro[i].x + arrayMuro[i].width &&
          arrayMuro[i].x < this.x + this.width &&
          arrayMuro[i].y < this.testy + this.height &&
          this.testy < arrayMuro[i].y + arrayMuro[i].height) {
           //Il missile ha colpito il muro
           stoSparando = false;
           astronave.sparo = false;

           return true;
         }
        }
      }
    }
    return false;

  }

  //Metodo che verifica la collisione con l'astronave nemica
  this.testCollisioneMissileAstronaveNemica = function() {
    if(astronaveNemica.colpita === 0) {
      if(this.x < astronaveNemica.x + astronaveNemica.width &&
      this.testy < astronaveNemica.y + astronaveNemica.height &&
      astronaveNemica.x < this.x + this.width &&
      astronaveNemica.y < this.testy + this.height) {
        astronaveNemica.colpita = 1;
        console.log("Colpitaaaaaaaaaaaaaaaaaaaaaaa");
        score += 50;
        suonoKill.stop();
        suonoKill.play();
        return true;
      }
    }
    return false;
  }

  //Metodo che verifica la collissione con un mostro
  this.testCollisioneMissileAlieno = function(e) {
    if((e.x < this.x + this.width) &&
                (this.x < e.x + alieni.width) &&
                (e.y < this.testy + this.height) &&
                (this.testy < e.y + alieni.height)) {
                  //Mostro colpito!
                  return true;
                } else {
                  return false;
                }

  }

};
