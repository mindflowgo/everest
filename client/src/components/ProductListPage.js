import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

function ProductListPage( props ){
    const [ products, setProducts ]= useState([]);

    // load only ONCE at component load
    useEffect( function(){
        loadProducts();
    }, [] );

    async function loadProducts(){
        const apiProducts = await fetch('/api/product/list').then( result=>result.json() );
        setProducts( apiProducts );
    }

    return (
        <div class="row">
        {products.map( product=><ProductCard {...product} />)}
        </div>
    )
}

export default ProductListPage;
