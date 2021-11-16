import React, {useState} from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import {Button, Image} from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import {auth,db} from '../../firebase'

const Register = () => {
    const navigation = useNavigation()
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [name, setName] = useState(null)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const pickDate = () => {
        setShow(true)
    }

    const registerUser = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            db.collection('users').doc(user.user.uid).set({
                name: name,
                username: username,
                email: email,
                dateOfBirth: date,
                photoHeader: null,
                photoProfile: null,
                createdAt: new Date(),
                bio: 'Welcome to my profile',
                follower:[],
                following:[],
                verify: false
            })
            navigation.navigate('Login',{status: "fromRegister"})
        })
    }

    return (
        <SafeAreaView style={tw`bg-white h-full flex-col`}>
            <Image 
                source={require('../assets/logo-chatto.png')}
                style={{width:40, height:40}}
                containerStyle={tw`m-auto mt-2`}
            />

            {show && <DateTimePicker 
                value={date}
                mode="date"
                onChange={(e,selectedDate) => {
                    setDate(selectedDate)
                    setShow(false)
                }}
            />}

            <View style={tw`w-11/12 border border-gray-200 m-auto p-3 rounded-xl`}>
                <Text style={tw.style('font-bold', 'text-2xl', 'text-gray-700')}>Register</Text>
                <View style={tw`flex-row w-full mt-2`}>
                    <TextInput 
                    placeholder="name"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 w-1/2 mr-1`}
                    onChangeText={(e) => {setName(e)}}
                    />
                    <TextInput 
                    placeholder="username"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 flex-grow`}
                    autoCapitalize="none"
                    onChangeText={(e) => {setUsername(e)}}
                    />
                </View>
                <TextInput 
                    placeholder="email"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    autoCapitalize="none"
                    onChangeText={(e) => {setEmail(e)}}
                />
                <TextInput 
                    placeholder="password"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onChangeText={(e) => {setPassword(e)}}
                />
                <TextInput 
                    placeholder={"Date of birth: " + moment(date).format("LL")}
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    editable={false}
                />
                <TouchableOpacity style={tw`p-2 m-auto`}
                    onPress={pickDate}
                >
                    <Text style={tw`text-gray-500`}>Set date of birth</Text>
                </TouchableOpacity>
                <Button
                    title="Register"
                    containerStyle={tw.style('mt-4', 'rounded-xl')}
                    buttonStyle={{backgroundColor:'#329ba8'}}
                    onPress={registerUser}
                />
                <TouchableOpacity style={tw`mt-10 mx-auto`} 
                    onPress={() => navigation.navigate('SetPhotoScreen')}
                >
                    <Text style={tw`text-blue-400`}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Register
