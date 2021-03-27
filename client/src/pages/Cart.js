import React, { useEffect, useState } from "react"
import ProductCartRow from '../components/CartRow'
import { useStoreContext } from '../utils/GlobalStore'

function Cart( props ){
    const [{ products, cart }] = useStoreContext()
    const [ cartProducts, setCartProducts ]= useState([])

    // whenever page loads we generate the cart
    useEffect( function(){
        setCartProducts(
            cart.map( cartItem=>{ return { ...cartItem, ...products.filter(product=>product._id===cartItem.id )[0] } })
        )
    }, [])
   return (
      <ul key={props.heading} class="list-group">
         {cartProducts.map( product=><ProductCartRow {...product} />)}
      </ul>
   )
}

export default Cart