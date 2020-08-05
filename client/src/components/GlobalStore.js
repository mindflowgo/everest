import React, { useContext, useReducer } from "react";

// default global store
const defaultGlobalStore = { messageType: '', message: '', serverStatus: '', loggedIn: false, cart: [] }

const GlobalData = React.createContext()

let lastDispatcher = { do: '', time: 0 }

function dispatcher(state,actionList){
    console.log( `[dispatcher] called with`, actionList, state )
    let newState = { ...state, time: Date.now() }
    // Seems react useReducer can run multiple times if it thinks something has changed 
    // see: https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice
    if( JSON.stringify(actionList.do)===lastDispatcher.do && (Date.now()-lastDispatcher.time)<1000 ){
        console.log( `.. dispatch times too close for ${actionList.do}; ignoring it.` )
        return newState
    }
    lastDispatcher = { do: JSON.stringify(actionList.do), time: Date.now() }
        
    // loop through the action set and do the changes
    actionList.forEach( action=>{
        switch( action.do ){
            /* { type: "addToCart", id: [product-id], num: [# product], price} */
            case 'addToCart':
                // check if item already exists in the cart
                const cartItemIdx = newState.cart.findIndex( item=>item.id===action.id )
                if( cartItemIdx>-1 ){
                    console.log( `[dispatcher:${action.do}] cart.num(${newState.cart[cartItemIdx].num}) += (${action.num})` )
                    newState.cart[cartItemIdx].num += action.num
                } else {
                    newState.cart.push( { ...action } )
                }
                console.log( `[GlobalStore:addToCart] id(${action.id}) cartItemIdx(${cartItemIdx})`, newState )
                break

            case 'setMessage':
                newState.messageType = action.type
                newState.message = action.message
                console.log( `[GlobalStore:setMessage] set our message: ${action.message}` )
                break
            
            case 'clearMessage':
                newState.messageType = ''
                newState.message = ''
                break

            case 'loginState':
                newState.loggedIn = action.loggedIn
                if( action.loggedIn===false ) // clear the globalData on logout
                    newState = { ...defaultGlobalStore }
                break

            case 'setUserData':
                newState = {...newState, ...action.data }
                break

            default:
                console.log( `[ERROR] Sorry, unknown do-action: ${action.do}` )
                break
        }
    })
    return newState
}

function GlobalStore( props ){
    const [ globalData, dispatch ]= useReducer( dispatcher, defaultGlobalStore );
    
    return (
        <GlobalData.Provider value={[ globalData, dispatch ]} {...props} />
    )
}

function useGlobalStore(){
    return useContext(GlobalData);
}

export { GlobalStore, useGlobalStore };