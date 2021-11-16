import React,{useState} from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Icon} from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'
import firebase from 'firebase'
import { useSelector } from 'react-redux'
import {getEmail} from '../redux/reducer/UserReducer'
import {db} from '../../firebase'
import {useCollection} from 'react-firebase-hooks/firestore'
import moment from 'moment'

const ChatScreen = (props) => {
    const [message, setMessage] = useState(null)
    const navigation = useNavigation()
    const id = props.route.params.id
    const userEmail = props.route.params.email
    const email = useSelector(getEmail)

    const [messageSnapshot] = useCollection(db.collection('messages').doc(id).collection('message').orderBy('timestamp','asc'))

    const addMessage = () => {
        db.collection('messages').doc(id).collection('message').add({
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: email
        })
        setMessage('')
    }


    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            {/* header */}
            <View style={tw`flex-row items-center border-b border-gray-100 py-2 px-5`}>
                <Icon 
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color={'#4b5563'}
                    onPress={() => navigation.navigate('MessageScreen')}
                />
                <Text style={tw`text-gray-600 font-bold text-2xl ml-10`}>{userEmail}</Text>
            </View>

            {/* chat */}
            <View style={tw`flex-grow h-40`}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    {
                        messageSnapshot?.docs.map((doc) => {
                            const data = doc?.data()
                            const time = data.timestamp ? data.timestamp.seconds * 1000 : new Date()
                            if(data.user === email){
                                return(
                                    <View style={tw`bg-blue-100 mr-5 ml-auto py-1 px-2 rounded-xl my-1`}>
                                        <Text style={tw`text-lg`}>{data.message}</Text>
                                        <Text style={tw`text-xs text-right`}>{moment(time).format('LT')}</Text>
                                    </View>
                                )
                            }else{
                                return(
                                    <View style={tw`bg-gray-100 ml-5 mr-auto py-1 px-2 rounded-xl my-1`}>
                                        <Text style={tw`text-lg`}>{data.message}</Text>
                                        <Text style={tw`text-xs text-left`}>{moment(time).format('LT')}</Text>
                                    </View>
                                )
                            }
                        }
                        )
                    }
                </ScrollView>
            </View>

            {/* footer */}
            <View>
                 <View style={tw`bg-gray-100 p-2  flex-row items-center`}>
                <TextInput 
                    placeholder="Add new message..."
                    style={tw`bg-white py-1 px-4 rounded-full flex-grow`}
                    onChangeText={(e) => setMessage(e)}
                    value={message}
                />
                <TouchableOpacity
                    onPress={addMessage}
                >
                    <Icon 
                        name="paper-plane"
                        type="font-awesome"
                        style={tw`py-1 px-2`}
                        color="#329ba8"
                    />
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
    )
}

export default ChatScreen
