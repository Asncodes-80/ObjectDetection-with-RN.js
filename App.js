import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// TF
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
// Lib for image picker android/ios
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons';
// Expo Permission 
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { model } from '@tensorflow/tfjs'
const App = () => {
  const [img, setImg] = useState('');

  const selectImage = async () => {
    try {
        const response = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4]
        });
      if (!response.cancelled) {
        // Create JS Object to select Image from img state 
        const source = { uri: response.uri }
        setImg(source);
      }
    } catch (err) {
      alert(err)
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTxt}>Welcome TFJS</Text>

      <View style={styles.sectionB}>
        {img === '' ? <Image
          style={styles.imgPlace}
          source={require('./assets/img/imgPlace.png')} />
          : <Image
            style={styles.imgPlace}
            source={img} />}

        <TouchableOpacity
          onPress={() => {
            selectImage()
          }}
          onLongPress={()=>{
            setImg('');
          }}
          style={styles.btnItems}>
          <Ionicons
            name="md-add"
            style={styles.addButton}
            size={30}
            color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  welcomeTxt: {
    fontSize: 25,
    alignSelf: 'center',
    marginTop: 80,
    fontWeight: 'bold',
    marginBottom: 30
  },
  sectionB: {
    alignSelf: 'center',
    alignItems: 'flex-end'
  },
  imgPlace: {
    width: Dimensions.get('window').width - 100,
    height: 300,
    borderRadius: 10
  },
  btnItems: {
    backgroundColor: '#3b416c',
    width: 50,
    height: 50,
    borderRadius: 100,
    marginTop: -25,
    marginRight: -10
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 10
  },
});
export default App;