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
      dispatch({ type: 'ALERT_MESSAGE', message })
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


   async function tasksSave( e ){
      e.preventDefault()

      const newTask = inputRef.current.value
      // clear input
      inputRef.current.value = ''

      const { status, products: userProducts, message }= await fetchJSON( '/api/products', 'post', { task: newTask } )
      if( !status ){
         dispatch({ type: 'ALERT_MESSAGE', message })
         return
      }

      dispatch({ type: 'UPDATE_PRODUCTS', products: userProducts, message })
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

            <div class="card-footer">
               <div class="input-group">
                  <input ref={inputRef} type="text" class="form-control" placeholder='New Task...' />
                  <button onClick={tasksSave} disabled={alert.length>0} class="btn btn-primary">Save</button>
               </div>
            </div>
         </div>
      </form>
   )
}

export default Products