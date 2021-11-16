import React,{useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import { Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'
import { DetailPost, Comment } from '../component'
import { useSelector } from 'react-redux'
import {getEmail} from '../redux/reducer/UserReducer'
import firebase from 'firebase'
import {db} from '../../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'

const DetailPostScreen = (props) => {
    const detail = props.route.params.detail
    const navigation = useNavigation()
    const [comment, setComment] = useState(null)

    // get Comment
    let [userComment, setUserComment] = useState([])
    const [commentSnapsot] = useCollection(db.collection('posts').doc(detail.id).collection('comments').orderBy('timestamp','asc'))

    useEffect(() => {
        commentSnapsot?.docs.map((doc) => {
            const email = doc.data().email
            db.collection('users').where('email', '==', email).onSnapshot(
                (querySnapshot) => {
                    querySnapshot.docs.map((doc) => {
                        setUserComment([...userComment, doc.data()])
                    })
                }
            )
        })
    }, [commentSnapsot])

    // post comment
    const email = useSelector(getEmail)

    const addComment = () => {
        db.collection('posts').doc(detail.id).update({
            totalComments: detail.totalComments + 1
        })

        db.collection('posts').doc(detail.id).collection('comments').add({
            email: email,
            loves: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            comment: comment
        })
        .then(res => setComment(null) )
    }
    
    return (
        <SafeAreaView style={tw`h-full bg-white`}>
            {/* header */}
            <View style={tw`flex-row items-center border-b border-gray-100 py-2 px-5`}>
                <Icon 
                    name="arrow-left"
                    type="font-awesome"
                    size={20}
                    color={'#4b5563'}
                    onPress={() => navigation.goBack('HomeScreen')}
                />
                <Text style={tw`text-gray-600 font-bold text-2xl ml-10`}>Post</Text>
            </View>
            <DetailPost detail={detail}/>
            
            
            <View style={tw`h-40 flex-grow`}>
                <ScrollView>
                {commentSnapsot?.docs.map(res => {
                    const data = res.data()
                    for(let i=0; i<userComment.length; i++){
                        if(userComment[i].email === data.email){
                            return(<Comment docId={detail.id} commentId={res.id} name={userComment[i].name} comment={data.comment} username={userComment[i].username} photoProfile={userComment[i].photoProfile} loves={data.loves.length} verify={userComment[i].verify} timestamp={data.timestamp} emailUser={data.email}/>)
                        }
                    }
                })}
                </ScrollView>
            </View>
            <View style={tw`bg-gray-100 p-2  flex-row items-center`}>
                <TextInput 
                    placeholder="Add new comment..."
                    style={tw`bg-white py-1 px-4 rounded-full flex-grow`}
                    onChangeText={(e) => setComment(e)}
                    value={comment}
                />
                <TouchableOpacity
                    onPress={addComment}
                >
                    <Icon 
                        name="paper-plane"
                        type="font-awesome"
                        style={tw`py-1 px-2`}
                        color="#329ba8"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default DetailPostScreen
