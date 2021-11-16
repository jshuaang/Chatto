import React from 'react'
import { View, Text, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import Post from '../component/Post'
import ButtonPost from '../component/ButtonPost'
import Profile from '../component/Profile'
import {useCollection} from 'react-firebase-hooks/firestore'
import {db} from '../../firebase'
import {getPhotoProfile, getName, getUsername, getEmail, getVerify} from '../redux/reducer/UserReducer'
import {useSelector} from 'react-redux'


const UserProfileScreen = () => {
    const [postSnapshot] = useCollection(db.collection('posts').orderBy('timestamp', 'desc'))

    // data
    const name = useSelector(getName)
    const username = useSelector(getUsername)
    const photoProfile = useSelector(getPhotoProfile)
    const email = useSelector(getEmail)
    const verify = useSelector(getVerify)

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <ScrollView>
            <Profile />
            <View style={tw`py-2 flex-row justify-center border-b border-gray-100`}>
                <Text style={{textAlign:"center", borderBottomColor:"#329ba8", borderBottomWidth:3}}>Your Post</Text>
            </View>
            {
                postSnapshot?.docs.map( doc => {
                    if(doc){
                        const post = doc.data()
                        return (
                        (post.email === email) ? <Post key={doc.id} id={doc.id} name={name} username={username} post={post.post} loves={post.loves.length} totalComments={post.totalComments} photoProfile={photoProfile} time={post.timestamp} verify={verify} userEmail={email} image={post.photo}/> : null
                        )}  
                    }
                )
            }
            </ScrollView>
            <ButtonPost />
        </SafeAreaView>
    )
}

export default UserProfileScreen
