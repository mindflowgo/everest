import React from "react";
import { useGlobalStore } from "./GlobalStore";
import ProductCartRow from "./ProductCartRow";

function CartPage( props ){
    const [ globalData, dispatch ] = useGlobalStore();
    console.log( `[CartPage] globalData:`, globalData )

    return (
        <ul key={props.heading} class="list-group">
        {globalData.cart.map( product=><ProductCartRow {...product} />)}
        </ul>
    )
}

export default CartPage;