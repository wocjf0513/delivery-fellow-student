import React , {useEffect} from 'react';
import { View, Text, StyleSheet , Image} from 'react-native';
import {TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-navigation';
const Start = ({navigation}) => {
    useEffect(() => {
    },[]);
    return(
            <View style = {{flex : 1, backgroundColor : '#89D69D'}}>
                <View style = {styles.PageStyle}>
                <View>
                </View>
                <TouchableOpacity style={styles.startButton} 
                    onPress = {() => navigation.navigate('Certify')}>
                    <Text style={styles.Text}>가입하기</Text>
                </TouchableOpacity>
                
                <View style={{flexDirection : 'row', marginTop : 10}}>
                    <Text style={{
                    marginLeft : 'auto',
                    paddingLeft : 10,
                    paddingRight : 10,
                    fontSize : 15,
                    fontFamily : 'Jalnan',
                }}>이미 계정이 있으시다면?</Text>
                <Text style={{
                    paddingLeft : 10,
                    paddingRight : 10,
                    fontSize : 15,
                    color : '#89D69D',
                    marginRight : 'auto',
                    fontFamily : 'Jalnan',
                }} onPress={() => navigation.navigate('Login')}>로그인하기</Text>
                </View>
                </View>  
            </View>
    )
}
const styles = StyleSheet.create({
   startButton:{
    width : 280, 
    height : 40,
    paddingTop : 5, 
    marginLeft : 'auto',
    marginRight : 'auto', 
    marginTop : 200,
    borderRadius:5,
    backgroundColor : "#89D69D" 
   },
   Text:{
       color : "white",
       textAlign : "center",
       marginTop : 5,
       paddingLeft : 10,
       paddingRight : 10,
       fontSize : 15,
       fontFamily : 'Jalnan',
   },
   PageStyle:{
    backgroundColor : 'white',
    width : 380, 
    height : 740,
    borderColor : 'white', 
    borderWidth : 1, 
    borderRadius : 10,
    marginLeft : 'auto', 
    marginRight : 'auto', 
    marginTop : 'auto', 
    marginBottom : 'auto'
  },
  });

export default Start;