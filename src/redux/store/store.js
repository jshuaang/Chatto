import {configureStore} from '@reduxjs/toolkit'

import MenuReducer from '../reducer/MenuReducer'
import UserReducer from '../reducer/UserReducer'

const store = configureStore({
    reducer: {
        menu: MenuReducer,
        user: UserReducer
    }
})

export default store