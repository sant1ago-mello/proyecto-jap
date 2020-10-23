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
  let envioPremium
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
    
    document.getElementById("subtotal").innerHTML = cartElements.currency +` `+ cartElements.unitCost * cartElements.count
    document.getElementById("cart-container").innerHTML = itemsTotal + cartToShow;
    document.getElementById("porcentaje-envio").innerHTML = cartElements.currency + ` ` + cartElements.unitCost*cartElements.count*15/100;
    document.getElementById("total").innerHTML = cartElements.currency + ` ` + parseInt(cartElements.unitCost*cartElements.count+cartElements.unitCost*cartElements.count*15/100);
  });
};

function total() {
  document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
  document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal+shippingPercentage);
};

//Mostrar mensaje cuando se concreta una compra.
/*document.getElementById("finalizar-compra").addEventListener("click", function() {
  getJSONData(CART_BUY_URL).then(function(buyMsj) {
    if (buyMsj.status === "ok") {
      alert(buyMsj.data.msg);
    };
  });
});*/

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function() {
    getJSONData(CART_INFO_URL).then(function(resultObj){
      if (resultObj.status === "ok")
      {
        cartArray = resultObj.data.articles;
        showCart(cartArray);
        subTotal = document.getElementById("numberOfProductsBought").value*cartArray[0].unitCost
      };
      
      //Calcular el subtotal.
      document.getElementById("numberOfProductsBought").addEventListener("change", function() {
        subTotal = document.getElementById("numberOfProductsBought").value*cartArray[0].unitCost

        document.getElementById("productTotal").innerHTML = "<strong>" + cartArray[0].currency + " " + subTotal + "</strong>"
        document.getElementById("subtotal").innerHTML = cartArray[0].currency + " " + subTotal

        if (document.getElementById("forma-de-envio").value === "envio-premium") {
          shippingPercentage = (subTotal*15)/100;
          document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
          document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal+shippingPercentage);
        } else if (document.getElementById("forma-de-envio").value === "envio-express") {
          shippingPercentage = (subTotal*7/100);
          document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
          document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal+shippingPercentage);
        } else if (document.getElementById("forma-de-envio").value === "envio-standard")
          shippingPercentage = (subTotal*5/100);
          document.getElementById("porcentaje-envio").innerHTML = cartArray[0].currency + ` ` + shippingPercentage;
          document.getElementById("total").innerHTML = cartArray[0].currency + ` ` + parseInt(subTotal+shippingPercentage);
 
        total()
    });
  });
});