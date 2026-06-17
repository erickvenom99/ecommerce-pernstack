
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


let debounceTimer = null


//uploadcart and fetched cart functionality

export const uploadCart =  createAsyncThunk('cart/uploadCart', 
    async (payload, thunkAPI) => {
        try {
            
            clearTimeout(debounceTimer)
            const { cartItems } = thunkAPI.getState().cart;
            if (!cartItems || Object.keys(cartItems).length === 0) {
                return; 
            }
            const getToken  = payload?.getToken;
            if (typeof getToken !== 'function') {
                console.warn("uploadCart thunk skipped: getToken function was not passed or is stale.");
                return;
            }
            debounceTimer = setTimeout(async ()=> {
                const {cartItems} = thunkAPI.getState().cart;                                                                
                const token = await getToken();
                await axios.post('/api/cart', {cart: cartItems}, {headers: {Authorization: `Bearer ${token}`}})
            }, 1000)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)



//FETCH CART
export const fetchCart = createAsyncThunk('cart/fetchCart', async({getToken}, thunkAPI)=> {
    try {
        const token = await getToken()
        const {data} = await axios.get('/api/cart', {headers: {Authorization: `Bearer ${token}`}})
        return data    
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})


//cartSLice to add and remove from cart
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCart.fulfilled, (state, action)=>{
            const receivedCart = action.payload?.cart;

            if (Array.isArray(receivedCart) || !receivedCart) {
                state.cartItems = {};
                state.total = 0;
            } else {
                state.cartItems = receivedCart;
                state.total = Object.values(receivedCart).reduce((acc, item) => acc + item, 0);
            }
        })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
