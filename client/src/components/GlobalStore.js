import React, { useContext, useReducer } from "react";

/*
{
    cart: [ { id, num, price }]
}


*/
const GlobalData = React.createContext();

function dispatcher(state,action){
    let newState = {...state};
    switch( action.do ){
        /* { type: "addToCart", id: [product-id], num: [# product], price} */
        case 'addToCart':
            // check if item already exists in the cart
            const cartItemIdx = newState.cart.findIndex( item=>item.id===action.id );
            if( cartItemIdx>-1 ){
                console.log( `[dispatcher:${action.type}] cart.num(${newState.cart[cartItemIdx].num}) += (${action.num})` );
                newState.cart[cartItemIdx].num += action.num;
            } else {
                newState.cart.push( { ...action } );
            }
            console.log( `[GlobalStore:addToCart] id(${action.id}) cartItemIdx(${cartItemIdx})`, newState );
            return newState;

        case 'setMessage':
            newState.messageType = action.type;
            newState.message = action.message;
            console.log( `[GlobalStore:setMessage] set our message: ${action.message}` );
            return newState;
        
        case 'clearMessage':
            newState.messageType = ''; newState.message = '';
            return newState;

        case 'loginState':
            newState.loggedIn = action.loggedIn;
            return newState;

        
        default:
            console.log( `crap sorry, dunno what to do: ${action.do}` );
        break;
    }
}

function GlobalStore( props ){
    const [ globalData, dispatch ]= useReducer( dispatcher, 
        { messageType: '', message: '', serverStatus: '', loggedIn: false,cart: [] } );
    
    return (
        <GlobalData.Provider value={[ globalData, dispatch ]} {...props} />
    )
}

function useGlobalStore(){
    return useContext(GlobalData);
}

export { GlobalStore, useGlobalStore };