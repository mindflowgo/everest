import React, { createContext, useReducer, useContext } from 'react'

// any variables we depend on for UI/flow we must pre-set
const initialData = {
   authOk: false, name: '', thumbnail: '', products: [], alert: '', cart: []
}

/*! IMPORTANT all your reducer functionality goes here */
const dataReducer = (state, action) => {
   switch (action.type) {
   case 'USER_LOGIN':
      return { ...state, ...action.data, alert: action.message || '', authOk: true }
   case 'USER_LOGOUT':
      return { ...initialData, alert: action.message || '' }
   case 'ALERT_MESSAGE':
      return { ...state, alert: action.message }
   case 'ALERT_CLEAR':
      return { ...state, alert: '' }
   case 'UPDATE_PRODUCTS':
      return { ...state, products: action.products, alert: action.message || '' }
    case 'CART_ADD':
      let updatedCart =[ ...state.cart ]
      const { id, num }= action
      const idx = updatedCart.findIndex( c=>c.id===id )
      if( idx>-1 )
        updatedCart[idx].num++
      else
        updatedCart.push({ id, num })
      console.log( `[CART_ADD] adding ${id} num(${num}) state.cart:`, updatedCart )
      return { ...state, cart: updatedCart }  
   default:
      console.log(`Invalid action type: ${action.type}`)
      return state
   }
}



const StoreContext = createContext()

const useStoreContext = function(){
   return useContext(StoreContext)
}

const StoreProvider = function(props){
   const [state, dispatch] = useReducer( dataReducer, initialData )
   return <StoreContext.Provider value={[state, dispatch]} {...props} />
}

export { StoreProvider, useStoreContext }