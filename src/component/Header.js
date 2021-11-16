import React,{useState, useEffect} from 'react'
import { View, TextInput, Text, TouchableOpacity} from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { Avatar, Image } from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'

// redux
import { useSelector } from 'react-redux'
import { getPhotoProfile } from '../redux/reducer/UserReducer'

// firebase
import {db} from '../../firebase'

const Header = () => {
    const photoProfile = useSelector(getPhotoProfile)
    const [allUser, setAllUser] = useState([])
    const [userArr, setUserArr] = useState([])
    const [text, setText] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {
        db.collection('users').onSnapshot((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                setAllUser(allUser => [...allUser,{
                    email: doc.data().email,
                    photoProfile: doc.data().photoProfile,
                    username: doc.data().username
                }])
            })
        })
    }, [])

    useEffect(() => {
        if(text && text.length > 0){
            const users =  allUser.filter(user => {
                const regex = new RegExp(text, 'gi');
                return user.username.match(regex)
            });
            setUserArr(users)
        }else{
            setUserArr('')
        }
    }, [text])

    return (
        <View style={tw`w-full`}>
            <View style={tw`px-8 py-2 flex-row items-center border-b border-gray-100 justify-evenly`}>
                <Avatar 
                    rounded
                    source={{uri: photoProfile}}
                    containerStyle={tw`bg-gray-100`}
                />
                
                <TextInput 
                style={tw`bg-gray-100 py-2 px-4 my-1 mx-4 rounded-full flex-grow`} 
                placeholder="Search username.."
                onChangeText={(e) => {
                    setText(e)
                }}
                autoCapitalize="none"
                />

                <Image 
                    source={require('../assets/logo-chatto.png')}
                    style={{width:30, height:30}}
                />
            </View>
            <View style={tw`absolute top-16 w-1/2 left-1/4 z-50`}>
            {userArr ?
                userArr.map((res) => 
                <TouchableOpacity style={tw`bg-white border z-50 border-gray-100 py-2 px-4 w-full flex-row items-center`}
                    onPress={() => {
                        navigation.navigate('OtherProfileScreen',{email: res.email})
                    }}
                >
                    <Avatar 
                        source={{uri:res.photoProfile}}
                        size="small"
                        rounded
                        containerStyle={tw`mr-2`}
                    />
                    <Text>{res.username}</Text>
                </TouchableOpacity>) : null}
            </View>
        </View>
    )
}

export default Header
