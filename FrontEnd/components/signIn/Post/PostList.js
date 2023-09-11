import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, TouchableOpacity, FlatList, Text, StyleSheet, Image, RefreshControl, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import filter from 'lodash.filter';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-paper'
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ko';

const PostList = ({ navigation }) => {
  var [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://10.0.2.2:8090/post/getList').then(response => {
      var count = parseInt(response.data.numberOfElements);
        var newData = [];
        var type = "";
        count = count - 1;
        for (count; count >= 0; count--) {
          if(response.data.content[count].postType=="WAIT"){
            type = "요청 대기중"
          } else if (response.data.content[count].postType=="DELIVERY"){
            type = "배달 진행중"
          }
          if(response.data.content[count].postType!="TERMINATE")
            newData.push({
              nickname: response.data.content[count].authorNickName,
              pickupLocation: response.data.content[count].pickupLocation,
              pickUpTime : response.data.content[count].pickUpTime,
              id : response.data.content[count].id,
              postType : type,
            })
        }
        setData(newData)
    })
}, []);
const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={()=>{navigation.dispatch(CommonActions.reset({
    index : 0,
    routes : [{name : 'PostDetail', params : {
        id : item.id
    }}],
}))}} style={[styles.item, style]}>
    <Card style={styles.cards}>
      <ScrollView>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.title}>{item.nickname} 님의 배달 요청</Text>
        <Text style={styles.content}>장소 : {item.pickupLocation}</Text>
        <Text style={styles.content2}>요청 시간 : {item.pickUpTime}</Text>
      </View>
      <View>
      <Text style={styles.Type}>{item.postType}</Text>
      </View>
      </ScrollView>
    </Card>
  </TouchableOpacity>
);
const renderItem = ({ item }) => {
  return (
    <Item
      item={item}
    />
  )
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#89D69D' }}>
      <View style={styles.PageStyle}>
        <View style={{ display : 'flex', flexDirection: 'row', marginTop: 10 }}>
          <Text style={styles.MainTitle}>게시글 목록</Text>
          <TouchableOpacity style={{display : 'flex', marginLeft : 'auto', marginRight : 10, marginTop: 10}}>
            <Text style={styles.writeText} onPress={()=> {navigation.navigate("PostWrite")}}>글쓰기</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexgrow: 1 }}>
        <FlatList
            data={data}
            renderItem={(item)=> renderItem(item)}
            contentContainerStyle={{ flexGrow: 1 }}>
          </FlatList>
        </View>
      </View>
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
});
export default PostList;