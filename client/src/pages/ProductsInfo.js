import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RatingBar from '../components/RatingBar'
import ProductReviews from '../components/ProductReviews'
import fetchJSON from '../utils/API'
import { useStoreContext } from '../utils/GlobalStore'

function ProductsInfo(){
    const [{ cart }, dispatch ] = useStoreContext()
    const { id } = useParams()
    const [ productData, setProductData ]= useState([])
    const [ productNum, setProductNum ]= useState(0)

    async function productLoad( id ){
        const { status, products, message }= await fetchJSON( `/api/products/${id}` )
        if( !status || products.length!==1 ){
            dispatch({ type: 'ALERT_MESSAGE', message })
            return
        }
        setProductData( products[0] )
   }

   function cartAdd(){
      console.log( '[cartAdd] called...' );
      // the component is re-rendered multiple times, so it triggers this dispatch twice
      dispatch({ type: 'CART_ADD', id, num: 1, ...productData })
   }

   useEffect( function(){
    // get the count of this item in the cart
    const cartItem = cart.filter(c=>c.id===id)
    if( cartItem.length===1 )
        setProductNum( cart.filter(c=>c.id===id)[0].num )
       
   }, [ cart ])
    // load only ONCE at component load
    useEffect( function(){
        productLoad( id )
    }, [] )

   return (
       <>
         <div class='row mt-3'>
            <div class='col-4'>
               <img src={productData.image} class='img-thumbnail' />
            </div>
            <div class='col-8'>
               <h1>{productData.heading}</h1>
               <h2>{productData.price}</h2>

               <h3><RatingBar rating={productData.rating} /></h3>

               {/* <ProductAction /> */}
               <button onClick={cartAdd} class="btn btn-lg btn-primary"><i class="fas fa-cart-plus"></i></button> ({productNum})

            </div>
            <p class="mx-3 mt-3">{productData.description}</p>
         </div>
         <ProductReviews id={productData.id} reviews={productData.reviews} />
      </>
   )
}

export default ProductsInfo