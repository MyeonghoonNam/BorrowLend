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
  }
});