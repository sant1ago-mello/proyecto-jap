function submitEventHandler(evento) {
    evento.preventDefault();
    sessionStorage.setItem("logueado", "true");
    window.location.href = "index.html";
    return true;
};

document.getElementById("formulario-login").addEventListener("submit", submitEventHandler);
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
});