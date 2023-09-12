import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import 'react-navigation'


const Map = ({ navigation , route}) => {
    const [location, setLocation] = useState({
        latitude: 37.2830557,
        longitude: 127.0448373,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [place, setPlace] = useState('');
    const mapRef = useRef(null);
    const [isSetLocation, setIsSetLocation] = useState(false);

    const onRegionChange = (region) => {
        setLocation({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
        })
        console.log(region)
    }
    const getAddress = (latitude, longitude) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' +
            location.latitude + ',' + location.longitude + '&key=' + 'AIzaSyCb_m2mZveyK0Ot2vXFeOqa_uM8ICvauyM&callback=initMap&language=ko'
        ).then((response) => response.json()).then((responseJson) => {
            setPlace(responseJson.results[0].formatted_address);
        })
    }
    const updateLocation = (Location) => {
        setLocation({
            latitude: Location.lat,
            longitude: Location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
    }
    const saveLocation = async () => {
        try {
            await AsyncStorage.setItem('location', String(place));
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        var latitude = null;
        var longitude = null;
        Geolocation.getCurrentPosition(
            position => {
                latitude = JSON.stringify(position.coords.latitude);
                longitude = JSON.stringify(position.coords.longitude);
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        if(place === ''){
            getAddress(latitude, longitude);
        }
    },[]);
    useEffect(() => {
        return () => {
            console.log('unmount');
        }
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                onRegionChange={(region) => { onRegionChange(region) }}
                initialRegion={location}
                showsMyLocationButton={true}>
                <Marker
                    coordinate={location} />
            </MapView>
            <View style = {{
                    position: 'absolute',
                    top : '94%',
                    right : '2%',
                    alignSelf: 'flex-end',
                }}>
                    <TouchableOpacity style={styles.Button} onPress={()=>{
                        saveLocation();
                        setIsSetLocation(true);
                        navigation.dispatch(CommonActions.reset({
                            index : 0,
                            routes : [{name : 'PostWrite', params : {
                                latitude : location.latitude,
                                longitude : location.longitude,
                                place : place
                            }}],
                        }))}}>
                        <Text style={styles.Text}>확인</Text>
                    </TouchableOpacity>
                </View>
            <View style={{
                position: "absolute",
                top: 0,
                alignSelf: "stretch",
                right: 0,
                left: 0,
                flex: 1,
            }}>
                <GooglePlacesAutocomplete
                    placeholder="주소 검색"
                    styles={{
                        textInput: {
                            borderRadius: 0,
                            height: 40,
                        }
                    }}
                    renderRightButton={() => <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            height: 40,
                        }}
                        onPress={() => { mapRef.current.animateToRegion(location, 1000);
                            getAddress(location.latitude, location.longitude);}}>
                        <Text>지도에서 찾기</Text>
                    </TouchableOpacity>}
                    fetchDetails={true}
                    minLength={2}
                    onPress={(data, details = null) => {
                        updateLocation(details.geometry.location);
                    }}
                    query={{
                        key: 'AIzaSyCb_m2mZveyK0Ot2vXFeOqa_uM8ICvauyM',
                        language: 'ko',
                    }}>
                </GooglePlacesAutocomplete>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Button: {
        width: 80,
        height: 40,
        paddingTop: 5,
        marginLeft: 'auto',
        borderRadius: 5,
        backgroundColor: "#27BAFF"
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
})
export default Map;