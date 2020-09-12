const PRODUCTS_API = "https://japdevdep.github.io/ecommerce-api/product/all.json"

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_PRICE_ASC = "cashAsc";
const ORDER_PRICE_DESC = "cashDesc";
const ORDER_BY_RELEVANCE = "rel";
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

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
}

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {result = array.sort(function(a, b) {
        if ( a.name < b.name ){ return -1; }
        if ( a.name > b.name ){ return 1; }
        return 0;
        });
    }else if (criteria === ORDER_PRICE_ASC){
        result = array.sort(function(a, b) {
            return a.cost - b.cost;
        });
    }else if (criteria === ORDER_PRICE_DESC){
        result = array.sort(function(a, b) {
            return b.cost - a.cost;
        });
    }else if(criteria === ORDER_BY_RELEVANCE) {
        result = array.sort(function(a, b) {
            return b.soldCount - a.soldCount;
        });
    }

    return result;
};


var categoriesArray = [];

function showCategoriesList(){
    let htmlContentToAppend = "";
    
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.cost) <= maxCount))){
        

        htmlContentToAppend += `
        <a href="product-info.html?product=` + category.name.toLowerCase().replace(/\s/g, '-') + `" style="text-decoration: none; color: #212529;"><div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + category.imgSrc + `" alt="` + category.desc + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ category.name +`</h4>
                        <h5>` + category.currency + ` ` + category.cost + `</h5>
                    </div>
                    <div>` + category.description + `</div>
                </div>
            </div>
        </div></a>
        `
        };

    };

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
};


function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
    showCategoriesList();

};


document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_API).then(function(resultObj){
    if (resultObj.status === "ok")
    {
        categoriesArray = resultObj.data;
        sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
    }
    
    });
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_PRICE_ASC);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_PRICE_DESC);
    });

    document.getElementById("relevance").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_RELEVANCE);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

 });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){

        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList();
    });
