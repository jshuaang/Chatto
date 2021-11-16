import React,{useState, useEffect} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {Icon, Image, Avatar} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import tw from 'tailwind-react-native-classnames'
import {db} from '../../firebase'
import firebase from 'firebase'
import {useSelector} from 'react-redux'
import {getEmail} from '../redux/reducer/UserReducer'


const OtherProfile = ({user}) => {
    const navigation = useNavigation()
    const dateOfBirth = moment(user?.dateOfBirth.seconds * 1000).format('LL')
    const createdAt = moment(user?.createdAt.seconds * 1000).format('MMM YYYY')
    const [followed, setFollowed] = useState(false)
    const selfEmail = useSelector(getEmail)

    useEffect(() => {
        for(let i=0; i<user?.follower.length ; i++){
            if(user?.follower[i] === selfEmail){
                setFollowed(true)
            }
        }
    }, [user])

    const follow = () => {
        if(!followed) {
            db.collection('users').where('email', '==', user?.email).get()
            .then((querySnapshot) => {
                querySnapshot.docs.map((doc) => {
                    db.collection('users').doc(doc.id).update({
                        follower: firebase.firestore.FieldValue.arrayUnion(selfEmail)
                    })
                })
            })
            db.collection('users').where('email', '==', selfEmail).get()
            .then((querySnapshot) => {
                querySnapshot.docs.map((doc) => {
                    db.collection('users').doc(doc.id).update({
                        following: firebase.firestore.FieldValue.arrayUnion(user?.email)
                    })
                    setFollowed(true)
                })
            })
        }else{
            db.collection('users').where('email', '==', user?.email).get()
            .then((querySnapshot) => {
                querySnapshot.docs.map((doc) => {
                    db.collection('users').doc(doc.id).update({
                        follower: firebase.firestore.FieldValue.arrayRemove(selfEmail)
                    })
                })
            })
            db.collection('users').where('email', '==', selfEmail).get()
            .then((querySnapshot) => {
                querySnapshot.docs.map((doc) => {
                    db.collection('users').doc(doc.id).update({
                        following: firebase.firestore.FieldValue.arrayRemove(user?.email)
                    })
                    setFollowed(false)
                })
            })
        }
    }

    const message = () => {
        db.collection('messages').where('users', 'array-contains', selfEmail)
        .onSnapshot((querySnapshot) => {
            if(querySnapshot.docs.length > 0){
                querySnapshot.docs.map((doc) => {
                    if(doc.data().users.find((email) => email === user.email)){
                        navigation.navigate('ChatScreen',{id:doc.id, email: user.email})
                    }
                })
            }else{
                db.collection('messages').add({
                    users: [selfEmail,user.email]
                }).then(res => {
                    querySnapshot.docs.map((doc) => {
                    if(doc.data().users.find((email) => email === user.email)){
                        navigation.navigate('ChatScreen',{id:doc.id, email: user.email})
                    }
                })
                })
            }
        })
    }

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
                        navigation.goBack('HomeScreen')
                    }}
                />
                <Image 
                    source={{uri: user?.photoHeader}}
                    style={{width:'100%' , height:'100%'}}
                />
            </View>

            {/* profile */}
            <View style={tw`border-b border-gray-100 py-2 px-6`}>
                <Avatar 
                    source={{uri: user?.photoProfile}}
                    rounded
                    size="large"
                    containerStyle={tw`bg-gray-200 border-4 border-white -mt-10 -ml-3`}
                />
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`font-bold text-lg mr-1`}>{user?.name}</Text>
                    {user?.verify ? <Image 
                        source={require('../assets/verified.png')}
                        style={{width:17, height:17}}
                    />: null}
                </View>
                <Text style={tw`text-gray-500`}>@{user?.username}</Text>
                <Text style={tw`text-gray-600 mt-1`}>{user?.bio}</Text>
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
                        onPress={() => navigation.navigate('FollowingScreen',{user: user?.following})}
                    >
                        <Text style={tw`font-bold text-gray-600 mr-2`}>{user?.following.length}<Text style={tw`font-semibold text-gray-500`}> Following</Text></Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                         onPress={() => navigation.navigate('FollowerScreen',{user: user?.follower})}
                    >
                        <Text style={tw`font-bold text-gray-600`}>{user?.follower.length}<Text style={tw`font-semibold text-gray-500`}> Follower</Text></Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`absolute top-4 right-5 flex-row items-center`}>
                    <TouchableOpacity style={tw`rounded-full  border border-gray-200 mr-2`}
                        onPress={message}
                    >
                        <Icon 
                            name="envelope-o"
                            type="font-awesome"
                            size={22}
                            color="#6b7280"
                            containerStyle={tw`py-2 px-2`}
                        />
                    </TouchableOpacity>

                    {followed ? 
                    <TouchableOpacity style={tw.style('rounded-full', 'py-2', 'px-4', 'w-24', {backgroundColor:'#329ba8'})}
                        onPress={follow}
                    >
                        <Text style={tw`font-semibold text-white text-center`}>Followed</Text>
                    </TouchableOpacity> : 
                    <TouchableOpacity style={tw`rounded-full py-2 px-4 w-24 border border-gray-200`}
                        onPress={follow}
                    >
                        <Text style={tw`font-semibold text-gray-500 text-center`}>Follow</Text>
                    </TouchableOpacity> }
                </View>
            </View>
        </>
    )
}

export default OtherProfile
