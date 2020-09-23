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


//Función para agregar carrusel de imagenes y agregar información del producto.
function appendInfoAndImg(array) {
    let contentToAppend = "";
    
    document.getElementById("image-carousel").innerHTML = `
    <div id="carousel" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img class="d-block w-100" src="` + array.images[0] + `" alt="first image">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="` + array.images[1] + `" alt="second image">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="` + array.images[2] + `" alt="third image">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="` + array.images[3] + `" alt="fourth image">
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="` + array.images[4] + `" alt="last image">
        </div>
        </div>
      <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    `
      
    contentToAppend += `
      <h1 class="mt-3">` + array.name + `</h1>
      <h3 class="font-weight-bold">` + array.currency + ` ` + array.cost + `</h3>
      <p>` + array.soldCount + ` vendidos</p>
      <p class="mt-4">` + array.description + `</p>
    </div>
    `

    document.getElementById("product-info").innerHTML = contentToAppend;
};


//función para agregar productos relacionados.
function appendRelatedProducts(array) {
  let appendRelated = "";

  appendRelated += `
  <div class="col-md-4">
    <a href="product-info.html?product=` + array[1].name.toLowerCase().replace(/\s/g, '-') + `" style="text-decoration: none; color: #212529;"><div class="card mb-4">
      <img class="card-image-top" src="` + array[1].imgSrc + `" style="height: 225px; width: 100%; display: block;">
      <div class="card-body">
        <h5>` + array[1].name + `</h5>
        <p class="card-text">` + array[1].description + `</p>
        <strong>` + array[1].currency + ` ` + array[1].cost + `</strong>
      </div>
    </div></a>
  </div>

  <div class="col-md-4">
    <a href="product-info.html?product=` + array[3].name.toLowerCase().replace(/\s/g, '-') + `" style="text-decoration: none; color: #212529;"><div class="card mb-4">
      <img class="card-image-top" src="` + array[2].imgSrc + `" style="height: 225px; width: 100%; display: block;">
      <div class="card-body">
        <h5>` + array[3].name + `</h5>
        <p class="card-text">` + array[3].description + `</p>
        <strong>` + array[3].currency + ` ` + array[3].cost + `</strong>
      </div>
    </div></a>
  </div>
  `

  document.getElementById("related-products").innerHTML = appendRelated;
};


//función para agregar comentarios predefinidos.
function appendComments(array) {
  let commentsToAppend = "";

  array.map(function(comments) {
    commentsToAppend += `
    <div class="row">
      <div class="col-md-2 mb-5">
          <a href=""><p class="text-primary text-center font-weight-bold">` + comments.user + `</p></a>
      </div>
      <div class="col-md-10">
        <p>
          <time class="float-left text-muted">` + showDate(comments.dateTime) + `</time>
          ` + commentRating(comments.score) + `
        </p>
        <div class="clearfix"></div>
          <p>` + comments.description + `</p>
      </div>
    </div>
    <hr>
    `;

    document.getElementById("comments").innerHTML = commentsToAppend;
  });
};

//función para mostrar rating como estrellas
function commentRating(userScore) {
  let plusStar = '<span class="fa fa-star checked float-right"></span>'
  let minusStar = '<span class="fa fa-star float-right"></span>'
  return plusStar.repeat(userScore) + minusStar.repeat(5 - userScore);
};

//función para darle formato a la fecha de comentarios (n: use una libreria externa (https://momentjs.com/) pero no se si esta permitido.)
function showDate(commentDate) {
  return (moment(commentDate).format('DD/MM/YYYY HH:mm'));
};

//función para agregar nuestro comentario
function apppendUserComment() {
  let userComment = document.getElementById("comentario-usuario");

  userComment.addEventListener("submit", function(e){
    e.preventDefault();

    let newComment = {
        'score' : userComment['rating'].value,
        'description' : userComment['comment'].value, 
        'user' : localStorage.getItem("nombre"),
        'dateTime' : new Date().toISOString(),
    };
    
    commentsArray.push(newComment);
    appendComments(commentsArray);
    resetCommentForm();
  });
};

//función para resetear los campos de envio de comentario 
function resetCommentForm(){
  let commentForm = document.getElementById("comentario-usuario");
  commentForm["rating"].value = "5";
  commentForm["comment"].value = "";
};


document.addEventListener("DOMContentLoaded", function() {
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
      if (resultObj.status === "ok")
      {
        infoArray = resultObj.data; 
        appendInfoAndImg(infoArray);
        apppendUserComment();
      };
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(response) {
      if (response.status === "ok") 
      {
        commentsArray = response.data;
        appendComments(commentsArray);
      };
    });

    getJSONData(PRODUCTS_API).then(function(response) {
      if (response.status === "ok") 
      {
        relatedProductsArray = response.data;
        appendRelatedProducts(relatedProductsArray);
      };
    });

    //secuencia para cambiar el titulo de la pagina dependiendo de el parametro URL
    if (window.location.search == "?product=fiat-way") {
      document.title = "Fiat Way - eMercado";
    } else if (window.location.search == "?product=peugeot-208") {
      document.title = "Peugeot 208 - eMercado";
    } else if (window.location.search == "?product=suzuki-celerio") {
      document.title = "Suzuki Celerio - eMercado";
    };
    
});