import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { LogBox } from 'react-native';
import 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';
// 홈 화면
const Home = ({ navigation ,route}) =>{
    const [id,setId] = useState('');
    const [nickname, setNickName] = useState('');
    const [pickUpTime, setTime] = useState('');
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [postType, setPostType] = useState('');
    const saveId = async () => {
        var data = await AsyncStorage.getItem('userid');
        setId(data);
    }
    const getPostByUser = () => {
    }
    useEffect(() => {
        console.log(id);
        saveId();
        axios.get('http://10.0.2.2:8090/post/get/'+id).then(response => {
            var type = "";
            if(response.data.data.postType=="WAIT"){y
                type = "요청 대기중"
              } else if (response.data.data.postType=="DELIVERY"){
                type = "배달 진행중"
              }
            setNickName(response.data.data.authorNickName);
            setPickUpLocation(response.data.data.pickupLocation);
            setTime(response.data.data.pickUpTime);
            setPostType(type);
    });
    }, [id])
    LogBox.ignoreAllLogs(true);
    return (
        <View style={{ flex: 1, backgroundColor: '#89D69D' }}>
            <View style={styles.PageStyle}>
                <View style={{ flex: 1 }}>
                </View>
                <View>
                    <Text style= {styles.frontTitle}>내가 쓴 배달 요청 글</Text>
                    <TouchableOpacity onPress={()=>{navigation.navigate(NavigationActions.navigate({
                            routeName: '게시글',
                            action: NavigationActions.navigate({ routeName: 'PostDetail' })
                        }))}} style={[styles.item]}>
                        <Card style={styles.cards}>
                        <ScrollView>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.title}>{nickname} 님의 배달 요청</Text>
                            <Text style={styles.content}>장소 : {pickUpLocation}</Text>
                            <Text style={styles.content2}>요청 시간 : {pickUpTime}</Text>
                        </View>
                        <View>
                        <Text style={styles.Type}>{postType}</Text>
                        </View>
                        </ScrollView>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper: {},
    frontTitle: {
        marginLeft: 20,
        marginTop: 20,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 18,
        color: '#89D69D'
    },
    Title: {
        marginLeft: 5,
        marginTop: 20,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 18,
        color: 'black'
    },
    PostTitle: {
        marginLeft: 20,
        marginTop: -10,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 18,
        color: 'black'
    },
    ProfileImage: {
        width: 80,
        height: 80,
        borderRadius: 80,
        marginLeft: 20,
        marginTop: 20,
    },
    nickname: {
        fontSize: 20,
        fontFamily: 'NanumSquareRoundB',
        marginLeft: 20,
        marginTop: 20,
        color: 'black'
    },
    TeachIcon: {
        width: 17,
        height: 17,
        marginTop: 10,
        marginLeft: 20,
    },
    MajorIcon: {
        width: 20,
        height: 20,
        marginTop: 20,
        marginLeft: 20,
    },
    lectures: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginLeft: 20,
        color: 'black',
    },
    major: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginTop: 20,
        marginLeft: 20,
        color: 'black'
    },
    star: {
        width: 30,
        height: 30,
    },
    averageRating: {
        marginLeft: 20,
        marginTop: 5,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 20,
        color: 'black',
    },
    RatingText: {
        marginLeft: 20,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 17,
        marginTop: 30,
        color: 'black',
    },
    titleText: {
        marginLeft: 20,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 17,
        marginTop: 30,
        color: 'black',
    },
    contentText: {
        marginLeft: 20,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 15,
        marginTop: 30,
        color: '#a0a0a0',
    },
    countText : {
        marginLeft: 'auto',
        marginRight : 20,
        marginTop : 40,
        fontFamily: 'NanumSquareRoundB',
        fontSize: 15,
        color : 'black',
    },
    PageStyle: {
        backgroundColor: 'white',
        width: '96%',
        height: '98%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    cards: {
        borderRadius: 10,
        width: 370,
        height: 160,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 'auto',
      },
      nickname: {
        fontSize: 14,
        fontFamily: 'Jalnan',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        color: 'black'
      },
      MainTitle: {
        color: "#89D69D",
        fontSize: 17,
        fontFamily: 'Jalnan',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
      },
      writeText :{
        color: "#89D69D",
        fontSize: 15,
        fontFamily: 'Jalnan',
        margin : 'auto'
      },
      item: {
        width: '97%',
        marginRight: 'auto',
        marginBottom: 5,
      },
      title: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        color: 'black'
      },
      content: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginLeft: 10,
        marginTop : 30,
        color: 'black'
      },
      Type: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginLeft: 'auto',
        marginRight: 10,
        color: 'black'
      },
      content2: {
        fontSize: 15,
        fontFamily: 'NanumSquareRoundB',
        marginBottom: 10,
        marginLeft: 10,
        color: 'black'
      },
      Button: {
        width: 80,
        height: 40,
        backgroundColor: "#27BAFF",
        borderColor: 'black',
        borderRadius: 10,
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
      PageStyle: {
        backgroundColor: 'white',
        width: '96%',
        height: '98%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius : 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
      },
})


export default Home;