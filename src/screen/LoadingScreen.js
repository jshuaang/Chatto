import React from 'react'
import { View, Text } from 'react-native'
import { Image } from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'

const LoadingScreen = () => {
    return (
        <SafeAreaView>
            <Image 
                source={require('../assets/logo-chatto.png')}
                style={{width:80, height:80}}
                containerStyle={tw`m-auto mt-52`}
            />
            <Text style={tw.style('text-center','mt-4','text-gray-600')}>Loading...</Text>
        </SafeAreaView>
    )
}
export default LoadingScreen
