import React from 'react'
import { Link } from 'react-router-dom'

function ProductCartRow( props ){
   return (
      <li class="list-group-item d-flex justify-content-between align-items-center">
         <Link to={'/products/'+props.id}>
            <img class="img-thumbnail" src={props.image} alt={props.heading} width="64" height="64" />
            <span class="mx-3">{props.heading}</span>
         </Link>

         <span class="badge rounded-pill bg-warning text-dark float-end">{props.num}</span>
      </li>
   )
}

export default ProductCartRow