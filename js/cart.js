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
var finalPrice = 0;

function showCart(array) {
  let itemsTotal = "";
  let cartToShow = "";
  let subTotal = "";

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
          <input type="number" id="numberOfProductsBought" value="` + cartElements.count + `" min="1" max="10" class="product-cuantity-input">
          <p><strong>` + cartElements.currency + ` `+ cartElements.unitCost * cartElements.count +`</strong></p>
        </div>
      </ul>
    `

    subTotal += `
      <div class="container">
        <h2 id="sub"></h2>
      </div>
    `

    document.getElementById("cart-container").innerHTML = itemsTotal + cartToShow + subTotal;
  });
};


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
    });
});