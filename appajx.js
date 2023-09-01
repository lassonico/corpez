document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('#transactionForm');
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      enviarFormulario();
    });
  });
  
  function enviarFormulario() {
    const monto = parseInt(document.getElementById('monto').value);
    const tipoDoc = document.getElementById('tipoDoc').value;
    const documento = document.getElementById('documento').value;
    const nombre = document.getElementById('nombre').value;
  
    // Datos de autenticación
    const usuario = 'LUIS1234';
    const contrasena = 'BDtn72@5';
  
    // URL del primer servicio
    const primerServicioURL = 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/get_tokens_convenio_empresa';
  
    // Datos para el cuerpo de la primera solicitud
    const datosPrimeraSolicitud = {
      username: usuario,
      password: contrasena
    };
  
    // Convertir los datos del cuerpo a formato JSON
    const datosPrimeraSolicitudJSON = JSON.stringify(datosPrimeraSolicitud);
  
    // Crear una nueva instancia de XMLHttpRequest para la primera solicitud
    const xhrPrimeraSolicitud = new XMLHttpRequest();
  
    // Configurar la primera solicitud POST
    xhrPrimeraSolicitud.open('POST', primerServicioURL, true);
  
    // Configurar el encabezado de la primera solicitud
    xhrPrimeraSolicitud.setRequestHeader('Content-Type', 'application/json');
  
    // Manejar la respuesta cuando se complete la primera solicitud
    xhrPrimeraSolicitud.onreadystatechange = function () {
      if (xhrPrimeraSolicitud.readyState === 4) {
        if (xhrPrimeraSolicitud.status === 200) {
          // La primera solicitud se completó con éxito
          const response = JSON.parse(xhrPrimeraSolicitud.responseText);
          const idToken = response.data.IdToken;
  
          // Ahora que tenemos el idToken, realizamos la segunda solicitud
          realizarSegundaSolicitud(idToken, monto, tipoDoc, documento, nombre);
        } else {
          // Manejar errores de la primera solicitud
          console.error('Error en la primera solicitud:', xhrPrimeraSolicitud.status, xhrPrimeraSolicitud.statusText);
        }
      }
    };
  
    // Enviar la primera solicitud con los datos de autenticación
    xhrPrimeraSolicitud.send(datosPrimeraSolicitudJSON);
  }
  
  // Función para realizar la segunda solicitud con el idToken y datos del formulario
  function realizarSegundaSolicitud(idToken, monto, tipoDoc, documento, nombre) {
    // URL del segundo servicio
    const segundoServicioURL = 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/generate_url';
  
    // Datos para el cuerpo de la segunda solicitud
    const datosCuerpo = {
      monto: monto,
      referencia1: tipoDoc,
      referencia2: documento,
      referencia3: nombre
    };
  
    // Convertir los datos del cuerpo a formato JSON
    const datosCuerpoJSON = JSON.stringify(datosCuerpo);
  
    // Crear una nueva instancia de XMLHttpRequest para la segunda solicitud
    const xhrSegundaSolicitud = new XMLHttpRequest();
  
    // Configurar la segunda solicitud POST
    xhrSegundaSolicitud.open('POST', segundoServicioURL, true);
  
    // Configurar el encabezado de la segunda solicitud
    xhrSegundaSolicitud.setRequestHeader('Content-Type', 'application/json');
    xhrSegundaSolicitud.setRequestHeader('Authorization', idToken); // Agregar el token de autenticación
  
    // Manejar la respuesta cuando se complete la segunda solicitud
    xhrSegundaSolicitud.onreadystatechange = function () {
      if (xhrSegundaSolicitud.readyState === 4) {
        if (xhrSegundaSolicitud.status === 200) {
          // La segunda solicitud se completó con éxito
          const respuestaSegundaSolicitud = JSON.parse(xhrSegundaSolicitud.responseText);
  
          // Aquí puedes manejar la respuesta de la segunda solicitud
          console.log('Respuesta de la segunda solicitud:', respuestaSegundaSolicitud);
  
          // Redireccionar al usuario a la URL obtenida, por ejemplo:
          const redireccionURL = respuestaSegundaSolicitud.data.url;
          window.location.href = redireccionURL;
        } else {
          // Manejar errores de la segunda solicitud
          console.error('Error en la segunda solicitud:', xhrSegundaSolicitud.status, xhrSegundaSolicitud.statusText);
        }
      }
    };
  
    // Enviar la segunda solicitud con el cuerpo de datos
    xhrSegundaSolicitud.send(datosCuerpoJSON);
  }