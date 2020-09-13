var Enemigo = function (sprite, x, y, ancho, alto, velocidad, rangoMov) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.ancho = ancho;
  this.alto = alto;
  this.velocidad = velocidad;
  this.rangoMov = rangoMov;
  this.atacando = false;
}

/* Por defecto, un enemigo sabe responder al mensaje de atacar
sacando una vida al jugador.*/
Enemigo.prototype.atacar = function (jugador) {
  jugador.perderVidas(1);
}

/* Este metodo sirve para no estar atacando continuamente al jugador. Solo va a
atacar si no estaba atacando previamente. Esto lo va a indicar la propiedad atacando*/
Enemigo.prototype.comenzarAtaque = function (jugador) {
  if (!this.atacando) {
    this.atacar(jugador);
  }
  this.atacando = true;
}
/* Cuando el enemigo no este contacto con el jugador, se utilizara el metodo
dejarDeAtacar para modificar la propiedad atacando*/
Enemigo.prototype.dejarDeAtacar = function (jugador) {
  this.atacando = false;
}
