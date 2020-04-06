import React, { useState, useEffect } from "react";
import ProductCartRow from "./ProductCartRow";
import { useGlobalStore } from "./GlobalStore";

function CartPage( props ){
    const [ products, setProducts ]= useState([]);
    const [ globalData, dispatch ] = useGlobalStore();

    return (
        <ul key={props.heading} class="list-group">
        {globalData.cart.map( product=><ProductCartRow {...product} />)}
        </ul>
    )
}

export default CartPage;