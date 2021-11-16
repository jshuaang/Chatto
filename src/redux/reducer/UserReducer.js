 import {createSlice} from '@reduxjs/toolkit'

const state = {
    name: null,
    username: null,
    email: null,
    dateOfBirth: null,
    createdAt: null,
    photoProfile: null,
    photoHeader: null,
    bio: null,
    verify: null,
}

 const userSlice = createSlice({
     name: "user",
     initialState: state,
     reducers: {
         setName: (state, action) => {
             state.name = action.payload
         },
         setUsername: (state, action) => {
             state.username = action.payload
         },
         setEmail: (state, action) => {
             state.email = action.payload
         },
         setDob: (state, action) => {
             state.dateOfBirth = action.payload
         },
         setCreatedAt: (state, action) => {
             state.createdAt = action.payload
         },
         setPhotoProfile: (state, action) => {
             state.photoProfile = action.payload
         },
         setPhotoHeader: (state, action) => {
             state.photoHeader = action.payload
         },
         setBio: (state, action) => {
             state.bio = action.payload
         },
         setVerify: (state, action) => {
             state.verify = action.payload
         }
     }
 })

 export const {setName, setUsername, setEmail, setDob, setCreatedAt, setPhotoProfile, setPhotoHeader, setBio, setVerify} = userSlice.actions

//  selector

export const getName = state => state.user.name
export const getUsername = state => state.user.username
export const getEmail = state => state.user.email
export const getDob = state => state.user.dateOfBirth
export const getCreatedAt = state => state.user.createdAt
export const getPhotoProfile = state => state.user.photoProfile
export const getPhotoHeader = state => state.user.photoHeader
export const getBio = state => state.user.bio
export const getVerify = state => state.user.verify


 export default userSlice.reducer