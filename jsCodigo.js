'use strict';

var numeroIntentos = 0, imagenesSeleccionadas = [], tiempoEspera = 500, areaEstado, horaInicio, horaFinal, juegoEnProgreso = false;

// Crear una variable para guardar el intervalo
var intervalo;

// Crear una variable para guardar el tiempo transcurrido en segundos
var tiempo = 0;

// Crear una función que actualice el tiempo y lo muestre en el HTML
function actualizarTiempo() {
    // Aumentar el tiempo en un segundo
    tiempo++;

    // Obtener el elemento HTML con id contador-tiempo
    var contadorTiempo = document.getElementById('contador-tiempo');

    // Mostrar el tiempo en el elemento HTML
    contadorTiempo.innerText = 'Tiempo: ' + tiempo + ' segundos';
}

// Crear una función que inicie el contador
function iniciarContador() {
    // Asignar el intervalo a la variable intervalo
    // La función actualizarTiempo se ejecutará cada 1000 milisegundos (1 segundo)
    intervalo = setInterval(actualizarTiempo, 1000);
}

// Crear una función que detenga el contador
function detenerContador() {
    // Usar el método clearInterval para detener el intervalo
    clearInterval(intervalo);
}

function ordenAleatorio() {
    return 0.5 - Math.random();
}

function iniciarElemento() {
    areaEstado = document.getElementById('area-estado');

    var cartasImagen = [
        'Moon1',
        'Moon2',
        'Moon3',
        'Moon4',
        'Moon5',
        'Moon6',
        'Moon7',
        'Moon8',
        'Moon9',
        'Moon10',
    ];

    cartasImagen = cartasImagen.concat(cartasImagen); // duplicar el arreglo de cartas

    cartasImagen.sort(ordenAleatorio);

    var fragmento = document.createDocumentFragment();

    for (var indice = 0, longitud = cartasImagen.length; indice < longitud; indice++) {
        var actual = cartasImagen[indice];
        var nuevaCartaImagen = document.createElement('img');
        nuevaCartaImagen.src = 'img/' + actual + '.png';
        nuevaCartaImagen.title = actual;
        nuevaCartaImagen.alt = actual;
        nuevaCartaImagen.addEventListener('click', verificar);
        fragmento.appendChild(nuevaCartaImagen);
    }

    document.getElementById('area-juego').appendChild(fragmento);
}

function iniciar() {
    iniciarElemento();

    setTimeout(function () {
        for (var indice = 0, longitud = document.images.length; indice < longitud; indice++) {
            var actual = document.images[indice];
            actual.src = 'img/ficha.png';
            actual.title = 'Moon';
        }
        juegoEnProgreso = true;
        horaInicio = new Date();

        // Llamar a la función iniciarContador cuando el juego empiece
        iniciarContador();

    }, tiempoEspera * 4);
}

function verificar() {
    if (!juegoEnProgreso) {
        return;
    }
    if (this.title != 'Moon' || this.title == 'open') return;

    if (imagenesSeleccionadas.length > 1) return;

    imagenesSeleccionadas.push(this);

    this.src = 'img/' + this.alt + '.png';
    this.title = 'open';

    if (imagenesSeleccionadas.length != 2) return;

    if (imagenesSeleccionadas[0].alt === imagenesSeleccionadas[1].alt) {
        imagenesSeleccionadas[0].removeEventListener('click', verificar);
        imagenesSeleccionadas[1].removeEventListener('click', verificar);
        imagenesSeleccionadas = [];
    } else {
        setTimeout(function () {
            imagenesSeleccionadas[0].src = 'img/ficha.png';
            imagenesSeleccionadas[0].title = 'Moon';
            imagenesSeleccionadas[1].src = 'img/ficha.png';
            imagenesSeleccionadas[1].title = 'Moon';
            imagenesSeleccionadas = [];
        }, tiempoEspera);

        numeroIntentos++;
        areaEstado.innerText = 'Intentos Fallidos: ' + numeroIntentos;
    }

    if (document.querySelectorAll('img[title="open"]').length === document.images.length) {
        horaFinal = new Date();
        var tiempoDiferencia = (horaFinal - horaInicio) / 1000;
        areaEstado.innerText = '¡Ganaste! Completaste el juego con ' + numeroIntentos + ' intentos en ' + tiempoDiferencia + ' segundos.';
        areaEstado.className = 'mensaje-juego';
        juegoEnProgreso = false;

        // Llamar a la función detenerContador cuando el juego termine
        detenerContador();

        var botonReiniciar = document.createElement('button');
        botonReiniciar.innerText = 'Jugar de nuevo';
        botonReiniciar.addEventListener('click', function () {
            location.reload();
        });
        areaEstado.appendChild(botonReiniciar);
    }
}

window.addEventListener('DOMContentLoaded', iniciar);
