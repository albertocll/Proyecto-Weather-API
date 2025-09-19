const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (pais === '' || ciudad === '') {
        //Hubo un error
        mostarError('Ambos campos son obligatorios');

        return;
    }
    //Consultar la API
    consultarAPI(ciudad, pais);
}

function mostarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
    //Crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'mas-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!!</strong>
            <span class ="block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        //Se elimine la alerta
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

    
}

function consultarAPI(ciudad, pais) {
    const appId = "505bd7b9dfdaf128265fc5f42d45e25a";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&units=metric&lang=es&appid=${appId}`;
    
    console.log("URL construida:", url);
    
    Spinner(); //Muestra un Spinner de carga

    setTimeout(() => {
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => {
                limpiarHTML(); //Limpiar el HTML previo

            if(datos.cod === "404") {
                mostarError('Ciudad no encontrada');
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        });
    }, 1500);
        
}


function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min}, weather } = datos;

    // Obtener emoji según el clima
    const clima = weather[0].main;
    let emoji = '🌡️';
    switch(clima.toLowerCase()) {
        case 'clear': emoji = '☀️'; break;
        case 'clouds': emoji = '☁️'; break;
        case 'rain': emoji = '🌧️'; break;
        case 'drizzle': emoji = '🌦️'; break;
        case 'thunderstorm': emoji = '⛈️'; break;
        case 'snow': emoji = '❄️'; break;
        case 'mist':
        case 'fog': emoji = '🌫️'; break;
    }

    const iconoClima = document.createElement('p');
    iconoClima.textContent = emoji;
    iconoClima.classList.add('text-6xl', 'text-center'); // tamaño grande y centrado

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name}`;
    nombreCiudad.classList.add('font-bold', 'text-6xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${temp} &#8451`;
    actual.classList.add('font-bold', 'text-5xl');

    const max = document.createElement('p');
    max.innerHTML = `Max: ${temp_max} &#8451`
    max.classList.add('text-xl');

    const min = document.createElement('p');
    min.innerHTML = `Min: ${temp_min} &#8451`
    min.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(iconoClima);   // <-- emoji arriba
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(max);
    resultadoDiv.appendChild(min);
    

    resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    } 
        
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    resultado.appendChild(divSpinner);
}