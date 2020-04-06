import React from "react";
import { Link } from "react-router-dom";

function ProductCartRow( props ){
    const style = {
        width: '64px', height: '64px'
    }
    
    return (
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <Link to={'/productinfo/'+props.id}>
                <img class="img-thumbnail" src={props.image} style={style} /> 
                {props.heading}
            </Link>

            <span class="badge badge-secondary badge-pill pull-right">{props.num}</span>
        </li>
    )
}

export default ProductCartRow;