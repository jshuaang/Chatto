import React, { useState } from 'react'
import { ScrollView, TextInput, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Footer from '../component/Footer'
import tw from 'tailwind-react-native-classnames'
import Message from '../component/Message'
import {db} from '../../firebase'
import {useCollection} from 'react-firebase-hooks/firestore'
import { useSelector } from 'react-redux'
import { getEmail } from '../redux/reducer/UserReducer'

const MessageScreen = () => {
    const email = useSelector(getEmail)
    const [messageSnapshot] = useCollection(db.collection('messages').where('users', 'array-contains', email))
    
    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <ScrollView style={tw`flex-grow`}>
                {messageSnapshot?.docs.map((doc) => 
                    <Message key={doc.id} id={doc.id} users={doc.data().users} />
                )}
            </ScrollView>
            <Footer /> 
        </SafeAreaView>
    )
}

export default MessageScreen
