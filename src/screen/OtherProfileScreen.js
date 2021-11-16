import React,{useState, useEffect} from 'react'
import { View, Text, ScrollView } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import {useCollection} from 'react-firebase-hooks/firestore'
import {db} from '../../firebase'
import { OtherProfile, Post } from '../component'

const OtherProfileScreen = (props) => {
    const email = props.route.params.email
    const [user, setUser] = useState(null)

    const [userSnapshot] = useCollection(db.collection('users').where('email','==',email))
    const [postSnapshot] = useCollection(db.collection('posts').orderBy('timestamp','desc'))

    useEffect(() => {
        userSnapshot?.docs.map((doc) => {
            setUser(doc.data())
        })
    }, [userSnapshot])

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <ScrollView>
                <OtherProfile user={user} />
                {postSnapshot?.docs.map((doc) => {
                    if(doc.data().email === email){
                        return <Post key={doc.id} id={doc.id} name={user?.name} username={user?.username} post={doc.data().post} loves={doc.data().loves.length} totalComments={doc.data().totalComments} photoProfile={user?.photoProfile} time={doc.data().timestamp} verify={user?.verify} userEmail={email} image={doc.data().photo}/>
                    } 
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default OtherProfileScreen
