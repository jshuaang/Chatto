import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { getEmail } from '../redux/reducer/UserReducer'
import {useCollection} from 'react-firebase-hooks/firestore'
import {db} from '../../firebase'
import{useNavigation} from '@react-navigation/native'

const Message = ({id,users}) => {
    const [lastMessage, setLastMessage] = useState(null)
    const navigation = useNavigation()
    const email = useSelector(getEmail)
    const userEmail = users.find((user) => user != email)
    const [photoProfile, setPhotoProfile] = useState(null)

    const [userProfile] = useCollection(db.collection('users').where('email', '==', userEmail))
    const [lastMessageSnapshot] = useCollection(db.collection('messages').doc(id).collection('message').orderBy('timestamp','desc'))

    useEffect(() => {
        setLastMessage(lastMessageSnapshot?.docs[0]?.data().message)
    }, [lastMessageSnapshot])

    useEffect(() => {
        userProfile?.docs.map((doc) => {
            setPhotoProfile(doc.data().photoProfile)
        })
    }, [userProfile])

    return (
        <TouchableOpacity style={tw`py-3 px-5 border-b border-gray-100 flex-row items-center`}
            onPress={() => navigation.navigate('ChatScreen',{id: id, email: userEmail})}
        >
            <Avatar 
                source={{uri: photoProfile}}
                rounded
                size="medium"
                containerStyle={tw`bg-gray-100`}
            />
            <View style={tw`ml-2`}>
                <Text style={tw`text-lg font-bold`}>{userEmail}</Text>
                <Text style={tw`text-gray-500`}>{lastMessage || '...'}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Message
