// 동적 상품리스트 레이아웃 구현
$(document).ready(function(){
  var ProductList = [];
  ProductList = document.getElementsByClassName("store-product-element");
  
  if(ProductList.length%3 == 2){
    
    var storebox = document.getElementsByClassName("store-product")[0];
    var layoutbox = document.createElement('div');
    
    layoutbox.setAttribute("class", "store-product-element");
    layoutbox.setAttribute("style", "display:block");
    storebox.appendChild(layoutbox);
    ProductList[ProductList.length-1].style.border="none";
    ProductList[ProductList.length-1].style.cursor="default";
  }

  var orderbylikebtn = document.getElementsByClassName('orderbylike')[0];
  var orderbydatebtn = document.getElementsByClassName('orderbydate')[0];
  var setToken = $('input[name=store_ordertoken]').attr("value");

  if(setToken == "1"){
    $(orderbylikebtn).css("color", "black");
    $(orderbydatebtn).css("color", "darkgray");

    $(orderbydatebtn).hover(function(){
      $(orderbydatebtn).css("color", "black");
    }, function(){
      $(orderbydatebtn).css("color", "darkgray");
    });
  }
});

function ProductClick(element){
  var product = $(element).find(".element_btn")
  
  console.log(product);

  product[0].click();
}

function OrderByDate(){
  var token = $('.orderlist_btn');
  $('input[name=store_ordertoken]').attr("value","0");
  token.click();
}

function OrderByLike(){
  var token = $('.orderlist_btn');
  $('input[name=store_ordertoken]').attr("value","1");
  token.click();

}