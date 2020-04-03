import React from "react";
import { Link } from "react-router-dom";

function ProductCard( props ){
    return (
        <div key={props.heading} className="card mx-auto col-4">
            <Link to={'/productinfo/'+props.id}>
            <img className="card-img-top" src={props.image} alt={props.description} title={props.description} />
            <div className="card-body">
                <h4 className="card-title">{props.heading}</h4>
                <p className="card-text">{props.price}</p>
            </div>
            </Link>
        </div>
    )
}

export default ProductCard;