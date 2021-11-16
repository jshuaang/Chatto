import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar, Icon, Image } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import moment from 'moment'
import {db} from '../../firebase'
import firebase from 'firebase'
import {getEmail} from '../redux/reducer/UserReducer'
import { useSelector } from 'react-redux'
import {useNavigation} from '@react-navigation/native'

const Post = ({id, name,username,post, totalComments, loves, photoProfile, time ,verify, emailUser, image}) => {
    let postTime = moment(time  ? time.seconds * 1000 : new Date())
    let currTime = moment(new Date ())
    let diffTime = currTime.diff(postTime, 'hours') 
    let timeResult
    if(diffTime > 0 && diffTime <= 24){
        timeResult = diffTime + 'h'
    }else if(diffTime > 24){
        timeResult = currTime.diff(postTime, 'days') + 'd'
    }else{
        timeResult = currTime.diff(postTime, 'minutes') + 'm'
    }

    const navigation = useNavigation()
    const email = useSelector(getEmail)
    const [liked, setLiked] = useState(false)
    db.collection('posts').doc(id).onSnapshot((data) => {
        if(data.data().loves.length > 0){
            data.data().loves.map(res => {
                if(res === email){
                    setLiked(true)
                }
            })
        }
    })

    const detailPost = {
        id:id,
        name: name,
        username: username,
        post: post,
        loves: loves,
        totalComments: totalComments,
        photoProfile: photoProfile,
        time: time,
        verify: verify,
        email: emailUser,
        image: image
    }
    
    return (
        <TouchableOpacity style={tw`py-2 px-8 border-b border-gray-100`} 
            onPress={() => {
                navigation.navigate('DetailPostScreen',{detail: detailPost})
            }}
        >
            <View style={tw`flex-row`}>
                <Avatar 
                    rounded
                    source={{uri: photoProfile}}
                    size="medium"
                    containerStyle={tw`bg-gray-100`}
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
                        <Text style={tw`text-gray-500`}>{timeResult}</Text>
                    </View>
                    <Text>{post}</Text>
                    {/* image */}
                    <View style={tw`bg-gray-100`}>
                        {image?
                        <Image 
                            source={{uri:image}}
                            style={{width:'100%', height:200}}
                        /> : null}
                    </View>

                    <View style={tw`flex-row mt-1`}>
                        <View style={tw`flex-row items-center mr-3`}>
                            <Icon 
                                name="comment-o"
                                type="font-awesome"
                                size={12}
                                color="#6b7280"
                            />
                            <Text style={tw`text-gray-500 text-sm ml-1`}>{totalComments}</Text>
                        </View>
                        <TouchableOpacity style={tw`flex-row items-center`}
                            onPress={
                                () => {
                                    liked ? 
                                    db.collection('posts').doc(id).update({
                                        loves: firebase.firestore.FieldValue.arrayRemove(email)
                                    }).then( res => setLiked(false)) : 
                                    db.collection('posts').doc(id).update({
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
        </TouchableOpacity>
    )
}

export default Post
