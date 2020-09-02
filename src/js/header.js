$(document).ready(() => {
  $("#header").load("../../pages/header.html");
})


function menuopen(){
  if($(".nav").css("display") == "none"){
    $(".nav").show();
  }
  if($(".userwrap").css("display") == "none"){
  $(".userwrap").show();
  }
}
function  menuclose(){
  if($(".nav").css("display") == "block"){
    $(".nav").hide();
  }
  if($(".userwrap").css("display") == "block"){
  $(".userwrap").hide();
  }
}




