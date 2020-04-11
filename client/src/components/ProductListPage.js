import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import API from "./API";

function ProductListPage( props ){
    const [ products, setProducts ]= useState([]);

    // load only ONCE at component load
    useEffect( function(){
        loadProducts();
    }, [] );

    async function loadProducts(){
        const apiProducts = await API.get('/api/product/list');
        setProducts( apiProducts );
    }

    return (
        <div class="row">
        {products.map( product=><ProductCard {...product} />)}
        </div>
    )
}

export default ProductListPage;
