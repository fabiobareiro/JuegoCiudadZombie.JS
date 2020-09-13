var ZombieConductor = function(sprite, x, y, ancho, alto, velocidad, rangoMov, esHorizontal) {

  /* Constructor a partir de Enemigo */

  Enemigo.call(this, sprite, x, y, ancho, alto, velocidad, rangoMov);

  /* Propiedad/es unicas de ZombieConductor necesarias */

  this.esHorizontal = esHorizontal;
}

/* Creacion del ZombieConductor */

ZombieConductor.prototype = Object.create(Enemigo.prototype);
ZombieConductor.prototype.constructor = ZombieConductor;

/* Metodos para el movimiento y el ataque */

ZombieConductor.prototype.mover = function() {

  /* Los movimientos estan basados en un numero aleatorio
  La direccion horizontal es siempre la misma y va ondulando verticalmente.
  Esto hasta llegar a sus limites, donde se invierte su direccion horizontal */

  if (this.esHorizontal === true) {

    this.x -= this.velocidad;

  } else {

    //Sino, hace otro movimiento

    this.y += this.velocidad;

  }

  /* En esta parte lo que hacemos es invertir la direccion horizontal si
  toca uno de sus limites, modificando su velocidad. Si multiplicamos por -1 la
  velocidad lo que estamos haciendo es invertir su direccion.*/

  if ((this.x < this.rangoMov.desdeX) || (this.x > this.rangoMov.hastaX)){

    this.velocidad *= -1;

  }
  // Si sobrepasa el rangoY, lo manda al centro entre ambos rangos

  if ((this.y < this.rangoMov.desdeY) || (this.y > this.rangoMov.hastaY)) {

    this.velocidad *= -1;

  }
}

ZombieConductor.prototype.atacar = function() {

  Juego.jugador.perderVidas(5);
  
}
