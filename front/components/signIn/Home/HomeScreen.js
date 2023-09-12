import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Image , Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-navigation';
import Home from './Home';
import PostPage from '../Post/PostPage';
import homeIcon from '../../../icons/home.png';
import postIcon from '../../../icons/desktop-computer.png'

// 전체 홈 화면 바텀 탭 Stack
const Tab = createBottomTabNavigator();

// 전체 홈 화면 바텀 탭 페이지
const HomeScreen = ({ navigation , route}) => {
    return (
        <NavigationContainer independent={true} >
            <Tab.Navigator screenOptions={{
                headerShown: false,
                
                }}
                initialRouteName="홈"
                activeColor="#89D69D"
                labeled = {true}
                >
                <Tab.Screen name='게시글' component={PostPage}options={{
                    tabBarIcon: () => {
                        return (
                            <Image source={postIcon} style={{ width: 30, height: 30 }} />
                        )
                    },
                    unmountOnBlur: Platform.OS === 'ios' ? false : true,
                }} />
                <Tab.Screen name="홈" component={Home} options={{
                    tabBarIcon: () => {
                        return (
                            <Image source={homeIcon} style={{ width: 30, height: 30 }} />
                        )
                    },
                    unmountOnBlur: Platform.OS === 'ios' ? false : true,
                }} />
            </Tab.Navigator>
        </NavigationContainer>

    )
}

const styles = StyleSheet.create({
    Introduce: {
        color: "black",
        textAlign: "center",
        marginRight: 'auto',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: 'bold',
        fontSize: 25,
    }
});

export default HomeScreen;