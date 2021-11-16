import React,{useState} from 'react'
import { View, Text, TextInput, Alert, TouchableOpacity} from 'react-native'
import { Button, Image } from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import {auth} from '../../firebase'
import {useNavigation} from '@react-navigation/native'

const Login = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    

    const login = () => {
        auth.signInWithEmailAndPassword(email,password)
        .catch(err => setErrorMessage(err))
    }


    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <View style={tw`mt-5`}>
                {errorMessage !== null && Alert.alert(
                    "Login Failed",
                    `${errorMessage}`,
                    [
                        {text: "OK", onPress: () => setErrorMessage(null),}
                    ]
                )}
            </View>
            <Image 
                source={require('../assets/logo-chatto.png')}
                style={{width:40, height:40}}
                containerStyle={tw`m-auto mt-2`}
            />
            <View style={tw`w-11/12 border border-gray-200 m-auto mt-40 p-3 rounded-xl`}>
                <Text style={tw.style('font-bold', 'text-2xl', 'text-gray-700')}>Login</Text>
                <TextInput 
                    placeholder="email"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-4`}
                    onChangeText={(e) => {setEmail(e)}}
                />
                <TextInput 
                    placeholder="password"
                    style={tw`border border-gray-100 h-10 rounded-xl px-5 mt-2`}
                    secureTextEntry={true}
                    onChangeText={(e) => {setPassword(e)}}
                />
                <Button
                    title="Login"
                    containerStyle={tw.style('mt-4', 'rounded-xl')}
                    buttonStyle={{backgroundColor:'#329ba8'}}
                    onPress={login}
                />
                <TouchableOpacity style={tw`mt-10 mx-auto`} 
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={tw`text-blue-400`}>Register</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Login
