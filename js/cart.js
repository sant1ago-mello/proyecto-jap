var getJSONData = function(url){
    var result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
};

var cartArray = [];
var subTotal;
var shippingPercentage;

//función para agregar articulo predefinido.
function showCart(array) {
  let itemsTotal = "";
  let cartToShow = "";

  itemsTotal += `
    <h4 class="d-flex justify-content-between align-items-center mb-3">
      Productos en el Carrito <span class="badge badge-pill badge-primary">` + array.length + `</span>
    </h4>
  `

  array.map(function (cartElements){
    cartToShow += `
      <ul class="list-group-item d-flex lh-condensed justify-content-between mb-4">
        <div>
          <img src="` + cartElements.src + `" width="120">
        </div>
        <div class="text-right">
          <h6><strong>` + cartElements.name + `</strong></h6>
          <label for="numberOfProductsBought">Cantidad: </label> 
          <input type="number" id="numberOfProductsBought" value="` + cartElements.count + `" min="1" max="20" class="product-cuantity-input">
          <p id="productTotal"><strong>` + cartElements.currency + ` `+ cartElements.unitCost * cartElements.count +`</strong></p>
        </div>
      </ul>
    `
    let envioPremiumTax = cartElements.unitCost*cartElements.count*15/100

    document.getElementById("subtotal").innerHTML = cartElements.currency +` `+ cartElements.unitCost * cartElements.count
    document.getElementById("cart-container").innerHTML = itemsTotal + cartToShow;
    document.getElementById("porcentaje-envio").innerHTML = cartElements.currency + ` ` + envioPremiumTax;
    document.getElementById("total").innerHTML = cartElements.currency + ` ` + parseInt(cartElements.unitCost*cartElements.count+envioPremiumTax);
  });
};

function total() {
  document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
  document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal+shippingPercentage);
};


//Expresiones regulares para numero de dirección de envio, numero de tarjeta, codigo de seguridad de tarjeta y fecha de vencimiento de tarjeta.
var adressNumber = document.getElementById("envio-numero-calle");
var adressNumberRegex = /^\d{4}$/;
var adressNumError = document.getElementById("adressNumError");

var cardNumber = document.getElementById("numeroTarjeta");
var regexCard = /\d{16}$/;
var cardNumberError = document.getElementById("nroTarjetaIncorrecto");

var securityCode = document.getElementById("codigoSeguridad")
var regexCardCode = /^\d{3}$/;
var cardCodeError = document.getElementById("codigoIncorrecto");

var cardExpirationDate = document.getElementById("vencimientoTarjeta");
var regexDate = /^((0[1-9])|(1[0-2]))(\/){0,1}((\d{2})|(\d{4}))$/;
var cardDateError = document.getElementById("vencimientoFormato");

adressNumber.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (!adressNumberRegex.test(adressNumber.value)) {
    adressNumError.innerHTML = `<small>Numero invalido</small>`;
  } else {
    adressNumError.innerHTML = `<small></small>`;
  };
});

cardNumber.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (!regexCard.test(cardNumber.value)) {
    cardNumberError.innerHTML = `<span>Numero incorrecto</span>`;
  } else {
    cardNumberError.innerHTML = `<span></span>`
  }
});

securityCode.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (!regexCardCode.test(securityCode.value)) {
    cardCodeError.innerHTML = `<span>Codigo incorrecto</span>`;
  } else {
    cardCodeError.innerHTML = `<span></span>`;
  }
});

cardExpirationDate.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (!regexDate.test(cardExpirationDate.value)) {
    cardDateError.innerHTML = `<span>Fecha incorrecta</span>`;
  } else {
    cardDateError.innerHTML = `<span></span>`;
  };
});


//Eventos para inhabilitar inputs dependiendo de si elige pagar con tarjeta o cuenta bancaria.
document.getElementById("tarjetaDeCredito").addEventListener("click", function() {
  document.getElementById("numeroCuentaBancaria").setAttribute("disabled", "");
  document.getElementById("numeroTarjeta").removeAttribute("disabled", "");
  document.getElementById("codigoSeguridad").removeAttribute("disabled", "");
  document.getElementById("vencimientoTarjeta").removeAttribute("disabled", "");

  document.getElementById("numeroTarjeta").setAttribute("required", "");
  document.getElementById("codigoSeguridad").setAttribute("required", "");
  document.getElementById("vencimientoTarjeta").setAttribute("required", "");
  document.getElementById("numeroCuentaBancaria").removeAttribute("required", "");

  document.getElementById("numeroTarjeta").setAttribute("form", "datos-envio");
  document.getElementById("codigoSeguridad").setAttribute("form", "datos-envio");
  document.getElementById("vencimientoTarjeta").setAttribute("form", "datos-envio");
  document.getElementById("numeroCuentaBancaria").removeAttribute("form", "");
});

document.getElementById("transferenciaBancaria").addEventListener("click", function() {
  document.getElementById("numeroTarjeta").setAttribute("disabled", "");
  document.getElementById("codigoSeguridad").setAttribute("disabled", "");
  document.getElementById("vencimientoTarjeta").setAttribute("disabled", "");
  document.getElementById("numeroCuentaBancaria").removeAttribute("disabled", "");

  document.getElementById("numeroCuentaBancaria").setAttribute("required", "");
  document.getElementById("numeroTarjeta").removeAttribute("required", "");
  document.getElementById("codigoSeguridad").removeAttribute("required", "");
  document.getElementById("vencimientoTarjeta").removeAttribute("required", "");

  document.getElementById("numeroCuentaBancaria").setAttribute("form", "datos-envio");
  document.getElementById("numeroTarjeta").removeAttribute("form", "");
  document.getElementById("codigoSeguridad").removeAttribute("form", "");
  document.getElementById("vencimientoTarjeta").removeAttribute("form", "");
});


//Mostrar mensaje cuando se concreta una compra.
document.getElementById("finalizar-compra").addEventListener("click", function() {
  getJSONData(CART_BUY_URL).then(function(buyMsj) {
    if (buyMsj.status === "ok") {
      alert(buyMsj.data.msg);
    };
  });
});


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function () {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      cartArray = resultObj.data.articles;
      showCart(cartArray);
      subTotal = document.getElementById("numberOfProductsBought").value * cartArray[0].unitCost
    };

    //Calcular el subtotal.
    document.getElementById("numberOfProductsBought").addEventListener("change", function () {
      subTotal = document.getElementById("numberOfProductsBought").value * cartArray[0].unitCost

      document.getElementById("productTotal").innerHTML = "<strong>" + cartArray[0].currency + " " + subTotal + "</strong>"
      document.getElementById("subtotal").innerHTML = cartArray[0].currency + " " + subTotal

      if (document.getElementById("forma-de-envio").value === "envioPremium") {
        shippingPercentage = (subTotal * 15) / 100;
        document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
        document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal + shippingPercentage);
      }
      else if (document.getElementById("forma-de-envio").value === "envioExpress") {
        shippingPercentage = (subTotal * 7 / 100);
        document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
        document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal + shippingPercentage);
      }
      else if (document.getElementById("forma-de-envio").value === "envioStandard")
        shippingPercentage = (subTotal * 5 / 100);
      document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
      document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal + shippingPercentage);

      total();
    });
  });
});