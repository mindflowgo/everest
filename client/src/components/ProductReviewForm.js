import React from 'react';

function ProductReviewForm( props ){
   return (
      <form>
         <div class="form-group">
            <label for="formName">Email</label>
            <input type="email" class="form-control" id="formName" placeholder="name@example.com" />
         </div>
         <div class="form-group">
            <label for="formRating">Rating...</label>
            <select class="form-control" id="formRating">
               <option>1</option>
               <option>2</option>
               <option>3</option>
               <option>4</option>
               <option>5</option>
            </select>
         </div>
         <div class="form-group">
            <label for="formReview">Your Review</label>
            <textarea class="form-control" id="formReview" rows="3"></textarea>
         </div>
         <button class='btn btn-lg btn-primary' onClick={props.saveForm}>Save Review</button>
      </form>
   )
}

export default ProductReviewForm
