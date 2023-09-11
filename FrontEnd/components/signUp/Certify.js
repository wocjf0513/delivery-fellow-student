import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-navigation'
import api from 'axios';


const Certify = ({ navigation }) => {
    const [UserEmail, setState] = useState('');
    const [InfoText, setMailText] = useState('');
    const [InfoText2, setMailText2] = useState('');
    const [CorrectNum, setCorrectNum] = useState('');
    const [data, setData] = useState([]);
    const [isExist, setIsExist] = useState('');
    const SendMail = async (text) => {
        const domain = text.split('@')[1];
        console.log(domain);
        var isExist = "";
        api.get('http://10.0.2.2:8090/user/checkDuplicateId', {
            params: {
                username: UserEmail,
            }
        }).then(response => {
            if(response.data.status == '200') {
                if(domain=="ajou.ac.kr"){
                    api.post('http://10.0.2.2:8090/mail/certify', null, {
                        params: {
                            email: text
                        }
                    })
                        .then((response) => {
                            setData(response.data);
                        }
                        ).catch((error) => {
                            console.log(error)
                        }
                        );
                } else {
                    alert("Ajou 계정이 아닙니다!");
                }
            } else {
                alert("해당 아이디를 가진 사용자가 이미 존재합니다.");
            }
        })
    }
    const saveEmail = async (email) => {
        await AsyncStorage.setItem('email', String(email));
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#89D69D' }}>
            <View style={styles.PageStyle}>
                <View style={styles.Introduce}>
                    <Text style={styles.Introduce}>인증하기</Text>
                </View>
                <TextInput style={styles.TextInput} placeholder="email을 입력해주세요"
                    onChangeText={UserEmail => setState(UserEmail)} />
                <TouchableOpacity style={styles.CertifyButton}
                    onPress={() => { SendMail(UserEmail); setMailText('인증번호가 전송되었습니다.'); saveEmail(UserEmail) }}>
                    <Text style={styles.Text}>인증번호 전송</Text>
                </TouchableOpacity>
                <Text style={styles.CorrectMailText}>{InfoText}</Text>
                <TextInput style={styles.TextInput} placeholder="인증번호를 입력해주세요"
                    onChangeText={CorrectNum => setCorrectNum(CorrectNum)} />
                <TouchableOpacity style={styles.CorrectButton}
                    onPress={() => {
                        if ((CorrectNum == data && CorrectNum != '')) {
                            navigation.navigate('Information');
                        } else {
                            setMailText2('인증번호가 틀렸습니다.')
                        }
                    }}>
                    <Text style={styles.Text}>확인</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.FalseMailText}>{InfoText2}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    CertifyButton: {
        width: 300,
        height: 40,
        paddingTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 2.5,
        borderRadius: 5,
        backgroundColor: "#89D69D",
        marginBottom: 10
    },
    CorrectMailText: {
        color: "#89D69D",
        marginTop: 5,
        marginLeft: 60,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',
    },
    FalseMailText: {
        color: "#FF0000",
        marginTop: 5,
        marginLeft: 60,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',
    },
    TextInput: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    CorrectButton: {
        width: 300,
        height: 40,
        paddingTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,

        backgroundColor: "#89D69D"
    },
    Text: {
        color: "white",
        textAlign: "center",
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        fontFamily: 'Jalnan',
    },
    Introduce: {
        color: "black",
        textAlign: "center",
        marginRight: 'auto',
        marginTop: 10,
        marginBottom: 70,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 25,
        fontFamily: 'Jalnan',
    },
    PageStyle: {
        backgroundColor: 'white',
        width: 380,
        height: 740,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
});

export default Certify;