import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard( props ){
   return (
      <div key={props._id} className="card mx-auto col-4 mb-3">
         <button onClick={(e)=>props.cartAdd(e,props._id,1)} class="btn btn-sm btn-outline-secondary"><i class="fas fa-cart-plus"></i></button>
         <Link to={'/products/info/'+props._id}>
            <img className="card-img-top" src={props.image} alt={props.description} title={props.description} />
            <div className="card-body">
               <h4 className="card-title">{props.heading}</h4>
               <p className="card-text">{props.price}</p>
            </div>
         </Link>
s
      </div>
   )
}

export default ProductCard;