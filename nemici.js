/**
  nemici.js
  Davide Ferri 517176

  File che descrive i vari nemici
*/
var speedNemici = 0.7; //min 0.7 max 5
var probabilitàSparo = 5;

var astronaveNemica = {
  x: 0,
  y: 0,
  colpita: 0,
  width: 54,
  height: 40,
  suono: 0,
  stoSparando: false,
  fine: false,

  reset: function() {
    astronaveNemica.x = 0;
    astronaveNemica.y = 0;
    astronaveNemica.colpita = 0;
    astronaveNemica.stoSparando = false;
    astronaveNemica.fine = false;
  },

  //Metodo per disegnare l'astronave nemica
  draw: function() {

    ctx.save();
    if(!astronaveNemica.colpita) {

      //Sta per apparire l'astronave
      if(speedNemici < 3 && astronaveNemica.suono === 0) {
        suonoAstronaveNemica1.play();
        astronaveNemica.suono = 1;
      } else {
        if(astronaveNemica.suono === 0) {
          //L'astronva nemica è più veloce cambio suono
         suonoAstronaveNemica2.play();
         astronaveNemica.suono = 1;
       }
      }


    drawObject(astronaveNemicaImg,astronaveNemica.x,astronaveNemica.y,astronaveNemica.width,astronaveNemica.height);

    //Sparo casualmente
    var casuale = Math.random() * (1000 - 1) + 1;
    if((casuale < probabilitàSparo  && astronaveNemica.x > 0 && astronaveNemica.x < ctx.width && astronaveNemica.y > 0) || astronaveNemica.stoSparando) {
    //Disegno il missile
     if(!astronaveNemica.stoSparando) {
       missileAstronaveNemica.drawMissile();
       astronaveNemica.stoSparando = true;

     } else {
      //Finchè non sono ancora in fondo disegno il missile
      missileAstronaveNemica.drawMissile();

    }
  }
} else {
  if(astronaveNemica.stoSparando && missileAstronaveNemica.x !== 0) {
    //Disegno fino alla fine il missile annche se l'astronave è stata colpita
    missileAstronaveNemica.drawMissile();
  }
}
    ctx.restore();

  },

  //Metodo che aggiorna la posizione dell'astronave nemica
  update: function() {

    if(!astronaveNemica.colpita) {
    astronaveNemica.y = 25;
    astronaveNemica.x += speedNemici;

    if(astronaveNemica.x > ctx.width + 20) {
      //Se sono arrivato al limite del canvas ricomincio
       astronaveNemica.x = -25;
       astronaveNemica.suono = 0;
     }
  }
}
};

var missileAstronaveNemica =  {
  x : 0,
  y : 0,
  testy : 0,
  width : 32,
  height : 32,
  speed : 5,
  prima: 1,

  reset: function() {
    missileAstronaveNemica.x = 0;
    missileAstronaveNemica.y = 0;
    missileAstronaveNemica.testy = 0;
    missileAstronaveNemica.prima = 1;
  },

  drawMissile : function() {
    //Disegno il missile a schermo
    if(missileAstronaveNemica.prima === 1) {
      //Se deve essere creto sparo dalla posizione dell'astronave
      missileAstronaveNemica.x = astronaveNemica.x + 12;
      missileAstronaveNemica.testy = astronaveNemica.y + 7;
      missileAstronaveNemica.prima = 0;
    }

    drawObject(missileNemicoImg,missileAstronaveNemica.x,missileAstronaveNemica.testy,missileAstronaveNemica.width,missileAstronaveNemica.height);
    missileAstronaveNemica.testy += 7;

    //Se ho raggiunto il limite del canvas smetto di disegnare il missile
    if(missileAstronaveNemica.testy > ctx.height) {
       astronaveNemica.stoSparando = false;
       missileAstronaveNemica.y = 0;
       missileAstronaveNemica.testy = 0;
       missileAstronaveNemica.prima = 1;
     } else {
    missileAstronaveNemica.testCollisioneMissileMuro();
    missileAstronaveNemica.testCollisioneMissilePlayer();
    missileAstronaveNemica.y += missileAstronaveNemica.speed; //Cambio la posizione del missile
   }
 },

  //Metodo che verifica la collisione tra un missile ed un muro
  testCollisioneMissileMuro : function() {

    //Verifico se l'array è definito
    if(arrayMuro !== undefined && arrayMuro !== null) {

      for(var i = 0;i<arrayMuro.length;i++) {
        if(arrayImg[i].img !== 0) {
        if(missileAstronaveNemica.x < arrayMuro[i].x + arrayMuro[i].width &&
          arrayMuro[i].x < missileAstronaveNemica.x + missileAstronaveNemica.width &&
          arrayMuro[i].y < missileAstronaveNemica.testy + missileAstronaveNemica.height &&
          missileAstronaveNemica.testy < arrayMuro[i].y + arrayMuro[i].height) {
           //Il missile ha colpito il muro
           astronaveNemica.stoSparando = false;
           missileAstronaveNemica.y = 0;
           missileAstronaveNemica.testy = 0;
           missileAstronaveNemica.prima = 1;
           if(arrayImg[i].img !== 0) arrayImg[i].img++;
           if(arrayImg[i].img === 4) arrayImg[i].img = 0;

           return true;
         }
        }
      }
    }
    return false;

  },

  testCollisioneMissilePlayer : function() {

      if(missileAstronaveNemica.x < astronave.x + astronave.width &&
      missileAstronaveNemica.testy < astronave.y + astronave.height &&
      astronave.x < missileAstronaveNemica.x + missileAstronaveNemica.width &&
      astronave.y < missileAstronaveNemica.testy + missileAstronaveNemica.height) {
        astronave.vite--;
        astronaveNemica.stoSparando = false;
        missileAstronaveNemica.y = 0;
        missileAstronaveNemica.testy = 0;
        missileAstronaveNemica.prima = 1;
        if(astronave.vite === 0) suonoKill.play();
      }
    }

}

var alieni = {
  width : 32,
  height : 32,
  img: 1,
};
