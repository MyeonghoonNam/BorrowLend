$(document).ready(() => {
  $("#header").load("../../pages/header.html");
})

function menuopen(){
  $(".nav").toggle("hidden");
  $(".userwrap").toggle("hidden");
}
