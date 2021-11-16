import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// screen
import HomeScreen from './src/screen/HomeScreen';
import AddPost from './src/screen/AddPost';
import UserProfileScreen from './src/screen/UserProfileScreen'
import MessageScreen from './src/screen/MessageScreen';
import Login from './src/screen/Login';
import Register from './src/screen/Register'
import EditProfileScreen from './src/screen/EditProfileScreen'
import DetailPostScreen from './src/screen/DetailPostScreen'
import OtherProfileScreen from './src/screen/OtherProfileScreen'
import ChatScreen from './src/screen/ChatScreen'
import SetPhotoScreen from './src/screen/SetPhotoScreen'
import FollowingScreen from './src/screen/FollowingScreen';
import FollowerScreen from './src/screen/FollowerScreen'

// redux
import { Provider } from 'react-redux';
import store from './src/redux/store/store';

// firebase
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from './firebase'
import LoadingScreen from './src/screen/LoadingScreen';

const Stack = createStackNavigator()

export default function App() {
  const [user, loading, error] = useAuthState(auth)

  if(loading) {
    return(<LoadingScreen />)
  }
  
  if(!user) return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register}/>
        </Stack.Navigator>
    </NavigationContainer>
  )

  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="AddPost" component={AddPost}/>
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}/>
            <Stack.Screen name="MessageScreen" component={MessageScreen}/>
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen}/>
            <Stack.Screen name="DetailPostScreen" component={DetailPostScreen}/>
            <Stack.Screen name="OtherProfileScreen" component={OtherProfileScreen}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen}/>
            <Stack.Screen name="SetPhotoScreen" component={SetPhotoScreen} />
            <Stack.Screen name="FollowingScreen" component={FollowingScreen} />
            <Stack.Screen name="FollowerScreen" component={FollowerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  );
}
