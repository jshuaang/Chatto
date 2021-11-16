import moment from 'moment'
import React from 'react'
import { View, Text } from 'react-native'
import { Avatar, Image } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'

const DetailPost = ({detail}) => {
    const detailPost = detail
    const navigation = useNavigation()

    return (
        <View style={tw`px-5 py-3 border-b border-gray-100`}>
            {/* head */}
            <View style={tw`flex-row items-center`}>
                <Avatar 
                    source={{uri: detail.photoProfile}}
                    rounded
                    size="medium"
                    onPress={() => navigation.navigate('OtherProfileScreen', {email: detailPost?.email})}
                />
                <View style={tw`ml-3`}>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`font-bold mr-1`}>{detailPost.name}</Text>
                        {detailPost.verify ? 
                        <Image
                            source={require('../assets/verified.png')}
                            style={{width:12, height:12}}
                        /> : null}
                    </View>
                    <Text style={tw`text-gray-500`}>@{detailPost.username}</Text>
                </View>
            </View>
            {/* body */}
            <View style={tw`mt-4`}>
                <Text style={tw`text-2xl text-gray-700`}>{detailPost.post}</Text>
                <View>
                    {detailPost.image ?
                    <Image 
                        source={{uri:detailPost.image}}
                        style={{width:'100%' , height:200}}
                    />:null}
                </View>
                <View style={tw`flex-row justify-between items-center mt-4`}>
                    <Text style={tw`text-gray-500 text-xs`}>{moment(detailPost.time.seconds * 1000).format('LLL')}</Text>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-gray-500 mr-2`}>{detailPost.loves} Likes</Text>
                        <Text style={tw`text-gray-500`}>{detailPost.comments} Comments</Text>
                    </View>
                </View>
            </View>

            {/* footer */}

        </View>
    )
}

export default DetailPost
