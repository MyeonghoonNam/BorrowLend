$(document).ready(() => {
  $("#header").load("../../pages/header.html");
})

$(document).ready(function(){ 
  $(".menubar").click(function(){ 
    if($(".nav").is(":visible")){ 
      $(".nav").css("display", "none"); 
    }else{ 
      $(".nav").css("display", "block"); 
    } 
  }); 
});


