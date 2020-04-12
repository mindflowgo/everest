import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useGlobalStore } from "./GlobalStore";
import API from "./API";

function ProductListPage( props ){
    const [ globalData, dispatch ] = useGlobalStore();
    const [ products, setProducts ]= useState([]);
    
    // load only ONCE at component load
    useEffect( function(){
        loadProducts();
    }, [] );

    async function loadProducts(){
        const apiProducts = await API.get('/api/product/list');
        
        if( apiProducts.error ){
            dispatch( { do: 'setMessage', type: 'danger', message: apiProducts.error } );
            return;
        }
        
        setProducts( apiProducts );
    }

    return (
        <div class="row">
        {products.map( product=><ProductCard {...product} />)}
        </div>
    )
}

export default ProductListPage;
