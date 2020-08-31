$(document).ready(() => {
  $("#header").load("../../pages/header.html");
})

$(document).ready(function(){
  $("#menubar").click(function(){
    $(this).next(".nav").toggleClass("ul");
  });
});


