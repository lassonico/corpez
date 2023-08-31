document.addEventListener('DOMContentLoaded', function(){
  const formulario = document.querySelector('#transactionForm')
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    enviarFromulario();
  });

});

function enviarFromulario(){

  const formulario = document.querySelector('#transactionForm')
  const monto = document.getElementById('monto').value;
  const tipoDoc = document.getElementById('tipoDoc').value;
  const documento = document.getElementById('documento').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const btn = document.getElementById('enviar');
  
  //Spinner
  const spinner = document.createElement('div');
  spinner.className = 'sk-circle';

  for (let i = 1; i <= 12; i++) {
    const childDiv = document.createElement('div');
    childDiv.className = `sk-circle${i} sk-child`;
    spinner.appendChild(childDiv);
  }

  btn.disabled = true

  btn.innerHTML = ''

  btn.insertBefore(spinner, btn.firstChild)

  // FASE 2 - Generar el token de activación de la cuenta
  const tokenEndpoint = 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/get_tokens_convenio_empresa';


  // Realizar la solicitud POST para obtener el token de activación
  fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": "LUIS1234",
      "password": "BDtn72@5"
    })
  })
  .then(response => response.json())
  .then(data => {
    // Obtener el token de activación [IdToken]

    const idToken = data.data.IdToken;

    // FASE 3 - Obtener la URL de autorización
    const autorizacionEndpoint = 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/generate_url';

    // Realizar la solicitud POST para obtener la URL de autorización
    fetch(autorizacionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken // Agregar el token de activación en el encabezado de autorización
      },
      body: JSON.stringify({
        "monto": +monto,
        "referencia1": tipoDoc,
        "referencia2": documento,
        "referencia3": nombre+apellido
      })
    })
    .then(respuesta => respuesta.json())
    .then(datos => {

      const redirec = datos.data.url;

      formulario.reset();
      spinner.remove()
      btn.innerHTML = 'Enviar solicitud';
      btn.disabled = false;
      // Redirecciona al usuario a la pasarela
      // window.open(redirec, '_blank');
      // window.location.href = redirec;

      
      const impurl = document.getElementById('authorizationUrl');
      const urlimp = document.createElement('DIV');
      urlimp.innerHTML = `
      <div class="contenedorVentanaModal">
        <div class="ventanaModal entrada">
          <h2>¡Excelente!</h2>
          <p class="textredirect">Serás direccionado a la pagina web de nuestro proveedor</p>
          <div class="contenedorBtnsModal">
            <a href=${redirec} target="_blanck" class="btnurl">Continuar</a>
            <button id="cerrarModal" class="btnurl">Cancelar</button>
          </div>
        </div>
      </div>`;
      const enviarsolicitud = urlimp.querySelector('.btnurl')
      enviarsolicitud.addEventListener('click', () =>{
        urlimp.remove();
      })
      const cerrarModalBtn = urlimp.querySelector('#cerrarModal');
      cerrarModalBtn.addEventListener('click', () => {
        urlimp.remove();
      });
      
      impurl.appendChild(urlimp);
  
    })

    .catch(error => {
      console.error('Error al obtener la URL de autorización:', error);
    });
  })
  .catch(error => {
    console.error('Error al generar el token de activación:', error);
  });
}
