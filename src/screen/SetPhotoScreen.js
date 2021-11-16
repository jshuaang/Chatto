import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {Image, Avatar} from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../utils/Storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from '../../firebase'
import {useNavigation} from '@react-navigation/native'

const SetPhotoScreen = () => {
    const navigation = useNavigation()
    const [user] = useAuthState(auth)
    const [header, setHeader] = useState(null)
    const [photoProfile, setPhotoProfile] = useState(null)

    const pickImage = async(type) => {
        if(type === 'header'){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,2],
                quality: 1,
            })

            if(!result.cancelled){
                setHeader(result.uri)
            }
        }
        if(type === 'photoProfile'){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,4],
                quality: 1,
            })

            if(!result.cancelled){
                setPhotoProfile(result.uri)
            }
        }
    }

    const setPhoto = () => {
        uploadImage(user?.email, 'header', header, user?.uid)
        uploadImage(user?.email,'profilePic', photoProfile, user?.uid)
        navigation.navigate('HomeScreen')
    }

    return (
        <SafeAreaView>
            <View style={tw`my-4`}>
                <Text style={tw`text-gray-600 font-bold text-center text-3xl`}>Welcome</Text>
                <Text style={tw`text-gray-500 font-bold text-center text-lg`}>Set up your photo</Text>
            </View>
            {/* header */}
            <TouchableOpacity style={tw`bg-gray-800 h-40`}
                onPress={() => pickImage('header')}
            >
                <Image 
                    source={{uri: header}}
                    style={{width:'100%' , height:'100%'}}
                />
                <View style={tw`absolute bottom-0 w-full bg-gray-200 opacity-60`}>
                    <Text style={tw`text-white text-center`}>Add Header</Text>
                </View>
            </TouchableOpacity>
            {/* profil pic */}
            <View style={tw`w-full p-5`}>
                <TouchableOpacity style={tw`m-auto`}
                    onPress={() => pickImage('photoProfile')}
                >
                    <Avatar 
                        source={{uri: photoProfile}}
                        rounded
                        size="large"
                        containerStyle={tw`bg-gray-100`}
                    />
                    <Text style={tw`text-center text-blue-300`}>Add photo</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={tw.style({backgroundColor:'#329ba8'},'p-2','rounded-full mx-5 mt-5')}
                onPress={setPhoto}
            >
                <Text style={tw`text-white text-center text-lg`}>Set photo</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default SetPhotoScreen
