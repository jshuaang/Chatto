import { createSlice } from "@reduxjs/toolkit";

const state = {
    menu: 'home'
}

const menuSlice = createSlice({
    name:"menu",
    initialState: state,
    reducers: {
        setMenu: (state, action) => {
            state.menu = action.payload
        }
    }
})

export const {setMenu} = menuSlice.actions

// selector
export const getMenu = state => state.menu.menu

export default menuSlice.reducer