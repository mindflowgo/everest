import React, { useEffect, useRef } from 'react'
import { useStoreContext } from '../utils/GlobalStore'
import fetchJSON from '../utils/API'
import ProductCard from '../components/ProductCard'

function Products() {
  const [{ alert, products, name }, dispatch ]= useStoreContext()

  const inputRef = useRef()

  async function productsLoad(){
    const { status, products: userProducts, message }= await fetchJSON( '/api/products' )
    console.log( `[productsLoad] status(${status}) message(${message}) userProducts:`, userProducts )
    if( !status ){
      dispatch({ type: 'USER_LOGOUT', message })
      return
    }

    // update tasks list
    dispatch({ type: 'UPDATE_PRODUCTS', products: userProducts })
   }

  function cartAdd( e, id, num ){
    e.preventDefault()
    // the component is re-rendered multiple times, so it triggers this dispatch twice
    dispatch({ type: 'CART_ADD', id, num })
  }

  // on load get the list
  useEffect( function(){
    console.log( `[Products] mount`)
    productsLoad()
  }, [] )

   return (
      <form>
         <div class="card">
            <div class="card-header">
               <h1>{name}'s Product List</h1>
            </div>
            <div class="card-body row">
               {products && products.map( product=><ProductCard cartAdd={cartAdd} {...product} />)}
            </div>
         </div>
      </form>
   )
}

export default Products