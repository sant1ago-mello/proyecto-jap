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
var envio = 0;

//función para agregar articulo predefinido.
function showCart(array) {
  let itemsTotal = "";
  let cartToShow = "";
  let showSubTotal = "";

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
    
    showSubTotal += `
      <div class="container">
        <h4 id="subtotal">Subtotal: `+ cartElements.currency +` `+ cartElements.unitCost * cartElements.count + `</h4>
      </div>
    `
    document.getElementById("cart-container").innerHTML = itemsTotal + cartToShow + showSubTotal;
  });
};

//función para calcular el IVA.
function calculateIVA() {
  return subTotal*22 / 100;
};

//función para mostrar el subtotal y el total de la compra.
function showSubTotalandTotal() {
  document.getElementById("productTotal").innerHTML = "<strong>" + cartArray[0].currency + " " + subTotal + "</strong>"
  document.getElementById("subtotal").innerHTML = "<h4>Subtotal: " + cartArray[0].currency + " " + subTotal +"</h4>"
  document.getElementById("total").innerHTML = "<h3>Total: " + cartArray[0].currency + " " + parseInt(subTotal+envio+calculateIVA()) + " IVA inc.</h3>"
};

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
document.addEventListener("DOMContentLoaded", function() {
    getJSONData(CART_INFO_URL).then(function(resultObj){
      if (resultObj.status === "ok")
      {
        cartArray = resultObj.data.articles;
        showCart(cartArray);
      };
      
      //Calcular el subtotal.
      document.getElementById("numberOfProductsBought").addEventListener("change", function() {
        subTotal = document.getElementById("numberOfProductsBought").value*cartArray[0].unitCost
        
        //Añadir 200 pesos al total si el envio es al interior.
        document.getElementById("datos-envio").addEventListener("change", function() {
          if (document.getElementById("datos-envio").value === "interior") {
            envio = 200;
            document.getElementById("total").innerHTML = "<h3>Total: " + cartArray[0].currency + " " + parseInt(subTotal+envio+calculateIVA()) + " IVA inc.</h3>"
          } else if (document.getElementById("datos-envio").value === "montevideo") {
            envio = 0;
            document.getElementById("total").innerHTML = "<h3>Total: " + cartArray[0].currency + " " + parseInt(subTotal+calculateIVA()) + " IVA inc.</h3>"
          }
        });
  
        showSubTotalandTotal();
      });
    });
  })