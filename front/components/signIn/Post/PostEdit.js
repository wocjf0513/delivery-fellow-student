import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, TouchableOpacity, FlatList, Text, StyleSheet, Image, RefreshControl,Alert, ScrollView } from 'react-native';
import { Searchbar, TextInput } from 'react-native-paper';
import filter from 'lodash.filter';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native';
import Modal from 'react-native-modal';
import moment from 'moment';
import 'moment/locale/ko';
import star from '../../../icons/star.png';
import whiteStar from '../../../icons/whitestar.png';
import {CheckBox} from 'react-native-elements';

const PostEdit = ({ navigation , route}) => {
  var [data, setData] = useState([]);
  const [nickname, setNickName] = useState('');
  const [pickUpTime, setTime] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [foodName, setFoodName] = useState('');
  const [subFoodName, setSubFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [subFoodPrice, setSubFoodPrice] = useState('');
  const [postType, setPostType] = useState('');
  const [place, setPlace] = useState('');
  const [username,setUserName] = useState('');
  const [id, setId] = useState('');
  const [deliveryId, setdeId] = useState('');
  const [ModalVisible, setModalVisible] = useState(false);
  const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    const [checked5, setChecked5] = useState(false);
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('');
  const [reply, setReply] = useState('');
  const [ListTweets, setListTweets] = useState([]);

  const getUserName = async () => {
    var username = await AsyncStorage.getItem('username');
    setUserName(username);
  }
  const loadReply = (id) => {
    axios.get('http://10.0.2.2:8090/reply/get/'+Number(id)
        ).then(response => {
            console.log(response.data)
            setListTweets(response.data.data);
        }).catch(error => {
        console.log(error)
    })
}
  useEffect(() => {
    axios.get('http://10.0.2.2:8090/reply/get/'+Number(route.params.id)
                    ).then(response => {
                        setListTweets(response.data.data);
                    }).catch(error => {
                        console.log(error)
    })
    getUserName();
    axios.get('http://10.0.2.2:8090/post/get/'+route.params.id).then(response => {
        console.log(response.data);
        setNickName(response.data.data.authorNickName);
        setTime(response.data.data.pickUpTime);
        setPickUpLocation(response.data.data.pickupLocation);
        setLatitude(response.data.data.food[0].foodlocation.split(',')[0]);
        setLongitude(response.data.data.food[0].foodlocation.split(',')[1]);
        setFoodName(response.data.data.food[0].foodname);
        setSubFoodName(response.data.data.food[1].foodname);
        setFoodPrice(response.data.data.food[0].foodprice);
        setSubFoodPrice(response.data.data.food[1].foodprice);
        setPostType(response.data.data.postType);
        setId(response.data.data.id);
        getAddress();
    });
    axios.get('http://10.0.2.2:8090/post/getDeliveryId?postId='+route.params.id).then(response => {
        setdeId(response.data.data.id);
        setTarget(response.data.data.nickname);
    })
    const getAddress = async () => {
        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' +
            latitude + ',' + longitude + '&key=' + 'AIzaSyCb_m2mZveyK0Ot2vXFeOqa_uM8ICvauyM&callback=initMap&language=ko'
        ).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson.results[0]);
            setPlace(responseJson.results[0]?.formatted_address);
        })
    }
}, [latitude,longitude]);
const endDelivery = () => {
    axios.get('http://10.0.2.2:8090/post/delete?postId='+id,{
        method : 'POST',
    }).then(response => {
        if(response.status==200){
            setModalVisible(true);
        } else {
            alert("배달 종료에 실패했습니다!");
        }
      })
}
const addReply = () => {
    axios.get('http://10.0.2.2:8090/reply/write/',{
        method : 'POST',
        params : {
            post_id : route.params.id,
            content : reply, 
        }
    }).then(response => {
        if(response.status==200) {
            Alert.alert(
                '댓글이 작성되었습니다',
                '',
                [
                    {
                        text: '확인',
                        onPress: () => {loadReply(route.params.id)},
        
                    }
                ]
            )
        }else {
        }
    })
}
const renderTweets = ({item}) => {
    return (
        <Card style = {{borderWidth : .5}}>
            <View style = {{flexDirection : 'row', marginTop : 10,}}>
                <Text style = {styles.ReplyNickName}>{item.nickname}</Text>
            </View>
            <View>
                <Text style = {styles.ReplyContent}>{item.content}</Text>
            </View>
            <View>
                <Text style = {styles.ReplyCreateDate}>{item.createDateTime}</Text>
            </View>
        </Card>
    )
}
const addReview = () => {
    axios.get('http://10.0.2.2:8090/post/addReview',{
        method : 'POST',
        params : {
            content : content,
            rating : Number(checked1+checked2+checked3+checked4+checked5),
            deliveryId : deliveryId
        }
    }).then(response => {
        if(response.status==200) {
            alert("후기 작성에 성공했습니다!");
            navigation.dispatch(CommonActions.reset({
                index : 0,
                routes : [{name : 'Post'
                }],
            }))
        }else {
            alert("후기 작성 실패")
        }
    })
}
const delivery = () => {
    axios.get('http://10.0.2.2:8090/post/delivery?postId='+id,{
        method : 'POST',
    }).then(response => {
        if(response.status==200){
            alert("배달 수락에 성공했습니다!");
            navigation.dispatch(CommonActions.reset({
                index : 0,
                routes : [{name : 'Post'
                }],
            }))
        } else {
            alert("배달 수락에 실패했습니다!");
        }
      })
}
const renderExitButton = (postType) => {
    if(postType=='DELIVERY'&&username==nickname) {
        styles.Button.marginLeft = 10;
        return (
            <TouchableOpacity style = {styles.Button3}onPress={()=>{endDelivery()
            }}>
            <Text style = {styles.ButtonText3}>배달 종료</Text>
        </TouchableOpacity>   
        )
    } else {
        styles.Button.marginLeft = 'auto';
        return (
            <View></View>
        )
    }
}
  return (
    <View style={{ flex: 1, backgroundColor: '#89D69D' }}>
      <ScrollView style={styles.PageStyle}>
        <View>
            <View style={{display : 'flex', flexDirection : 'row'}}>
                <Text style={styles.content}>요청자 : {nickname}</Text>
                {renderExitButton(postType)}
                <TouchableOpacity style = {styles.Button}onPress={()=>{
                        if(username==nickname){
                            alert("요청자는 배달을 수락할 수 없습니다.");
                        } else if(postType=="DELIVERY"){
                            alert("진행중인 배달은 수락할 수 없습니다.");
                        } else {
                            delivery();
                        }
                    }}>
                    <Text style = {styles.ButtonText}>배달 수락</Text>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={ModalVisible}
                transparent={true}>
                <View style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 300, borderRadius: 20, backgroundColor: '#fff', borderColor: 'white', borderWidth: 1, width: 350, height: 300 }}>
                    <View>
                        <Text style={styles.RatingTitle}>배달 후기를 작성해주세요!</Text>
                    </View>
                    <View style={{ marginLeft: 30, marginRight: 'auto', marginTop: 20, flexDirection: 'row' }}>
                        <CheckBox
                            checked={checked1}
                            onPress={() => {setChecked1(true);
                                setChecked2(false);
                                setChecked3(false);
                                setChecked4(false);
                                setChecked5(false);
                            }}
                            checkedIcon={<Image source={star} style={styles.RatingIconStyle} />}
                            uncheckedIcon={<Image source={whiteStar} style={styles.RatingIconStyle} />}
                        ></CheckBox>
                        <CheckBox
                            checked={checked2}
                            onPress={() => {
                                    setChecked1(true);
                                    setChecked2(true);
                                    setChecked3(false);
                                    setChecked4(false);
                                    setChecked5(false);

                            }}
                            checkedIcon={<Image source={star} style={styles.RatingIconStyle} />}
                            uncheckedIcon={<Image source={whiteStar} style={styles.RatingIconStyle} />}
                        ></CheckBox>
                        <CheckBox
                            checked={checked3}
                            onPress={() => {
                                setChecked1(true);
                                setChecked2(true);
                                setChecked3(true);
                                setChecked4(false);
                                setChecked5(false);
                            }}
                            checkedIcon={<Image source={star} style={styles.RatingIconStyle} />}
                            uncheckedIcon={<Image source={whiteStar} style={styles.RatingIconStyle} />}
                        ></CheckBox>
                        <CheckBox
                            checked={checked4}
                            onPress={() => {
                                setChecked1(true);
                                setChecked2(true);
                                setChecked3(true);
                                setChecked4(true);
                                setChecked5(false);
                            }}
                            checkedIcon={<Image source={star} style={styles.RatingIconStyle} />}
                            uncheckedIcon={<Image source={whiteStar} style={styles.RatingIconStyle} />}
                        ></CheckBox>
                        <CheckBox
                            checked={checked5}
                            onPress={() => {
                                setChecked1(true);
                                setChecked2(true);
                                setChecked3(true);
                                setChecked4(true);
                                setChecked5(true);
                            }}
                            checkedIcon={<Image source={star} style={styles.RatingIconStyle} />}
                            uncheckedIcon={<Image source={whiteStar} style={styles.RatingIconStyle} />}
                        ></CheckBox>
                    </View>
                    <View>
                        <TextInput
                            onChangeText={(text) => setContent(text)}
                            style={{ width: 300, height: 60, borderColor: '#a0a0a0', marginLeft: 20, borderWidth: 1, borderRadius: 10, backgroundColor : 'white'}}>
                        </TextInput>
                    </View>
                    <View style={{ marginTop: 30, marginLeft: 20, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                                addReview();
                        }} style={styles.RatingButton}>
                            <Text style={styles.ButtonText2}>평가하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View>
                <Text style={styles.content}>장소 : {pickUpLocation}</Text>
                <Text style={styles.content2}>요청 시간 : {pickUpTime}</Text>
                <Text style={styles.content}>주문 음식 : {foodName}</Text>
                <Text style={styles.content2}>주문 음식 가격 : {foodPrice}</Text>
                <Text style={styles.content}>주문 대체 음식 : {subFoodName}</Text>
                <Text style={styles.content2}>주문 대체 음식 가격 : {subFoodPrice}</Text>
                <Text style={styles.content}>음식점 장소 : {place}</Text>
                <FastImage source={{uri : 
                    'https://maps.googleapis.com/maps/api/staticmap?center='+String(latitude)+","+String(longitude)+'&size='+styles.staticMap.height+'x'+styles.staticMap.width+'&markers=color:red%7Clabel:C%7C'+String(latitude) + ',' + String(longitude)+'&zoom=13&maptype=roadmap&key=AIzaSyCb_m2mZveyK0Ot2vXFeOqa_uM8ICvauyM', cache : FastImage.cacheControl.web}}
                        style={styles.staticMap}
                />
            </View>
        </View>
        <View>
            <Text style={styles.content}>댓글 작성</Text>
            <View style={{display : 'flex', flexDirection : 'row'}}>
                <TextInput style={styles.TextInput} onChangeText={(text) => setReply(text)}></TextInput>
                <TouchableOpacity style = {styles.Button2} onPress={()=>{
                    if(username==nickname || username == target){
                        addReply();
                    } else {
                        alert("권한이 없습니다!");
                    }
                }}>
                    <Text style = {styles.ButtonText2}>댓글 작성</Text>
                </TouchableOpacity>
            </View>
            <FlatList // 댓글 리스트
                    data = {ListTweets}
                    renderItem = {renderTweets}
                    onEndReachedThreshold={0.6}
                   >
            </FlatList>
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
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
  TextInput: {
    width: 250,
    height: 30,
    margin: 12,
    backgroundColor : 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: '2%',
    marginRight: 'auto',
    marginBottom: 20
},
  MainTitle: {
    color: "#89D69D",
    fontSize: 17,
    fontFamily: 'Jalnan',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  RatingTitle: {
    fontFamily: 'NanumSqureRoundB',
    fontSize: 17,
    color: 'black',
    marginLeft: 20,
    marginTop: 20,
},
RatingIconStyle: {
    width: 30,
    height: 30,
    marginLeft: -10,
    marginTop: 30
},
RatingButton: {
    width: 80,
    height: 40,
    backgroundColor: "#89D69D",
    borderColor: 'black',
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 10,
    marginTop : 'auto'
},
NotRatingButton: {
    width: 90,
    height: 40,
    paddingTop: 5,
    borderRadius: 5,
    backgroundColor: "#ff0000"
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
  staticMap :{
    margin : 'auto',
    width : 250,
    height : 250,
    marginLeft : 'auto',
    marginRight : "auto",
    display : 'flex',
},
  content: {
    fontSize: 15,
    fontFamily: 'NanumSquareRoundB',
    marginLeft: 10,
    marginTop : 30,
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
    backgroundColor: "#89D69D",
    borderColor: 'black',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop : 'auto'
  },
  ReplyContent : {
    marginLeft : 20,
    marginTop : 15,
    fontFamily : 'NanumSquareRoundB',
    fontSize : 14,
    color : 'black'
},
ReplyCreateDate : {
    marginLeft : 20,
    marginTop : 15,
    marginBottom : 15,
    fontFamily : 'NanumSquareRoundB',
    fontSize : 14,
    color : 'black'
},
ReplyNickName : {
    fontSize : 14,
    marginTop : 'auto',
    marginBottom : 'auto',
    marginLeft : 15,
    fontFamily : 'NanumSquareRoundB',
    color : 'black'
},
ReplyImage : {
    width : 40,
    height : 40,
    borderRadius : 40,
    marginLeft : 15,
},
ReplyDelete : {
    width : 35,
    height : 35,
    marginRight : 10,
    marginLeft : 'auto',
    marginBottom : 20,
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
  Button3: {
    width: 80,
    height: 40,
    backgroundColor: "#89D69D",
    borderColor: 'black',
    borderRadius: 5,
    marginLeft: 'auto',
    marginTop : 'auto'
  },
  ButtonText3: {
    color: "white",
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    fontSize: 15,
    fontFamily: 'Jalnan',
  },
  Button2: {
    width: 80,
    height: 40,
    backgroundColor: "#89D69D",
    borderColor: 'black',
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 10,
    marginTop : 'auto',
    marginBottom : 'auto',
  },
  ButtonText2: {
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
});
export default PostEdit;