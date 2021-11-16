import React from 'react'
import { TouchableOpacity } from 'react-native'
import {Icon} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'

const ButtonPost = () => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={{backgroundColor:'#329ba8', position:'absolute',paddingHorizontal:18,paddingVertical:16, borderRadius:50, bottom: 25, right:20}}
                onPress={() => navigation.navigate('AddPost')}
                >
                    <Icon 
                        name='plus'
                        type='font-awesome'
                        color= '#fff'
                    />
        </TouchableOpacity>
    )
}

export default ButtonPost
