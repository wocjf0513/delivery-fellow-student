import React, { Component, useEffect} from 'react';
import 'react-native-gesture-handler';
import { Alert } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native';
import Start from './components/start';
import Certify from './components/signUp/Certify';
import Information from './components/signUp/Information';
import EndRegister from './components/signUp/EndRegister';
import Login from './components/signIn/Login';
import HomeScreen from './components/signIn/Home/HomeScreen';
const stack = createStackNavigator();

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      position : {
        coords : {
          latitude : 0,
          longitute : 0,
        }
      }
    }
  }
  render(){
  
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <stack.Screen name="Start" component={Start}/>
        <stack.Screen name="Certify" component={Certify}/>
        <stack.Screen name='Information' component={Information}/>
        <stack.Screen name='EndRegister' component={EndRegister}/>
        <stack.Screen name='Login' component={Login}/>
        <stack.Screen name='HomeScreen' component={HomeScreen}/>
      </stack.Navigator>
    </NavigationContainer>
  );
};
}

export default App;