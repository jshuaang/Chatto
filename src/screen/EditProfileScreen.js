import React,{useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Avatar, Image } from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';

// firebase
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth, db, storage} from '../../firebase'
import {uploadImage} from '../utils/Storage'

// redux
import { useDispatch, useSelector } from 'react-redux'
import {getPhotoHeader, getPhotoProfile, getName, getUsername, getEmail, getDob, getBio, setPhotoHeader} from '../redux/reducer/UserReducer'

const EditProfileScreen = () => {
    const navigation = useNavigation()
    const [user] = useAuthState(auth)
    const [userSnapshot] = useCollection(db.collection('users').doc(user?.uid))

    // state
    const [changeHeader, setChangeHeader] = useState(false)
    const [changePhotoProfile, setChangePhotoProfile] = useState(false)

    const [name, setName] = useState(useSelector(getName))
    const [username, setUsername] = useState(useSelector(getUsername))
    const [email, setEmail] = useState(useSelector(getEmail))
    const [dob, setDob] = useState(useSelector(getDob))
    const [header, setHeader] = useState(useSelector(getPhotoHeader))
    const [photoProfile, setPhotoProfile] = useState(useSelector(getPhotoProfile))
    const [bio, setBio] = useState(useSelector(getBio))

    useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

    const pickImage = async (type) => {
        if(type === 'header'){
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 2],
              quality: 1,
            });
        
            if (!result.cancelled) {
                setHeader(result.uri)
                setChangeHeader(true)
            }
        }

        if(type === 'photoProfile'){
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });
        
            if (!result.cancelled) {
                setPhotoProfile(result.uri)
                setChangePhotoProfile(true)
            }
        }
  };

    const saveButton = () => {
        if(changeHeader){
            uploadImage(email,'header',header, user?.uid)
        }

        if(changePhotoProfile){
            uploadImage(email,'profilePic',photoProfile, user?.uid)
        }

        db.collection('users').doc(user?.uid).update({
            name: name,
            username: username,
            bio: bio,
        })

        navigation.navigate('UserProfileScreen')
    }

    return (
        <SafeAreaView style={tw`bg-white h-full flex-col`}>

            {/* header */}
            <TouchableOpacity style={tw`bg-gray-800 h-40`}
                onPress={() => pickImage('header')}
            >
                <Image 
                    source={{uri: header}}
                    style={{width:'100%' , height:'100%'}}
                />
                <View style={tw`absolute bottom-0 w-full bg-gray-200 opacity-60`}>
                    <Text style={tw`text-white text-center`}>Edit Header</Text>
                </View>
            </TouchableOpacity>

            {/* profil pic */}
            <View style={tw`w-full p-5`}>
                <TouchableOpacity style={tw`m-auto`}
                    onPress={() => pickImage('photoProfile')}
                >
                    <Avatar 
                        source={{uri: photoProfile}}
                        rounded
                        size="large"
                        containerStyle={tw`bg-gray-100`}
                    />
                    <Text style={tw`text-center text-blue-300`}>Edit photo</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`w-11/12 mx-auto`}>
                {/* name */}
                <TextInput 
                    value={name}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 `}
                    onChangeText={(e) => {setName(e)}}
                />

                {/* username */}
                <TextInput 
                    value={username}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    autoCapitalize="none"
                    onChangeText={(e) => {setUsername(e)}}
                />

                {/* email */}
                 <TextInput 
                    placeholder={email}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    autoCapitalize="none"
                    editable={false}
                />

                {/* date */}
                <TextInput 
                    placeholder={moment(dob * 1000).format("LL")}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    editable={false}
                />

                {/* bio */}
                <TextInput 
                    value={bio}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    autoCapitalize="none"
                    onChangeText={(e) => {setBio(e)}}
                />

                {/* save & cancel */}
                <TouchableOpacity style={tw.style({backgroundColor:'#329ba8'},'rounded-xl','p-2', 'mt-10')}
                    onPress={saveButton}
                >
                    <Text style={tw`text-white text-center font-bold`}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw.style({borderColor:'#329ba8', borderWidth:1},'rounded-xl','p-2', 'mt-4')}
                    onPress={() => navigation.goBack('Profile')}
                >
                    <Text style={tw`text-gray-700 text-center font-bold`}>Cancel</Text>
                </TouchableOpacity>
            </View> 
        </SafeAreaView>
    )
}

export default EditProfileScreen
