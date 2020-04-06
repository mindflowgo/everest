import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RatingBar from "./RatingBar";
import ProductReviews from "./ProductReviews";
import { useGlobalStore } from "./GlobalStore";

function ProductInfoPage( props ){
    const { id } = useParams();
    const [ showProduct, setShowProduct ]= useState([]);
    const [ globalData, dispatch ] = useGlobalStore();

    // load only ONCE at component load
    useEffect( function(){
        loadProduct( id );
    }, [] );

    async function loadProduct( id ){    
        const apiProduct = await fetch(`/api/product/${id}`).then( result=>result.json() );
        setShowProduct( apiProduct );
    }

    function addToCart(e){
        e.preventDefault();
        
        dispatch({ 
            type: 'addToCart', id, num: 1, ...showProduct });
    }

    return (
        <div class='container'>
            <div class='row'>
                <div class='col-4'>
                    <img src={showProduct.image} class='img-thumbnail' />
                </div>
                <div class='col-8'>
                    <h1>{showProduct.heading}</h1>
                    <h2>{showProduct.price}</h2>

                    <h3><RatingBar rating={showProduct.rating} /></h3>

                    {/* <ProductAction /> */}
                    <button onClick={addToCart} class="btn btn-lg btn-primary"><i class="fas fa-cart-plus"></i></button>
                    
                </div>
                {showProduct.description}
            </div>
            <ProductReviews id={showProduct.id} reviews={showProduct.reviews} />                
        </div>
    )
}

export default ProductInfoPage;