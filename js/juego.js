/* El objeto Juego sera el encargado del control de todo el resto de los Objetos
existentes.
Le dara ordenes al Dibujante para que dibuje entidades en la pantalla. Cargara
el mapa, chequeara colisiones entre los objetos y actualizara sus movimientos
y ataques.*/

var Juego = {
  // configura el tamanio del canvas del juego
  anchoCanvas: 961,
  altoCanvas: 577,
  jugador: Jugador,
  vidasInicial: Jugador.vidas,
  // Indica si el jugador gano
  ganador: false,

  obstaculosCarretera: [
    /*Aca se agregan los obstaculos visibles. */

 

    new Obstaculo('imagenes/valla_horizontal.png', 70, 430, 30, 30, 1),
    new Obstaculo('imagenes/bache.png', 100, 430, 30, 30, 1),
    new Obstaculo('imagenes/bache.png', 760, 430, 30, 30, 1),
    new Obstaculo('imagenes/auto_verde_abajo.png', 560, 470, 15, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 280, 400, 30, 30, 1),
    new Obstaculo('imagenes/valla_vertical.png', 450, 100, 30, 30, 1),
    new Obstaculo('imagenes/auto_verde_derecha.png', 600, 90, 30, 15, 1),
    new Obstaculo('imagenes/auto_verde_abajo.png', 830, 440, 15, 30, 1)

  ],
  /* Estos son los bordes con los que se puede chocar. */
  bordes: [
    // // Bordes
    new Obstaculo('', 0, 5, 961, 18, 0),
    new Obstaculo('', 0, 559, 961, 18, 0),
    new Obstaculo('', 0, 5, 18, 572, 0),
    new Obstaculo('', 943, 5, 18, 572, 0),
    // Veredas
    new Obstaculo('', 18, 23, 51, 536, 2),
    new Obstaculo('', 69, 507, 690, 52, 2),
    new Obstaculo('', 587, 147, 173, 360, 2),
    new Obstaculo('', 346, 147, 241, 52, 2),
    new Obstaculo('', 196, 267, 263, 112, 2),
    new Obstaculo('', 196, 23, 83, 244, 2),
    new Obstaculo('', 279, 23, 664, 56, 2),
    new Obstaculo('', 887, 79, 56, 480, 2)
  ],
  // Los enemigos se agregaran en este arreglo:

  enemigos: [

    // Se instancian a los zombies caminantes y conductores:

    new ZombieCaminante('imagenes/zombie1.png', 250, 320, 10, 10, 2, {desdeX:20, hastaX:941, desdeY:20, hastaY:557}),
    new ZombieCaminante('imagenes/zombie2.png', 150, 350, 10, 10, 2, {desdeX:20, hastaX:941, desdeY:20, hastaY:557}),
    new ZombieCaminante('imagenes/zombie3.png', 457, 340, 10, 10, 2, {desdeX:20, hastaX:941, desdeY:20, hastaY:557}),
    new ZombieCaminante('imagenes/zombie4.png', 100, 330, 10, 10, 2, {desdeX:20, hastaX:941, desdeY:20, hastaY:557}),
    new ZombieCaminante('imagenes/zombie1.png', 200, 310, 10, 10, 2, {desdeX:20, hastaX:941, desdeY:20, hastaY:557}),

    new ZombieConductor('imagenes/tren_vertical.png', 644, 0, 30, 90, 7, {desdeX:0, hastaX:850, desdeY:0, hastaY:470}, false),
    new ZombieConductor('imagenes/tren_vertical.png', 678, 0, 30, 90, 7, {desdeX:0, hastaX:850, desdeY:0, hastaY:470}, false),
    new ZombieConductor('imagenes/tren_horizontal.png', 400, 322, 90, 30, 7, {desdeX:20, hastaX:850, desdeY:0, hastaY:322}, true)

  ]

}

/* Se cargan los recursos de las imagene */
Juego.iniciarRecursos = function() {
  Resources.load([
    'imagenes/mapa.png',
    'imagenes/mensaje_gameover.png',
    'imagenes/Splash.png',
    'imagenes/bache.png',
    'imagenes/tren_horizontal.png',
    'imagenes/tren_vertical.png',
    'imagenes/valla_horizontal.png',
    'imagenes/valla_vertical.png',
    'imagenes/zombie1.png',
    'imagenes/zombie2.png',
    'imagenes/zombie3.png',
    'imagenes/zombie4.png',
    'imagenes/auto_rojo_abajo.png',
    'imagenes/auto_rojo_arriba.png',
    'imagenes/auto_rojo_derecha.png',
    'imagenes/auto_rojo_izquierda.png',
    'imagenes/auto_verde_abajo.png',
    'imagenes/auto_verde_derecha.png'
  ]);
  Resources.onReady(this.comenzar.bind(Juego));
};

// Agrega los bordes de las veredas a los obstaculos de la carretera
Juego.obstaculos = function() {
  return this.obstaculosCarretera.concat(this.bordes);
};

Juego.comenzar = function() {
  // Inicializar el canvas del juego
  Dibujante.inicializarCanvas(this.anchoCanvas, this.altoCanvas);
  /* El bucle principal del juego se llamara continuamente para actualizar
  los movimientos y el pintado de la pantalla. Sera el encargado de calcular los
  ataques, colisiones, etc*/
  this.buclePrincipal();
};

Juego.buclePrincipal = function() {

  // Con update se actualiza la logica del juego, tanto ataques como movimientos
  this.update();
  // Funcion que dibuja por cada fotograma a los objetos en pantalla.
  this.dibujar();
  // Esto es una forma de llamar a la funcion Juego.buclePrincipal() repetidas veces
  window.requestAnimationFrame(this.buclePrincipal.bind(this));
};

Juego.update = function() {
  this.calcularAtaques();
  this.moverEnemigos();
}

// Captura las teclas y si coincide con alguna de las flechas tiene que
  // hacer que el jugador principal se mueva
Juego.capturarMovimiento = function(tecla) {
  var movX = 0;
  var movY = 0;
  var velocidad = Jugador.velocidad;

  // El movimiento esta determinado por la velocidad del jugador
  
  if (tecla == 'izq') {
    movX = -velocidad;
    Jugador.sprite = 'imagenes/auto_rojo_izquierda.png'
    Jugador.ancho = 30;
    Jugador.alto = 15;
  }
  if (tecla == 'arriba') {
    movY = -velocidad;
    Jugador.sprite = 'imagenes/auto_rojo_arriba.png'
    Jugador.ancho = 15;
    Jugador.alto = 30;
  }
  if (tecla == 'der') {
    movX = velocidad;
    Jugador.sprite = 'imagenes/auto_rojo_derecha.png'
    Jugador.ancho = 30;
    Jugador.alto = 15;
  }
  if (tecla == 'abajo') {
    movY = velocidad;
    Jugador.sprite = 'imagenes/auto_rojo_abajo.png'
    Jugador.ancho = 15;
    Jugador.alto = 30;
  }
  
    // Si se puede mover hacia esa posicion hay que hacer efectivo este movimiento
    if (this.chequearColisiones(movX + Jugador.x, movY + Jugador.y)) {
      /* Aca tiene que estar la logica para mover al jugador invocando alguno
      de sus metodos  */
    
      Jugador.mover(movX, movY);
  
    }
  }


Juego.dibujar = function() {
  // Borrar el fotograma actual
  Dibujante.borrarAreaDeJuego();
  //Se pinta la imagen de fondo segun el estado del juego
  this.dibujarFondo();

  if(this.terminoJuego() || this.ganoJuego()) { return };

  this.dibujarLlegada();


  /* 
  "Dibujante dibuja al jugador" */

  Dibujante.dibujarEntidad(this.jugador);

  // Se recorren los obstaculos de la carretera pintandolos

  this.obstaculosCarretera.forEach(function(obstaculo) {
    Dibujante.dibujarEntidad(obstaculo);
  });


  // Se recorren los enemigos pintandolos

  this.enemigos.forEach(function(enemigo) {

    Dibujante.dibujarEntidad(enemigo);
    
  });

  // El dibujante dibuja las vidas del jugador
  var tamanio = this.anchoCanvas / this.vidasInicial;
  Dibujante.dibujarRectangulo('white', 0, 0, this.anchoCanvas, 8);
  for (var i = 0; i < this.jugador.vidas; i++) {
    var x = tamanio * i
    Dibujante.dibujarRectangulo('red', x, 0, tamanio, 8);
  }
};

Juego.dibujarLlegada = function() {
  Dibujante.dibujarRectangulo('yellow', 760, 530, 127, 30);
};



/* Recorre los enemigos haciendo que se muevan. */

Juego.moverEnemigos = function() {

  this.enemigos.forEach(function(enemigo) { enemigo.mover(enemigo) });

};

  /* Recorre los enemigos para ver cual esta colisionando con el jugador
  Si colisiona empieza el ataque el zombie, si no, deja de atacar. */

Juego.calcularAtaques = function() {
  this.enemigos.forEach(function(enemigo) {
    if (this.intersecan(enemigo, this.jugador, this.jugador.x, this.jugador.y)) {
      /* Si el enemigo colisiona debe empezar su ataque
      */
      enemigo.comenzarAtaque(this.jugador);
    } else {
      /* Sino, debe dejar de atacar
      */
      enemigo.dejarDeAtacar(this.jugador);

    }
  }, this);
};


/* Aca se chequea si el jugador se puede mover a la posicion destino.
 Es decir, que no haya obstaculos que se interpongan. De ser asi, no podra moverse */
 var jugadorSiendoAtacado = false;
Juego.chequearColisiones = function(x, y) {
  var puedeMoverse = true

  this.obstaculos().forEach(function(obstaculo) {
    if (this.intersecan(obstaculo, this.jugador, x, y)){

      obstaculo.chocar(obstaculo.potencia);
      puedeMoverse = false;
    }
}, this)
  return puedeMoverse;
};

/* Este metodo chequea si los elementos 1 y 2 si cruzan en x e y
 x e y representan la coordenada a la cual se quiere mover el elemento2*/
Juego.intersecan = function(elemento1, elemento2, x, y) {
  var izquierda1 = elemento1.x
  var derecha1 = izquierda1 + elemento1.ancho
  var techo1 = elemento1.y
  var piso1 = techo1 + elemento1.alto
  var izquierda2 = x
  var derecha2 = izquierda2 + elemento2.ancho
  var techo2 = y
  var piso2 = y + elemento2.alto

  return ((piso1 >= techo2) && (techo1 <= piso2) &&
    (derecha1 >= izquierda2) && (izquierda1 <= derecha2))
};

Juego.dibujarFondo = function() {
  // Si se termino el juego hay que mostrar el mensaje de game over de fondo
  if (this.terminoJuego()) {
    Dibujante.dibujarImagen('imagenes/mensaje_gameover.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    document.getElementById('reiniciar').style.visibility = 'visible';
  }

  // Si se gano el juego hay que mostrar el mensaje de ganoJuego de fondo
  else if (this.ganoJuego()) {
    Dibujante.dibujarImagen('imagenes/Splash.png', 190, 113, 500, 203);
    document.getElementById('reiniciar').style.visibility = 'visible';
  } else {
    Dibujante.dibujarImagen('imagenes/mapa.png', 0, 5, this.anchoCanvas, this.altoCanvas);
  }
};

Juego.terminoJuego = function() {
  return this.jugador.vidas <= 0;
};

/* Se gana el juego si se sobre pasa cierto altura "y" */
Juego.ganoJuego = function() {
  return (this.jugador.y + this.jugador.alto) > 530;
};

Juego.iniciarRecursos();

// Activa las lecturas del teclado al presionar teclas

document.addEventListener('keydown', function(e) {
  var allowedKeys = {
    37: 'izq',
    38: 'arriba',
    39: 'der',
    40: 'abajo'
  };

  Juego.capturarMovimiento(allowedKeys[e.keyCode]);
});
