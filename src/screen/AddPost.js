import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Avatar, Icon, Image } from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { getPhotoProfile, getEmail } from '../redux/reducer/UserReducer'
import {db, storage, auth} from '../../firebase'
import firebase from 'firebase/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import * as ImagePicker from 'expo-image-picker'

const AddPost = () => {
    const [user] = useAuthState(auth)
    const [post, setPost] = useState(null)
    const [imagePost, setImagePost] = useState(null)
    const navigation = useNavigation()
    const photoProfile = useSelector(getPhotoProfile)
    const [loading, setLoading] = useState(false)

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        })

        if(!result.cancelled){
            setImagePost(result.uri)
        }
    }

    const submitPost = async() => {
        setLoading(true)

        if(imagePost){
            const ref = storage.ref()
            const image  = await fetch(imagePost)
            const blob  = await image.blob()
            const metadata = {
                contentType: 'image/jpg'
            }
            ref.child(`${user?.email}/post/`+imagePost).put(blob, metadata).then(data=>{
                storage.ref(`${user?.email}/post/`+imagePost).getDownloadURL().then(res => {
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        email: user?.email,
                        post: post,
                        loves:[],
                        totalComments: 0,
                        photo: res
                    })
                    .then(res => {
                        setLoading(false)
                        navigation.navigate('HomeScreen')
                    })
                })
            })
        }else{
            db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        email: user?.email,
                        post: post,
                        loves:[],
                        totalComments: 0,
                        photo: null
                    })
                    .then(res => {
                        setLoading(false)
                        navigation.navigate('HomeScreen')
                    })
        }
    }

    return (
        <SafeAreaView style={tw`bg-white h-full flex-col`}>
            {loading ? 
            <OrientationLoadingOverlay
                        visible={true}
                        color="white"
                        indicatorSize="large"
                        messageFontSize={24}
                        message="Loading..."
            /> : null }
            <View style={tw`p-2 flex-row items-center justify-between px-5 border-b border-gray-300`}>
                <Icon 
                    name="times"
                    type="font-awesome"
                    size={26}
                    color={'#3d3d3d'}
                    onPress={() => {navigation.navigate('HomeScreen')}}
                />
                <TouchableOpacity style={tw.style('rounded-full','py-2','px-5',{backgroundColor:'#329ba8'})}
                    onPress={submitPost}
                >
                    <Text style={tw`text-white font-bold text-lg`}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`p-2 flex-row`}>
                <Avatar
                    rounded 
                    source={{uri: photoProfile}}
                    size="medium"
                    containerStyle={tw`bg-gray-100 mr-2`}
                />
                <TextInput 
                    style={tw`flex-grow text-lg`}
                    placeholder="What's happening?"
                    onChangeText={(e) => {setPost(e)}}
                />
            </View>
            <View style={tw`mt-20`}>
                <Image 
                    source={{uri: imagePost}}
                    style={{width:'100%', height:200}}
                />
                <TouchableOpacity
                    onPress={pickImage}
                >
                    <Text style={tw`text-blue-400 p-2 text-center`}>Add image</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView> 
    )
}

export default AddPost
