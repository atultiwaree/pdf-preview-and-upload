import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import axios from 'axios';

const App = () => {
  const [thumbnailPath, setThumbnailPath] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [progress, setProgress] = useState(0);

  const selectDocument = async () => {
    console.log(':::Select Document');
    const docInfo = await DocumentPicker.pick();
    console.log(':::Select Deocument -> File', docInfo);
    setDocInfo(docInfo);
    // generateThumbnail(docInfo[0].uri);// Just to test video upload
  };

  async function generateThumbnail(docPath) {
    console.log(':::TumbGen Input URI -> Path ', docPath);
    const {uri, width, height} = await PdfThumbnail.generate(docPath, 0);
    console.log(':::TumbGen Output URI -> Path ', uri);
    setThumbnailPath(uri);
  }

  async function uploadDoc() {
    try {
      const formData = new FormData();

      formData.append('pdf', docInfo[0]);

      const {data} = await axios.post(
        'http://175.168.2.61:3000/api/v1/user/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: e => {
            console.log('Progress', Math.floor((100 * e.loaded) / e.total));
          },
        },
      );
      console.log(data);
    } catch (e) {
      console.log('Error while uploading', e);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>PDF Preview</Text>
      <View style={styles.preImgWrapper}>
        <Image
          source={
            !thumbnailPath
              ? require('./assets/img/Untitled.jpg')
              : {uri: thumbnailPath}
          }
          style={styles.preImg}
          width={200}
          height={200}
        />
        <TouchableOpacity onPress={selectDocument}>
          <Text style={styles.title}>Select Document</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadDoc} style={{marginTop: 20}}>
          <Text style={styles.title}>Upload</Text>
        </TouchableOpacity>
        <Text>Pr</Text>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
  },
  title: {
    width: '40%',
    padding: 4,
    backgroundColor: '#732e89',
    borderRadius: 20,
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
  },
  preImgWrapper: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#732e89',
    overflow: 'hidden',
    objectFit: 'cover',
    borderRadius: 20,
    marginTop: 20,
    height: 'auto',
    padding: 20,
  },
  preImg: {
    width: '100%',
    objectFit: 'contain',
  },
});
