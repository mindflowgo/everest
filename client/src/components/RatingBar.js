import React from 'react'

function RatingBar( props ){
   const html = ['*','*','*','*','*'].map( (_,idx)=>`<i class="${props.rating>idx ? 'fas fa-star text-warning' : 'far fa-star text-secondary'}"></i>` )
   return (
      <div dangerouslySetInnerHTML={{ __html: html.join('') }}></div>
   )
}

export default RatingBar