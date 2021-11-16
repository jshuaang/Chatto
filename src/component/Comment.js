import moment from 'moment'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import {Image} from 'react-native-elements'
import { Avatar, Icon} from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import {db} from '../../firebase'
import firebase from 'firebase'
import {useSelector} from 'react-redux'
import {getEmail} from '../redux/reducer/UserReducer'
import {useNavigation} from '@react-navigation/native'

const Comment = ({docId, commentId ,name, comment, photoProfile, username, loves, verify, timestamp, emailUser}) => {
    const navigation = useNavigation() 
    const [liked, setLiked] = useState(false)
    const email = useSelector(getEmail)

    const commentTime = timestamp ? moment(timestamp.seconds * 1000) : new Date ()
    const currTime = moment(new Date ())

    const minuteTime = currTime.diff(commentTime, 'minutes')
    const hourTime = currTime.diff(commentTime, 'hours')
    const dayTime = currTime.diff(commentTime, 'days')
    const monthTime = currTime.diff(commentTime, 'months')
    const oldTime = timestamp ? moment(timestamp.seconds * 1000).format('L') : null
    let time

    if(minuteTime >= 0 && minuteTime <=60){
        time = minuteTime +'m'
    }
    else if(hourTime > 0 && hourTime <= 24){
        time = hourTime + 'h'
    }
    else if(dayTime > 0 && dayTime <= 31){
        time = dayTime + 'd'
    }
    else if(monthTime > 0 && monthTime <= 12 ){
        time = monthTime + 'm'
    } 
    else{
        time = oldTime
    }

    db.collection('posts').doc(docId).collection('comments').doc(commentId).onSnapshot((data) => {
        if(data.data().loves.length > 0){
            data.data().loves.map(res => {
                if(res === email){
                    setLiked(true)
                }
            })
        }
    })

    return (
        <View style={tw`py-2 px-6 border-b border-gray-100`} >
            <View style={tw`flex-row`}>
                <Avatar 
                    rounded
                    source={{uri: photoProfile}}
                    size="medium"
                    containerStyle={tw`bg-gray-100`}
                    onPress={() => {
                        if(emailUser === email){
                            navigation.navigate('UserProfileScreen')
                        }else{
                            navigation.navigate('OtherProfileScreen',{email:emailUser})
                        }
                    }}
                />
                <View style={tw`ml-2 flex-grow`}>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`font-bold mr-1`}>{name}</Text>
                        {verify ? <Image 
                            source={require('../assets/verified.png')}
                            style={{width:14, height:14}}
                            containerStyle={tw`mr-1`}
                        /> : null}
                        <Text style={tw`text-gray-500 mr-1`}>@{username} ·</Text>
                        <Text style={tw`text-gray-500`}>{time}</Text>
                    </View>
                    <Text>{comment}</Text>
                    <View style={tw`flex-row mt-1`}>
                        <TouchableOpacity style={tw`flex-row items-center`}
                            onPress={
                                () => {
                                    liked ? 
                                    db.collection('posts').doc(docId).collection('comments').doc(commentId).update({
                                        loves: firebase.firestore.FieldValue.arrayRemove(email)
                                    }).then( res => setLiked(false)) : 
                                    db.collection('posts').doc(docId).collection('comments').doc(commentId).update({
                                        loves: firebase.firestore.FieldValue.arrayUnion(email)
                                    }).then( res => setLiked(true)) 
                                }
                            }
                        >
                            {liked ? 
                            <Icon 
                                name="heart"
                                type="font-awesome"
                                size={12}
                                color="#ff496c"
                            /> : 
                            <Icon 
                                name="heart-o"
                                type="font-awesome"
                                size={12}
                                color="#6b7280"
                            />
                            }
                            <Text style={tw`text-gray-500 text-sm ml-1`}>{loves}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Comment
