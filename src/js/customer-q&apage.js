$(document).ready(function(){
  $(document).on('click', '.qna_updatebtn', function(){
    var title = $('.qna_titleview').text();
    var content = $('.qna_contentview').text();
    
    var title_html = '';
    title_html = '<input class=\"qna_titleview_update\" value=\"'+ title +'\">';
    $('.qna_titleview').html(title_html);
    
    var content_html = '';
    content_html = '<textarea class=\"qna_contentview_update\" spellcheck=\"false\" wrap=\"hard\" style=\"resize: none;\">'+ content +'</textarea>';
    $('.qna_contentview').html(content_html);
    
    var confirm = '';
    confirm = '<button type=\"button\" class=\"qna_adminbtn qna_update_confirm\">완료</button> ';
    
    var cancle = '';
    cancle = '<button type=\"button\" class=\"qna_adminbtn qna_update_cancle\">취소</button>';
    
    $('.qna_updatebox').html(confirm+cancle);

    $(document).on('click', '.qna_update_confirm', function(){
      var title = $('.qna_titleview_update').val();
      var content = $('.qna_contentview_update').val();
      var key = $('.qna_key').val();

      $.ajax({
        url:'/customer-qna-update',
        dataType:'json',
        type:'post',
        data:{
          title:title,
          content:content,
          key:key
        },
        success:function(){
          window.location.reload();
        }
      });
    })
  });

  var title = $('.qna_titleview').text();
  var content = $('.qna_contentview').text();
  var updatebtn = $('.qna_updatebtn');
  var deletebtn = $('.qna_deletebtn');

  $(document).on('click', '.qna_update_cancle', function(){
    $('.qna_titleview').html(title);
    $('.qna_contentview').html(content);
    $('.qna_updatebox').empty();
    $('.qna_updatebox').append(updatebtn);
    $('.qna_updatebox').append(' ');
    $('.qna_updatebox').append(deletebtn);
  });

  $(document).on('click', '.qna_answer_upload', function(){
    var content = $('.qna_answer_content').val();
    var userid = $('.qna_writerview').text();
    var key = $('.qna_key').attr('value');

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
        html += '<input type=\"hidden\" class=\"qna_answer_length\" value=\"'+ result.answer.length +'\">';
        for(var i=0; i<result.answer.length; i++){
          html += '<div class=\"qna_answerlist_element\">'
          html += '<div class=\"qna_answerlist_element_userinfo\">'
          html += '<img class=\"qna_answerlist_element_img\" src=\"../../src/images/user.svg\">'
          html += '<div class=\"qna_answerlist_element_name\">관리자</div>'
          html += '</div>'
          html += '<div class=\"qna_answerlist_element_date\">'+ result.answer[i].created_at +'</div>'
          html += '<div class=\"qna_answerlist_element_content\">'+ result.answer[i].content +'</div>'
          html += '<div class=\"qna_answerlist_element_btnbox\">'
          html += '<button type=\"button\" class=\"qna_answerlist_element_deletebtn\">삭제</button>'
          html += '<input type=\"hidden\" class=\"qna_answerlist_element_deletetoken\" value=\"'+ result.answer[i].key +'\"></input>'
          html += '</div>'
          html += '</div>'
        }
        $('.qna_answerlist').html(html)
        $('.qna_answer_content').val('');
      }
    });
  });

  $(document).on('click', '.qna_answerlist_element_deletebtn', function(){
    var delete_element = $(this).closest('.qna_answerlist_element');
    var key = $(delete_element).find('.qna_answerlist_element_deletetoken').val();
    var qnakey = $('.qna_key').val();
    $(delete_element).remove();
    var element_length = $('.qna_answerlist_element').length;

    $.ajax({
      url:'/qna_answer_delete',
      dataType:'json',
      type:'post',
      data:{
        key:key,
        qnakey:qnakey,
        element_length:element_length
      },
      success:function(){
        if($('.qna_answerlist_element').length == 0) {
          $('.qna_answerlist_tag').remove();
        } else {
          var length = $('.qna_answer_length').val()-1;
          $('.qna_answer_length').val(length); 
          var tagtext = "댓글(" + String(length) + ")";

          $('.qna_answerlist_tag').text(tagtext);
        }
      }
    })
  });
})