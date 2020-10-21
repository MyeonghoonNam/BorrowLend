$(document).ready(function(){
  const ratingEl = document.querySelector("#review-rating")
  const stars = createStarElements(ratingEl)
  
  setRating(stars, rating)
  getNewRating(ratingEl)
  var content = $('.hi').val();
  $('p').html(content);
});

let rating = 0;

function createStarElements(parentEl){
  const oneStarEl = document.createElement('div')
  const twoStarEl = document.createElement('div')
  const threeStarEl = document.createElement('div')
  const fourStarEl = document.createElement('div')
  const fiveStarEl = document.createElement('div')
  
  const stars = [oneStarEl, twoStarEl, threeStarEl, fourStarEl, fiveStarEl]
  
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
  const stars = parentEl.childNodes
  let tempRating = rating
  parentEl.onmouseover = function(){
      stars.forEach(function(star,index){
          star.onmouseover = function(){
            tempRating = index + 1;
            setRating(stars,tempRating);
          }
          
          star.onclick = function(){
              // if (rating === 1) {tempRating = 0}
              rating = tempRating;
              setRating(stars,rating)
          }
      })
  }
  
  parentEl.onmouseout = function(){
      setRating(stars,rating)
  }
}

