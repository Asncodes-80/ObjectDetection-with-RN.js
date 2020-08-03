import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView, StatusBar } from 'react-native';
// TF
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
// Lib for image picker android/ios
import * as ImagePicker from 'expo-image-picker'
import { Ionicons, AntDesign } from '@expo/vector-icons';
// Expo Permission 
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
const App = () => {
  // State for holding  TensorFlow is Ready:
  const [tfReady, setTFReady] = useState(false)
  // State for holding  Model is Ready:
  const [modelReady, setModelReady] = useState(false)
  // To have any predictions:
  const [allPredictions, setPredict] = useState(null)
  // Image URI for putting and computing
  // Picture for processing any issue and solve predictions:
  const [img, setImg] = useState('');

  const [likeModel, setLikeModel] = useState('');

  // Create Component Did Mount (useEffect) with Hook API new method with me
  // If tf.js is ready you will see "TF.js is ready"
  // If Model is ready you will see "Model ready"
  useEffect(()=>{
    const waitForReadyTF = async() =>{
      // Wait for reading Tensor
      await tf.ready()
      // Signal to the tfReady (State) for showing to user (TF is Ready)
      setTFReady(true)

      // Loading Model with Mobilenet
      // What is the MobileNet?
      // Mobilenet is a architecture model 
      // for mobile vision and Image Classification.
      const model = await mobilenet.load()
      setLikeModel(model)
      setModelReady(true)
      // Ask for Camera permission function
      cameraPermission()
    }
    waitForReadyTF()
  })
  // Allow user the camera permission to use our app
  const cameraPermission = async() =>{
    if(Constants.platform.android){
      const status = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status != 'granted'){
        Alert.alert("Permission not detections!", `
          Please allow to your Camera to work with my app!`);
      }
    }
  }
  // image to tensor function has a 1. args 
  // that import image and converting to array 
  // and ready to classify with tensorflow!
  const imageToTensor = (rawImageData) =>{
    // In this function at first 
    // we will convert image to array uin 8 
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop to alpha channel info for mobilenet:
    const buffer = new Uint8Array(width * height * 3)
    var offset = 0
    for (var i = 0; i < buffer.length; i+=3){
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 3] = data[offset + 2]

      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  const classifyImage = async () => {
    try{
      console.log("==================Classify image section==================")
      console.log("This is image uri: ")
      console.log(img)
      console.log("======================================================")
      // Getting image that selected by user 
      // with imageAssetPath we specify this file is image and adding as assets
      const imageAssetPath = Image.resolveAssetSource(img)
      // Getting imageAssetPath as uri and converting to is Binary
      const response = await fetch(imageAssetPath.uri, {}, {isBinary: true})
      const rawImageData = await response.arrayBuffer()
      const imageTensor = imageToTensor(rawImageData)
      // Will be see an big big big Error!
      const predictions = await likeModel.classify(imageTensor)
      setPredict(predictions)
      console.log(allPredictions)
    }catch(err){
      console.log(err)
    }
  }

  // Selecting Img from Camera Roll
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
          // Lets goo to classify your image
          classifyImage()
      }
    } catch (err) {
      alert(err)
    }
  }
  return (
    <View style={styles.container}>
    <StatusBar barStyle="light-content"/>
     {/* If tf ready is really ready you can show on app TF status  */}
      {tfReady? 
        <Text style={styles.tfReadyStatusConnection}>TF is Ready!</Text> 
        : <Text style={styles.tfReadyStatusDontConnection}>Connecting...</Text>}
      <Text style={styles.welcomeTxt}>Classify your image</Text>

      <View style={styles.sectionB}>
        {img === '' ? <View style={styles.imgPlace}>
          <AntDesign style={{marginTop: 70}} name="picture" size={120} color="white" />
        </View> 
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

        <Text>Predictions: {allPredictions}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  welcomeTxt: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: 30,
    color: '#FFF'
  },
  sectionB: {
    alignSelf: 'center',
    alignItems: 'flex-end'
  },
  imgPlace: {
    width: Dimensions.get('window').width - 100,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center'
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
  tfReadyStatusConnection: {
    fontSize: 10,
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#8f5',
    marginTop: 50,
    marginHorizontal: 50,
  },
  tfReadyStatusDontConnection: {
    fontSize: 10,
    alignSelf: 'flex-start',
    textAlign: 'left',
    justifyContent: 'center',
    color: '#d03',
    marginTop: 50
  },
});
export default App;