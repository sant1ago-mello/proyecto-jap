var infoParsed = JSON.parse(localStorage.getItem("nuevoUsuario"));

//Evento submit que crea un objeto JSON con los datos del usuario.
document.addEventListener("submit", function() {
    var infoUsuario = {
        nombre : document.getElementById("editar-nombre").value,
        edad : document.getElementById("editar-edad").value,
        mail : document.getElementById("editar-email").value,
        telefono : document.getElementById("editar-telefono").value
    };
    
    localStorage.setItem("nuevoUsuario", JSON.stringify(infoUsuario));

    document.getElementById("editar-datos").reset();
});


if (infoParsed["nombre"] !== "") {
    document.getElementById("usuario-nombre").innerHTML = `<p id="usuario-nombre"><b>Nombre: </b>`+ infoParsed.nombre +`</p>`
};

if (infoParsed["edad"] !== "") {
    document.getElementById("usuario-edad").innerHTML = `<p id="usuario-edad"><b>Edad: </b>`+ infoParsed.edad +` años.</p>`
};

if (infoParsed["mail"] !== "") {
    document.getElementById("usuario-email").innerHTML = `<p id="usuario-email"><b>E-mail: </b>`+ infoParsed.mail +`</p>`
};

if (infoParsed["telefono"] !== "") {
    document.getElementById("usuario-telefono").innerHTML = `<p id="usuario-email"><b>Telefono: </b>`+ infoParsed.telefono +`</p>`
};


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
});