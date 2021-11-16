import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import {Avatar, Icon, Image} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'

// firebase
import {auth, db} from '../../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'

// reducer
import {getName, getUsername, getDob, getCreatedAt, getPhotoHeader, getPhotoProfile, getBio, getVerify} from '../redux/reducer/UserReducer'
import {setMenu} from '../redux/reducer/MenuReducer'
import { useDispatch, useSelector } from 'react-redux'

const Profile = () => {
    const [user] = useAuthState(auth)
    const [userSnapshot] = useCollection(db.collection('users').doc(user?.uid))
    const userProfile = userSnapshot?.data() 
    const dispatch = useDispatch()
    const navigation = useNavigation()

    // get user info
    const name = useSelector(getName)
    const username = useSelector(getUsername)
    const bio = useSelector(getBio)
    const dateOfBirth = moment(new Date (useSelector(getDob) * 1000)).format('LL')
    const createdAt = moment(new Date (useSelector(getCreatedAt)*1000)).format('MMM YYYY')
    const header = useSelector(getPhotoHeader)
    const photoProfile = useSelector(getPhotoProfile)
    const verify = useSelector(getVerify)
    return (
        <>
            {/* bg-image */}
            <View style={tw`bg-gray-800 h-36`}>
                <Icon 
                    name="long-arrow-left"
                    type="font-awesome"
                    color='#fff'
                    containerStyle={tw`absolute top-2 left-3 z-50 bg-gray-800 opacity-50 p-1 rounded-full`}
                    onPress={() =>{
                        dispatch(setMenu('home'))
                        navigation.navigate('HomeScreen')
                    }}
                />
                <Image 
                    source={{uri: header}}
                    style={{width:'100%' , height:'100%'}}
                />
                <TouchableOpacity style={tw`absolute top-2 right-3 p-1 px-2 rounded-full bg-gray-800 opacity-50`}
                    onPress={() =>{
                        auth.signOut()
                        navigation.navigate('Login')
                    }}
                >
                    <Text style={tw`text-white font-bold`}>Log out</Text>
                </TouchableOpacity>
            </View>

            {/* profile */}
            <View style={tw`border-b border-gray-100 py-2 px-6`}>
                <Avatar 
                    source={{uri: photoProfile}}
                    rounded
                    size="large"
                    containerStyle={tw`bg-gray-200 border-4 border-white -mt-10 -ml-3`}
                />
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`font-bold text-lg mr-1`}>{name}</Text>
                    {verify ? <Image 
                        source={require('../assets/verified.png')}
                        style={{width:17, height:17}}
                    />: null}
                </View>
                <Text style={tw`text-gray-500`}>@{username}</Text>
                <Text style={tw`text-gray-600 mt-1`}>{bio}</Text>
                {/* detail */}
                <View style={tw`mt-1 flex-row`}>
                    <View style={tw`flex-row mr-2`}>
                        <Icon name="map-marker" type="font-awesome" size={16} color='#6b7280' />
                        <Text style={tw`ml-1 text-gray-500`}>Indonesia</Text>
                    </View>
                     <View style={tw`flex-row`}>
                        <Icon name="birthday-cake" type="font-awesome" size={14} color='#6b7280' />
                        <Text style={tw`ml-1 text-gray-500`}>{dateOfBirth}</Text>
                    </View>
                </View>
                <View style={tw`flex-row mt-1`}>
                    <Icon name="calendar-check-o" type="font-awesome" size={14} color='#6b7280' />
                    <Text style={tw`ml-1 text-gray-500`}>Joined {createdAt}</Text>
                </View>
                <View style={tw`flex-row mt-2`}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('FollowingScreen',{user: userProfile?.following})}
                    >
                        <Text style={tw`font-bold text-gray-600 mr-2`}>{userProfile?.following.length}<Text style={tw`font-semibold text-gray-500`}> Following</Text></Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('FollowerScreen',{user: userProfile?.follower})}
                    >
                        <Text style={tw`font-bold text-gray-600`}>{userProfile?.follower.length}<Text style={tw`font-semibold text-gray-500`}> Follower</Text></Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={tw`rounded-full absolute top-4 right-5 p-2 border border-gray-200`}
                    onPress={() => {navigation.navigate('EditProfileScreen')}}
                >
                    <Text style={tw`font-semibold`}>Edit profile</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Profile
