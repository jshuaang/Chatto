import React, { useEffect, useState } from 'react'
import { ScrollView, View, LogBox} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'

// component
import {Header, Footer, Post, ButtonPost} from '../component'

// redux
import {setCreatedAt, setDob, setEmail, setName, setUsername, setPhotoHeader, setPhotoProfile, setBio, setVerify, getName, getPhotoProfile, getUsername, getVerify} from '../redux/reducer/UserReducer'
import { useDispatch, useSelector } from 'react-redux';

// firebase
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth, db} from '../../firebase'


const HomeScreen = () => {
    LogBox.ignoreLogs(['Setting a timer']);
    const dispatch = useDispatch()
    const navigation = useNavigation()

    // users
    const [user] = useAuthState(auth)
    const [userSnapshot] = useCollection(db.collection('users').doc(user?.uid))
    const userProfile = userSnapshot?.data()
    const username = useSelector(getUsername)
    const name = useSelector(getName)
    const photoProfile = useSelector(getPhotoProfile)
    const verify = useSelector(getVerify)

    if(userProfile?.photoProfile === null && userProfile?.photoHeader === null){
        navigation.navigate('SetPhotoScreen')
    }

    // following
    let following =[]
    const [followingSnapshot] = useCollection(db.collection('users').where('follower', 'array-contains', user?.email))
    followingSnapshot?.docs.map((doc) => {
        following.push(doc.data())
    })

    useEffect(() => {
        dispatch(setName(userProfile?.name))
        dispatch(setUsername(userProfile?.username))
        dispatch(setEmail(userProfile?.email))
        dispatch(setDob(userProfile?.dateOfBirth.seconds))
        dispatch(setCreatedAt(userProfile?.createdAt.seconds))
        dispatch(setBio(userProfile?.bio))
        dispatch(setPhotoHeader(userProfile?.photoHeader))
        dispatch(setPhotoProfile(userProfile?.photoProfile))
        dispatch(setVerify(userProfile?.verify))
    }, [userProfile, user])

    // posts
    const [postSnapshot] = useCollection(db.collection('posts').orderBy('timestamp', 'desc'))
    
    return (
        <SafeAreaView style={tw`flex-col h-full bg-white`}>
            <Header />
            <View style={tw`h-40 flex-grow`}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    {
                        postSnapshot?.docs.map(doc => {
                        const data = doc.data()
                        if(data.email === user.email){
                            return(
                                <Post key={doc.id} id={doc.id} name={name} username={username} post={data.post} loves={data.loves.length} totalComments={data.totalComments} photoProfile={photoProfile} time={data.timestamp} verify={verify} emailUser={user.email} image={data.photo}/>
                            )
                        }
        
                        for(let i=0; i<following.length; i++){
                            if(data.email === following[i].email){
                                return(
                                    <Post key={doc.id} id={doc.id} name={following[i].name} username={following[i].username} post={data.post} loves={data.loves.length} totalComments={data.totalComments} photoProfile={following[i].photoProfile} time={data.timestamp} verify={following[i].verify} emailUser={following[i].email} image={data.photo}/>
                                )
                            }
                        }
                    })
                    }
                </ScrollView>
                <ButtonPost />
            </View>
            <Footer />
        </SafeAreaView>
    )
}

export default HomeScreen
