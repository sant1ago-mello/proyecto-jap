const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const PRODUCTS_API = "https://japdevdep.github.io/ecommerce-api/product/all.json"

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

var infoArray = [];
var commentsArray = [];
var relatedProductsArray = [];

//Función para agregar galeria de imagenes y agregar información del producto.
function appendInfoAndImg(array) {
    let contentToAppend = "";
    
    document.getElementById("main-pic").innerHTML = `<img class="img-fluid" src="` + array.images[0] + `" alt="">`
    document.getElementById("second-pic").innerHTML = `<img class="img-fluid" src="` + array.images[1] + `" alt="">`
    document.getElementById("third-pic").innerHTML = `<img class="img-fluid" src="` + array.images[2] + `" alt="">`
    document.getElementById("fourth-pic").innerHTML = `<img class="img-fluid" src="` + array.images[3] + `" alt="">`
    document.getElementById("fifth-pic").innerHTML = `<img class="img-fluid" src="` + array.images[4] + `" alt="">`

    document.getElementById("first-thumbnail").innerHTML = `<img class="img-fluid" src="` + array.images[0] + `" alt="">`
    document.getElementById("second-thumbnail").innerHTML = `<img class="img-fluid" src="` + array.images[1] + `" alt="">`
    document.getElementById("third-thumbnail").innerHTML = `<img class="img-fluid" src="` + array.images[2] + `" alt="">`
    document.getElementById("fourth-thumbnail").innerHTML = `<img class="img-fluid" src="` + array.images[3] + `" alt="">`
    document.getElementById("fifth-thumbnail").innerHTML = `<img class="img-fluid" src="` + array.images[4] + `" alt="">`
      
    contentToAppend += `
      <h1 class="mt-3">` + array.name + `</h1>
      <h3 class="font-weight-bold">` + array.currency + ` ` + array.cost + `</h3>
      <p>` + array.soldCount + ` vendidos</p>
      <p class="mt-4">` + array.description + `</p>
    </div>
    `;

    document.getElementById("product-info").innerHTML = contentToAppend;

};

//Función para cambiar la imagen principal cuando clickeamos en una imagen de la galería.
function openImg(imgName) {
    var i, x;
    x = document.getElementsByClassName("picture");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(imgName).style.display = "block";
};

//Función para agregar comentarios predefinidos.
function appendComments(array) {
  let commentsToAppend = "";

  array.map(function(comments) {
    commentsToAppend += `
    <div class="row">
      <div class="col-md-2">
          <img src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" class="img img-rounded img-fluid"/>
          <a href="#"><p class="text-primary text-center font-weight-bold">` + comments.user + `</p></a>
      </div>
      <div class="col-md-10">
        <p>
          <time class="float-left text-muted">` + comments.dateTime + `</time>
          ` + rating(comments.score) + `
        </p>
        <div class="clearfix"></div>
          <p>` + comments.description + `</p>
      </div>
    </div>
        `;

    document.getElementById("comments").innerHTML = commentsToAppend;
  })
};

function rating(userScore) {
  let plusStar = '<span class="fa fa-star checked float-right"></span>'
  let minusStar = '<span class="fa fa-star float-right"></span>'
  return plusStar.repeat(userScore) + minusStar.repeat(5 - userScore);
};

//Función para agregar productos relacionados.
function appendRelatedProducts(array) {
  let appendRelated = "";

  appendRelated += `
  <div class="col-md-4">
    <div class="card mb-4">
      <img class="card-image-top" src="` + array[1].imgSrc + `" style="height: 225px; width: 100%; display: block;">
      <div class="card-body">
        <h5>` + array[1].name + `</h5>
        <p class="card-text">` + array[1].description + `</p>
        <strong>` + array[1].currency + ` ` + array[1].cost + `</strong>
      </div>
    </div>
  </div>

  <div class="col-md-4">
    <div class="card mb-4">
      <img class="card-image-top" src="` + array[3].imgSrc + `" style="height: 225px; width: 100%; display: block;">
      <div class="card-body">
        <h5>` + array[3].name + `</h5>
        <p class="card-text">` + array[3].description + `</p>
        <strong>` + array[3].currency + ` ` + array[3].cost + `</strong>
      </div>
    </div>
  </div>
  `
  document.getElementById("related-products").innerHTML = appendRelated;
};


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
      if (resultObj.status === "ok")
      {
        infoArray = resultObj.data; 
        appendInfoAndImg(infoArray);
        openImg("main-pic");
    }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(response) {
      if (response.status === "ok") 
      {
        commentsArray = response.data;
        appendComments(commentsArray);
        console.log(Date(commentsArray[0].dateTime))
      }
    });

    getJSONData(PRODUCTS_API).then(function(response) {
      if (response.status === "ok") 
      {
        relatedProductsArray = response.data;
        appendRelatedProducts(relatedProductsArray);
      }
    });
});