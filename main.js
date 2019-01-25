/**
  main.js

  Davide Ferri 517176

  Script principale del gioco
*/

/* ------------ variabili globali ----------------- */
//Ottengo il contesto grafico 2D
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var animation_frame;

var background = new Image();
var astronaveImg = new Image();
var universoImg = new Image();
var missileImg = new Image();
var muro1Img = new Image();
var muro2Img = new Image();
var muro3Img = new Image();
var astronaveNemicaImg = new Image();
var missileNemicoImg = new Image();
var nemico1Img = new Image();
var nemico2Img = new Image();
var nemico3Img = new Image();
var nemico4Img = new Image();
var gameOverImg = new Image();

var gameOver = false;
var score = 0;
var livello = 0;
var stoSparando = false;
var miss;
var blinkFreq = 500;
var arrayMuro = [];
var arrayImg = [{img:1},{img:1},{img:1},{img:1}];
var enemyList = [];
var tempDirezione = false;
var colpiti = 0;



/* ------------------------------*/
//Oggetto per gestire i suoni
function musica(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  if(src === "sound/spaceinvaders1.wav") this.sound.loop = true;
  this.sound.setAttribute("autoplay","false");
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.setAttribute("muted","false");
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }
}

/* ---------------------- Suoni ----------------- */
var suonoSparo = new musica("sound/shoot.wav");
var suonoSchemataPrincipale = new musica("sound/spaceinvaders1.wav");
var suonoAstronaveNemica1 = new musica("sound/ufo_lowpitch.wav");
var suonoAstronaveNemica2 = new musica("sound/ufo_highpitch.wav");
var suonoKill = new musica("sound/invaderkilled.wav");

/* ---------------------------- */




//Funzione che disegna i vari elementi sotto l'astronave
drawOpzioni = function() {
  //Disegno una linea sotto l'astronave che conterrà le vite e lo score
  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = "	#00F100";
  ctx.moveTo(0,canvas.height - astronave.height);
  ctx.lineTo(canvas.width,canvas.height - astronave.height);
  ctx.stroke();

  ctx.restore();

  //Disegno lo score corrente
  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "#00F100";
  ctx.fillText("Score: " + score,5,ctx.height - 13);

  ctx.fillText("Level: " + livello,5,20);

  //Disegno le vite
  var vitaX = ctx.width - 40 - (34*astronave.vite); //Disegno da sinistra a destra le vite
  var vitaY = ctx.height - 40; //32 dimensione di una vita + spazio
  for(var i = 0;i < astronave.vite; i++) {
    drawObject(astronaveImg,vitaX,vitaY,32,32);
    vitaX += 34;
  }

  //Disegno il testo per la vita
  ctx.fillText("Lives: ",ctx.width - 210,ctx.height - 13);//ctx.width - vitaX(iniziale) - due immagini di vita
  ctx.restore();

}

function muro () {
  this.x = 0;
  this.y = 0;
  this.width = 52;
  this.height = 52;
  this.img = muro1Img;
}

//Funzione che disegna le mura davanti all'astronave
drawMura = function() {


  //Divido in 4 parti uguali la larghezza del canvas
  var spazio = Math.ceil(ctx.width / 4);
  var save = spazio;
  //posizione sull'asse x,y di ogni muro
  var x = spazio - 92; ///52 dimensione muro + 40
  var y = ctx.height - 150;

  //vedo quanti muri disegnare e con quali immagini
  var numMuri = 0;


  for(var i=0;i<4;i++) {
   arrayMuro[i] = new muro();
   arrayMuro[i].x = x;
   arrayMuro[i].y = y;
   //Seleziono l'immagine da disegnare
   if(arrayImg[i].img === 1) arrayMuro[i].img = muro1Img;
   if(arrayImg[i].img === 2) arrayMuro[i].img = muro2Img;
   if(arrayImg[i].img === 3) arrayMuro[i].img = muro3Img;


   //Disegno solo se non è stato distrutto
   if(arrayImg[i].img !== 0) {
   drawObject(arrayMuro[i].img,arrayMuro[i].x,arrayMuro[i].y,arrayMuro[i].width,arrayMuro[i].height);
   }
   spazio += save;
   x = spazio - arrayMuro[i].width - 40;
  }
}


//Funzione che disegna i nemici
var indietro = false;

drawEnemy = function(e,i) {
  if(e.img === 1) ctx.drawImage(nemico1Img,e.x,e.y,alieni.width,alieni.height);
  if(e.img === 2) ctx.drawImage(nemico2Img,e.x,e.y,alieni.width,alieni.height);
  if(e.img === 3) ctx.drawImage(nemico3Img,e.x,e.y,alieni.width,alieni.height);
  if(e.img === 4) ctx.drawImage(nemico4Img,e.x,e.y,alieni.width,alieni.height);

  if(tempDirezione !== indietro || gameOver === true) return;
  //Limiti del canvas
  if(e.x > canvas.width - alieni.width) {
    indietro = true;
    return;
  }
  if(e.x < 0 ) {
    indietro = false;
    return;
  }

  //collisione con uno dei muri
  if(arrayMuro !== undefined && arrayMuro !== null) {

    for(var i = 0;i<arrayMuro.length;i++) {
      if(arrayImg[i].img !== 0) {

      if(e.x < arrayMuro[i].x + arrayMuro[i].width &&
        arrayMuro[i].x < e.x + alieni.width &&
        arrayMuro[i].y < e.y + alieni.height &&
        e.y < arrayMuro[i].y + arrayMuro[i].height) {
          //Il giocatore ha perso
         gameOver = true;
       }
      }
    }
  }

  if(e.x < astronave.x + astronave.width &&
    astronave.x < e.x + alieni.width &&
    astronave.y < e.y + alieni.height &&
    e.y < astronave.y + astronave.height) {
      //Il giocatore ha perso, i mostri sono arrivati da lui
     gameOver = true;
   }

}

//Aggiorna la posizione dei mostri
updatePositionAlien = function(e) {

  if(!indietro) e.x += speedNemici;
  if(indietro) e.x -= speedNemici;
  e.y +=6;
}


//Funzione che fa avanzare il giocatore di livello
levelUP = function() {

  livello ++;
  stoSparando = false;
  miss = null;
  if(speedNemici < 5) speedNemici += 0.2;
  colpiti = 0;
  probabilitàSparo *= 2;

  //Genero due proprietà per il contesto grafico
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  astronave.pressLeft = false;
  astronave.pressRight = false;
  if(astronave.vite !== 3) astronave.vite++;
  astronave.sparo = false;
/*
  //Aggiorno la posizione dell'astronave
  astronave.y = ctx.height - 100;
  astronave.x = ctx.width / 2 - (astronave.width / 2);*/

  missileAstronaveNemica.reset();
  astronaveNemica.reset();

  //nemici
  numOfEnemies = 0;
  var enemyX = 5;
  var enemyY = 20 + astronaveNemica.height; //Altrimenti andrei a toccare l'astronave nemica
  enemyList = []; //5+40 = 45
  for (var i=1;i<=5;i++) {
    enemyX = 5;
    for(var j=1;j<=8;j++) {
      //x,y posizione mostro, img = immagine mostro 1-2-3-4
      if(i<=4) {
        enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:i};
      } else {
        enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:4};
      }      numOfEnemies++;
      enemyX += 45;
    }
    enemyY += 25;
  }

  update();

}

//Funzione per l'aggiornamento degli elemento grafici
var background_y = 0;
update = function() {

  if(astronave.vite === 0) {
    drawGameOver();
  } else {

  //Aggiorno posizione astronave
  astronave.updatePosizione();

  //Aggiorno la posizione dell'astronave nemica
  astronaveNemica.update();

  //Ripulisco la schermata
  ctx.clearRect(0,0,ctx.width,ctx.height);

  //Disegno lo sfondo del gioco
  drawObject(universoImg,0,background_y,ctx.width,ctx.height);
  drawObject(universoImg,0,background_y - 500,ctx.width,ctx.height);
  //Disegno due volte per simulare il movimento
  background_y++;
  if(background_y > 500) background_y = 0;

  //Disegno i vari elementi sotto l'astronave
  drawOpzioni();


  //Disegno le mura davanti all'astronave
  drawMura();

  //Disegno l'astronave nemica
  astronaveNemica.draw();

  //Disegno l'astronave
  astronave.drawAstronave();

  tempDirezione = indietro;

  //Disegno tutti i nemici
  enemyList.forEach(drawEnemy);
  if(gameOver) {
    //Il giocatore ha perso
    astronave.vite = 0;
    update();
  }

 //Controllo se è cambiata la direzione
 if(tempDirezione !== indietro) {
    //Aggiorno la posizione dei nemici
    enemyList.forEach(updatePositionAlien);
  } else {
    for(i in enemyList) {
     if(!indietro) enemyList[i].x += speedNemici;
     if(indietro) enemyList[i].x -= speedNemici;
      }
  }
    //Vado a lanciare il missile
    if(astronave.sparo) { miss = new missile(); astronave.sparo = false;       stoSparando = true; }
    if(miss !== undefined && miss != null) {
      if(stoSparando) {
      miss.drawMissile();

      var shotOk = false; //Mi dice se ho colpito qualcosa
      //Vedo se il missile ha colpito un muro
      shotOk = miss.testCollisioneMissileMuro()
      if(shotOk) {
        astronave.sparo = false;
        stoSparando = false;
      }

      if(!shotOk) {
      //Vedo se ha colpito un eventuale mostro
      for(i in enemyList) {
      if(miss.testCollisioneMissileAlieno(enemyList[i])){
        //Colpito aggiorno il punteggio
        if(enemyList[i].img === 1) score += 40;
        if(enemyList[i].img === 2) score += 30;
        if(enemyList[i].img === 3) score += 20;
        if(enemyList[i].img === 4) score += 10;

        suonoKill.stop();
        suonoKill.play();
        delete enemyList[i];
        colpiti++;
        stoSparando = false;
        astronave.sparo = false;
        astronave.prima = 0;
        shotOk = true;
        break;
      }
      if(!stoSparando) break;
      }

    }
  }

    //Vedo se ho colpito l'astronave astronave nemica
    if(!shotOk) {  shotOk = miss.testCollisioneMissileAstronaveNemica();
    if(shotOk) { astronaveNemica.colpita = 1; miss = null;  astronave.sparo = false; stoSparando = false;}
    }
  }

}

  if(colpiti === 40 && astronaveNemica.colpita === 1) {
    console.log("livello successivo");
    levelUP();
  }
}


//Funzione utilizzata per disegnare la schermata di avvio
drawSchermata = function() {


  ctx.save();
  //Ripulisco la schermata
  ctx.clearRect(0,0,ctx.width,ctx.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,ctx.width,ctx.height);

  //Disegno lo sfondo del gioco
  drawObject(background,0,0,ctx.width,ctx.height);

  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  var play = new String("PLAY GAME");
  var mis = ctx.measureText(play)
  blinkFreq = 500;

  //Per far brillare il testo
  if (~~(0.5 + Date.now() / blinkFreq) % 2) {
    ctx.fillText(play,ctx.width/ 2 - (mis.width/2) ,ctx.height / 2);
  }

  ctx.restore();

}


//Funzione di avvio del gioco
startGame = function() {

if(livello > 0) {
  //Aggiorno i vari elementi grafici
  update();


} else {

  //Schermata principale
  drawSchermata();
 }
 //Richiedo di richiamare ricorsivamente questa funzione
   animation_frame = window.requestAnimFrame( function() {
     startGame();
   });
}
//Funzione per il disegno della schermata di game over

drawGameOver = function() {

  //Disegno lo schermata di game over
  ctx.save();

  //Ripulisco la schermata
  ctx.clearRect(0,0,ctx.width,ctx.height);

  //Disegno lo sfondo del gioco
  drawObject(gameOverImg,0,0,ctx.width,ctx.height);


  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  var over = new String("CLICK TO RESTART");
  var perc = ctx.measureText(over);
  var mis = ctx.measureText(over)

  //Per far brillare il testo
  if (~~(0.5 + Date.now() / blinkFreq) % 2) {
    ctx.fillText(over,ctx.width/ 2 - (mis.width/2) ,ctx.height / 2);
  }

  gameOver = true;
  ctx.restore();
}

//Funzione per il riavvio del gioco
reset = function() {
  score = 0;
  livello = 0;
  stoSparando = false;
  speedNemici = 0.7;
  arrayMuro = [];
  miss = null;
  colpiti = 0;
  arrayImg = [{img:1},{img:1},{img:1},{img:1}];
  probabilitàSparo = 5;

  //Genero due proprietà per il contesto grafico
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  //Reset dell'astronave
  astronave.pressLeft = false;
  astronave.pressRight = false;
  if(astronave.vite !== 3) astronave.vite++;
  astronave.sparo = false;
  //Aggiorno la posizione dell'astronave
  astronave.y = ctx.height - 100;
  astronave.x = ctx.width / 2 - (astronave.width / 2);

  missileAstronaveNemica.reset();
  astronaveNemica.reset();

  //nemici
  numOfEnemies = 0;
  var enemyX = 5;
  var enemyY = 20 + astronaveNemica.height; //Altrimenti andrei a toccare l'astronave nemica
  enemyList = []; //5+40 = 45
  for (var i=1;i<=5;i++) {
    enemyX = 5;
    for(var j=1;j<=8;j++) {
      //x,y posizione mostro, img = immagine mostro 1-2-3-4
      if(i<=4) {
        enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:i};
      } else {
        enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:4};
      }      numOfEnemies++;
      enemyX += 45;
    }
    enemyY += 25;
  }

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  cancelAnimationFrame(animation_frame);
  startGame();
}


//Funzione che inizializza il gioco
init = function() {

//Genero due proprietà per il contesto grafico
ctx.width = canvas.width;
ctx.height = canvas.height;

//Aggiorno la posizione dell'astronave
astronave.y = ctx.height - 100;
astronave.x = ctx.width / 2 - (astronave.width / 2);

probabilitàSparo = 5;

//nemici
numOfEnemies = 0;
var enemyX = 5;
var enemyY = 20 + astronaveNemica.height; //Altrimenti andrei a toccare l'astronave nemica
enemyList = []; //5+40 = 45
for (var i=1;i<=5;i++) {
  enemyX = 5;
  for(var j=1;j<=8;j++) {
    //x,y posizione mostro, img = immagine mostro 1-2-3-4
    if(i<=4) {
      enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:i};
    } else {
      enemyList[numOfEnemies] = {x:enemyX,y:enemyY,img:4};
    }
    numOfEnemies++;
    enemyX += 45;
  }
  enemyY += 25;
}

colpiti = 0;

//Carico le immagini
background.src = "immagini/sfondo.png";
background.onload = function() {

  universoImg.src = "immagini/sfondo1.jpg";
  universoImg.onload = function() {
  gameOverImg.src = "immagini/gameOver.jpg";
  gameOverImg.onload = function() {
   missileImg.src = "immagini/missile.png";
   missileImg.onload = function() {
     muro1Img.src = "immagini/muro1.png";
     muro1Img.onload = function() {
      muro2Img.src = "immagini/muro2.png";
      muro2Img.onload = function() {
        muro3Img.src = "immagini/muro3.png";
        muro3Img.onload = function() {
         missileNemicoImg.src = "immagini/missile_nemico.png";
         missileNemicoImg.onload = function() {
          astronaveNemicaImg.src = "immagini/astronavenemica.png";
          astronaveNemicaImg.onload = function() {

           astronaveImg.src = "immagini/astronave.png";
           astronaveImg.onload = function() {
             nemico1Img.src = "immagini/nemico1.png";
             nemico1Img.onload = function() {
               nemico2Img.src = "immagini/nemico2.png";
               nemico2Img.onload = function() {
                 nemico3Img.src = "immagini/nemico3.png";
                 nemico3Img.onload = function() {
                   nemico4Img.src = "immagini/nemico4.png";
                   nemico4Img.onload = function() {

                  //Definisco una funzione che mi permette di disegnare le immagini
                  drawObject = function(object,x,y,width,height) {
                  ctx.drawImage(object,x,y,width,height);
                  }

                  startGame();
                }
              }
              }
             }
           }
          }
        }
       }
       }
      }
     }
    }
   }
  }
 }
