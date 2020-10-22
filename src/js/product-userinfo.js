// 동적 상품리스트 레이아웃 구현
$(document).ready(function(){
  var ProductList = [];
  ProductList = document.getElementsByClassName("product_userinfo_productelement");
  
  if(ProductList.length%3 == 2){
    
    var storebox = document.getElementsByClassName("product_userinfo_productelementbox")[0];
    var layoutbox = document.createElement('article');
    
    layoutbox.setAttribute("class", "product_userinfo_productelement");
    layoutbox.setAttribute("style", "display:block");
    storebox.appendChild(layoutbox);
    ProductList[ProductList.length-1].style.border="none";
    ProductList[ProductList.length-1].style.cursor="default";
  }
  
  var div_box = document.getElementsByClassName('product_userinfo_product')[0];
  var div_topbox = document.getElementsByClassName('product_userinfo_topbox')[0];
  var div_default = document.getElementsByClassName('product_userinfo_default')[0];
  
  if(div_default){
    div_box.style.height="25rem";
    div_topbox.style.display="none";
  }
  
  //리뷰 평가
  var ratingEl = document.querySelector("#review-rating");
  var stars = createStarElements(ratingEl);
  
  setRating(stars, rating);
  getNewRating(ratingEl);
  
  //리뷰 작성
  $(document).on('click', '.review_sendbtn', function(){
    var content = $('.review_content_input').val();
    var ratingcount = $('input[name=ratingcount]').val();
    var user = $('.review_name').text();
    
    swal({
      title:'작성되었습니다.',
      icon: 'success',
      closeOnClickOutside:false,
      closeOnEsc:false,
    }).then(function() {
      $.ajax({
        url:'/add_review',
        type:'post',
        data:{
          content:content,
          ratingcount:ratingcount,
          user:user
        },
        success:function(result){
          $('.review_content_input').val('');
          $('.ratingcount').empty();
          $('.rating').empty();
          $('input[name=ratingcount]').removeAttr('value');
          
          var ratingEl = document.querySelector("#review-rating");
          var stars = createStarElements(ratingEl);
          setRating(stars,0);
          getNewRating(ratingEl);
          $('a.close-modal').click();
          
          ReviewlistClick();
          Reviewlist(result);
          
        }
      });
    });
  });
  
  $(document).on('click', '.product_userinfo_reveiwlist', function(){
    var user = $('.review_name').text();
    
    $.ajax({
      url:'/reviewlist',
      type:'get',
      data:{
        user:user
      },
      success:function(result){
        ReviewlistClick();
        Reviewlist(result);
      }
    });
  });

  $(document).on('click', '.product_userinfo_productlist', function(){
    var user = $('.review_name').text();

    $.ajax({
      url:'/productlist',
      type:'get',
      data:{
        user:user
      },
      success:function(result){
        ProductlistClick();
        Productlist(result);
      }
    });
  });

  $('.product_userinfo_defaultreview').css("display", "none");
});

let rating = 0;

function createStarElements(parentEl){
  var oneStarEl = document.createElement('div')
  var twoStarEl = document.createElement('div')
  var threeStarEl = document.createElement('div')
  var fourStarEl = document.createElement('div')
  var fiveStarEl = document.createElement('div')
  
  var stars = [oneStarEl, twoStarEl, threeStarEl, fourStarEl, fiveStarEl]
  
  stars.forEach(function(star, index){
      star.textContent = '\u2606'
      parentEl.appendChild(star)
  })
  
  return stars
}

function setRating(stars, rating){
  stars.forEach(function(star, index){
      star.classList = 'star'
      if (index >= rating) {
        star.classList.add('star-empty');
        star.classList.remove('star-filled');
        star.textContent = '\u2606'
      } else {
        star.classList.add('star-filled');
        star.classList.remove('star-empty');
        star.textContent = '\u2605'
      }
  });
}

function getNewRating(parentEl){
  var stars = parentEl.childNodes
  let tempRating = rating
  parentEl.onmouseover = function(){
      stars.forEach(function(star,index){
          star.onmouseover = function(){
            tempRating = index + 1;
            setRating(stars,tempRating);
          }
          
          star.onclick = function(){
              // 0점 주기 불가능
              // if (rating === 1) {tempRating = 0}
              rating = tempRating;
              $('.ratingcount').html(rating+'점');
              $('input[name=ratingcount]').attr('value', rating);
              setRating(stars,rating)
          }
      })
  }
  
  parentEl.onmouseout = function(){
      setRating(stars,rating)
  }
}

function ProductlistClick(){
  $('.product_userinfo_productelement').css('display', 'block');
  $('.product_userinfo_review').css('display', 'none');
  $('.product_userinfo_reveiwlist').css("color", "darkgray");
  $('.product_userinfo_productlist').css("color", "black");
}

function ReviewlistClick(){
  $('.product_userinfo_productelement').css('display', 'none');
  $('.product_userinfo_review').css('display', 'block');
  $('.product_userinfo_reveiwlist').css("color", "black");
  $('.product_userinfo_productlist').css("color", "darkgray");
}

function Reviewlist(e) {
  if(e.review.length != 0){
    $('.product_userinfo_defaultreview').css("display", "none");
    
    var html = '';
    for(var i=0; i<e.review.length; i++){
      html += '<div class=\"product_userinfo_review_element\">';
      html += '<div class=\"review_element_user\">';
      html += '<img class=\"review_element_img\" src=\"../../src/images/user.svg\">';
      html += '<div class=\"review_element_grade\">'+ e.review[i].grade +'</div>'
      html += '<div class=\"review_element_id\">'+ e.review[i].id +'</div>'
      html += '<div class=\"review_element_date\">'+ e.review[i].created_at +'</div>'
      html += '</div>';
      html += '<div class=\"review_element_content\">'+ e.review[i].content +'</div>'
      html += '<div class=\"review_element_star\">';
      for(var count=0; count<5; count++){
        if(e.review[i].rate > count){
          html += "<div class=\'star_fill\'>\u2605</div>";
        } else {
          html += "<div class=\'star_empty\'>\u2605</div>";
        }
      }
      html += '<div class=\"review_element_rate\">'+ e.review[i].rate +'</div>'
      html += '</div>';
      html += '</div>';
    } 
    $('.product_userinfo_review').html(html);
  } else {
    $('.product_userinfo_defaultreview').css("display", "block");
  }
}

function Productlist(e) {
  if(e.product.length != 0){
    $('.product_userinfo_defaultreview').css("display", "none");
    var html = '';
    for(var i=0; i<e.product.length; i++){
      var j = 0;
  
      html += '<article class=\"product_userinfo_productelement\">'
      html += '<form method=\"get\" action=\"/product\" onclick=\"ProductClick(this)\">';
      html += '<img class=\"pud_element_img\" src=\"../../src/uploads/'+ e.product[i].list[j].name +'\">';
      html += '<div class=\"pud_element_title\">'+ e.product[i].title +'</div>';
      html += '<div class=\"pud_element_price\">'+ e.product[i].price +'</div>';
      html += '<div class=\"pud_element_likebox\">';
      html += '<i class=\"pud_element_icon fas fa-heart\"></i>';
      html += '<div class=\"pud_element_count\">'+ e.product[i].LikeCount +'</div>';
      html += '</div>';
      html += '<input type=\"hidden\" name=\"element_token\" value=\"'+ e.product[i].key +'\">';
      html += '<input type=\"submit\" class=\"element_btn\" style=\"display:none\">';
      html += '</form>';
      html += '</article>';
    }
    $('.product_userinfo_productelementbox').html(html);
  
    var ProductList = [];
    ProductList = document.getElementsByClassName("product_userinfo_productelement");
    
    if(ProductList.length%3 == 2){
      
      var storebox = document.getElementsByClassName("product_userinfo_productelementbox")[0];
      var layoutbox = document.createElement('article');
      
      layoutbox.setAttribute("class", "product_userinfo_productelement");
      layoutbox.setAttribute("style", "display:block");
      storebox.appendChild(layoutbox);
      ProductList[ProductList.length-1].style.border="none";
      ProductList[ProductList.length-1].style.cursor="default";
    }
  }
}

function ProductClick(element){
  var product = $(element).find(".element_btn")
  
  console.log(product);

  product[0].click();
}