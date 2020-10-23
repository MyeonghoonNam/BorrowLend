$(document).ready(function(){
  
  $(document).on('click', '.qna_answer_upload', function(){
    var content = $('.qna_answer_content').val();
    var userid = $('.qna_writerview').text();
    var key = $('.qna_answer_key').attr('value');
    console.log(key);
    $.ajax({
      url:'/qna_answer_upload',
      dataType:'json',
      type:'post',
      data:{
        content:content,
        userid:userid,
        key:key
      },
      success:function(result){
        var html = '';
        html += '<div class=\"qna_answerlist_tag\">댓글('+ result.answer.length +')</div>'
        for(var i=0; i<result.answer.length; i++){
          html += '<div class=\"qna_answerlist_element\">'
          html += '<div class=\"qna_answerlist_element_userinfo\">'
          html += '<img class=\"qna_answerlist_element_img\" src=\"../../src/images/user.svg\">'
          html += '<div class=\"qna_answerlist_element_name\">관리자</div>'
          html += '</div>'
          html += '<div class=\"qna_answerlist_element_date\">'+ result.answer[i].created_at +'</div>'
          html += '<div class=\"qna_answerlist_element_content\">'+ result.answer[i].content +'</div>'
          html += '</div>'
        }
        $('.qna_answerlist').html(html)
        $('.qna_answer_content').val('');
      }
    });
  });
})