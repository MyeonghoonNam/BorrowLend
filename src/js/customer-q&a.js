$(document).ready(function(){
  var checklist = $('.qna_answer');
  
  for(var i=0; i<checklist.length; i++){
    if($(checklist[i]).attr('value') == "N"){
      $(checklist[i]).addClass('qna_answer_checkN');
      $(checklist[i]).text('대기');
    } else if($(checklist[i]).attr('value') == "Y"){
      $(checklist[i]).addClass('qna_answer_checkY');
      $(checklist[i]).text('답변완료');

    }
  }
})