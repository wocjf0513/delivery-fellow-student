import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, TouchableOpacity, FlatList, Text, StyleSheet, Image, RefreshControl, ScrollView, Alert, TextInput, Button} from 'react-native';
import { Searchbar } from 'react-native-paper';
import filter from 'lodash.filter';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import DatePicker from 'react-native-date-picker'
import 'moment/locale/ko';
import 'react-navigation';

const PostWrite = ({navigation, route}) => {
    const [Title, setTitle] = useState('');
    const [Content, setContent] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitudes] = useState(null);
    const [place, setPlace] = useState(null);
    const [detailPlace, setDetailPlace] = useState(null);
    const [foodName, setFoodName] = useState(null);
    const [subFoodName, setSubFoodName] = useState(null);
    const [foodPrice, setFoodPrice] = useState(null);
    const [subFoodPrice, setSubFoodPrice] = useState(null);
    const [date, setDate] = useState(new Date(null));
    const [open, setOpen] = useState(false);
    const [id, setId]= useState('');
    const [userType, setUserType] = useState('');
    const getUserName = async () => {
        var username = await AsyncStorage.getItem('userid');
        setId(username);
      }
    const writePost = () => {
        axios.get('http://10.0.2.2:8090/post/write',{
            method : 'POST',
            params : {
                pickUpTime : date.getHours() + "시" +" "+date.getMinutes() + "분",
                pickupLocation : place +" "+detailPlace,
                priFoodName : foodName,
                priFoodPrice : foodPrice,
                priFooodLocation : latitude + ',' + longitude,
                subFoodName : subFoodName,
                subFoodPrice : subFoodPrice,
                subFoodLocation : latitude + ',' + longitude,
            }
        }).then(response => {
            if(response.data.data=="DELIVERY"){
                alert("해당 사용자는 배달 진행 중입니다.");
            } else if (response.data.data=="WRITE") {
                alert("해당 사용자는 배달 요청 중입니다.");
            } else {
                alert("작성에 성공했습니다!");
                navigation.dispatch(CommonActions.reset({
                    index : 0,
                    routes : [{name : 'Post'
                    }],
                }))
            }
        })
    }
    useEffect(() => {
        getUserName();
        console.log(id);
        axios.get('http://10.0.2.2:8090/user/getUser').then(response=>{
            setUserType(response.data.data);
        })
        if(route.params) {
            setLatitude(route.params.latitude);
            setLongitudes(route.params.longitude);
            setLocation(route.params.place);
            console.log("latitude :",latitude,"longitude :",longitude);
        }
        styles.MapView.display = 'flex';
    }, [latitude, longitude])
    return (
        <View style = {{flex : 1, backgroundColor : '#89D69D'}}>
            <ScrollView style = {styles.PageStyle}>
            <Text style={styles.Text}>게시글 쓰기</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity 
                    onPress={()=>{
                        setDate(new Date(null));setLocation(null);styles.MapView.display="none";navigation.dispatch(CommonActions.reset({
                        index : 0,
                        routes : [{name : 'Post'}]
                    }))}}
                    style={{ marginLeft: 30, marginRight: 5 }}>
                    <Text style={styles.ExitText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.PostText}>글 쓰기</Text>
                <TouchableOpacity style={styles.Button} onPress={()=>{
                    if(userType=="WRITE"||userType=="DELIVERY"){
                        alert("배달을 수행중이거나 요청 대기중에는 작성하실 수 없습니다!");
                    }else
                        writePost()}}>
                    <Text style={styles.ButtonText}>작성</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 40 }}>
                <RNPickerSelect
                    onValueChange={(value => setPlace(value))} items={[
                        {label : '팔달관', value:'팔달관'},
                        {label : '원천관', value:'원천관'},
                        {label : '성호관', value:'성호관'},
                        {label : '원천관', value:'원천관'},
                        {label : '신학회관', value:'신학회관'}
                    ]}/>
                <Text style={styles.Text}>상세주소</Text>
                <TextInput style={styles.TitleInput} onChangeText={(text) => {setDetailPlace(text)}}></TextInput>
                <Text style={styles.Text}>주문할 음식</Text>
                <TextInput style={styles.TitleInput} onChangeText={(text) => {setFoodName(text)}}></TextInput>
                <Text style={styles.Text}>주문할 음식 가격</Text>
                <TextInput style={styles.TitleInput} onChangeText={(text) => {setFoodPrice(text)}}></TextInput>
                <Text style={styles.Text}>주문할 대체 음식</Text>
                <TextInput style={styles.TitleInput} onChangeText={(text) => {setSubFoodName(text)}}></TextInput>
                <Text style={styles.Text}>주문할 대체 음식 가격</Text>
                <TextInput style={styles.TitleInput} onChangeText={(text) => {setSubFoodPrice(text)}}></TextInput>
                <Text style={styles.Text}>음식점 주소</Text>
                <Text style={styles.Text}>픽업 시간 설정</Text>
                <View style={{display : 'flex', flexDirection : 'row'}}>
                    <TouchableOpacity style={styles.timeButton} onPress={() => setOpen(true)}><Text style = {styles.ButtonText}>시간 설정</Text></TouchableOpacity>
                    <Text style = {{marginTop : '2%', marginLeft : 'auto', marginRight : 'auto', fontSize: 15, fontFamily: 'Jalnan'}}>{date.getHours() + "시" +" "+date.getMinutes()+ "분"}</Text>
                </View>
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="time"
                    onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    }}
                    onCancel={() => {
                    setOpen(false)
                    }}
                />
                <View>
                <View style={{display : 'flex', flexDirection : 'row'}}>
                    <Text style = {{marginTop : '2%', marginLeft : 'auto', fontSize: 13, fontFamily: 'Jalnan'}}>{location}</Text>
                    <TouchableOpacity style={styles.mapButton} onPress={()=> { navigation.dispatch(CommonActions.reset({
                                index : 0,
                                routes : [{name : 'Map'}],
                            }))}}>
                            <Text style={styles.ButtonText}>지도로 검색</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.MapView}>
                <FastImage source={{uri : 
                'https://maps.googleapis.com/maps/api/staticmap?center='+String(latitude)+","+String(longitude)+'&size='+styles.staticMap.height+'x'+styles.staticMap.width+'&zoom=13&maptype=roadmap&key=AIzaSyCb_m2mZveyK0Ot2vXFeOqa_uM8ICvauyM', cache : FastImage.cacheControl.web}}
                    style={styles.staticMap}
                    />
                </View>
            </View>
            </View>
            </ScrollView>
        </View>

    )
}
const styles = StyleSheet.create({
    TitleInput: {
        width: 350,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20
    },
    MapView : {
        marginLeft : 'auto', marginRight : 'auto',marginTop : '5%',
        display : 'none'
    },
    staticMap :{
        margin : 'auto',
        width : 250,
        height : 250,
        display : 'flex',
    },
    TextInput: {
        width: 350,
        height: 350,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20
    },
    mapButton : {
        width: 80,
        height: 40,
        backgroundColor: "#89D69D",
        borderColor: 'black',
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 10,
    },
    timeButton : {
        width: 80,
        height: 40,
        backgroundColor: "#89D69D",
        borderColor: 'black',
        borderRadius: 5,
        marginLeft : '5%'
    },
    Text: {
        color: "#89D69D",
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',

    },
    Button: {
        width: 80,
        height: 40,
        backgroundColor: "#89D69D",
        borderColor: 'black',
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 10,
    },
    ButtonText: {
        color: "white",
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',

    },
    ExitText: {
        color: "black",
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',

    },
    AnotherText: {
        color: "#89D69D",
        marginTop: 20,
        marginLeft: 30,
        fontSize: 15,
        fontFamily: 'Jalnan',

    },
    PostText: {
        color: "#89D69D",
        marginTop: 10,
        marginLeft: 30,
        fontSize: 15,
        fontFamily: 'Jalnan',

    },
    PageStyle: {
        backgroundColor: 'white',
        width: '96%',
        height: 'auto',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius : 10,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
});
export default PostWrite;