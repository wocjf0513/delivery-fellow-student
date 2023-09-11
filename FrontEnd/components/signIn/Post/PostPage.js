import React from 'react';
import 'react-navigation'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Post from './PostList';
import EditPost from './PostEdit';
import PostWrite from './PostWrite';
import Map from './Maps';
import PostDetail from './PostEdit';
import 'react-navigation';
// Post 전체 페이지 Stack
const stack = createStackNavigator();
// Post 전체 페이지
const PostPage = ({navigation, route}) => {
  return (
    <NavigationContainer independent={true}>
      <stack.Navigator screenOptions={{
        headerShown: false
      }} initialRouteName="Post">
        <stack.Screen name="Post" component={Post} />
        <stack.Screen name="PostWrite" component={PostWrite}/>
        <stack.Screen name="PostDetail" component={PostDetail}/>
        <stack.Screen name='Map' component={Map}/>
      </stack.Navigator>
    </NavigationContainer>
  )
}
export default PostPage;