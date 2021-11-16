import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import {Icon} from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import {useNavigation} from '@react-navigation/native'

// redux
import {useDispatch, useSelector} from 'react-redux'
import {getMenu, setMenu} from '../redux/reducer/MenuReducer'

const Footer = () => {
    const dispatch = useDispatch()
    const menu = useSelector(getMenu)
    const navigation = useNavigation()

    return (
        <View style={tw`py-2 px-8 h-12 flex-row items-center justify-between border-t border-gray-100`}>
            <TouchableOpacity>
                <Icon 
                    name="home"
                    type="font-awesome"
                    size={35}
                    color={menu === 'home' ? '#329ba8' : '#393d3d'}
                    onPress={() => {
                        dispatch(setMenu('home'))
                        navigation.navigate('HomeScreen')
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon 
                    name="envelope"
                    type="font-awesome"
                    size={32}
                    color={menu === 'message' ? '#329ba8' : '#393d3d'}
                    onPress={() => {
                        dispatch(setMenu('message'))
                        navigation.navigate('MessageScreen')
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon 
                    name="user"
                    type="font-awesome"
                    size={32}
                    color='#393d3d'
                    onPress={() => {navigation.navigate('UserProfileScreen')}}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Footer
