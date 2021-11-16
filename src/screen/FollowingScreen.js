import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import {db} from '../../firebase'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Avatar, Icon} from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'

const FollowingScreen = (props) => {
    const [userProfile, setUserProfile] = useState([])
    const user = props.route.params.user
    const navigation = useNavigation()


    useEffect(() => {
        user?.map((email) => {
            db.collection('users').where('email', '==', email).get().then((querySnapshot) => {
                setUserProfile( userProfile => [...userProfile, querySnapshot.docs[0].data()])
            })
        })
    }, [user])

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            {/* header */}
            <View style={tw`flex-row items-center border-b border-gray-100 py-2 px-5`}>
                <Icon 
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color={'#4b5563'}
                    onPress={() => navigation.goBack()}
                />
                <Text style={tw`text-gray-600 font-bold text-2xl ml-10`}>Following</Text>
            </View>
            {/* body */}
            <ScrollView>
                {userProfile?.map((profile) => (
                    <View style={tw`flex-row items-center border-b border-gray-100 py-2 px-4`}>
                        <Avatar 
                            source={{uri: profile.photoProfile}}
                            rounded
                            size="medium"
                            containerStyle={tw`bg-gray-100`}
                            onPress={() => {
                                navigation.navigate('OtherProfileScreen',{email: profile.email})
                            }}
                        />
                        <Text style={tw`ml-4`}>{profile.username}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default FollowingScreen
