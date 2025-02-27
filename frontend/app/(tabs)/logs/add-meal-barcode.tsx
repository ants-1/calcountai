import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';

const AddMealBarcode = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState<Boolean>(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState<Boolean>(false);

  const router = useRouter();

  // Request camera permissions
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await requestPermission();
      if (status === 'granted') {
        setIsScanning(false); 
      }
    };
    getPermissions();
  }, [requestPermission]);

  // Handle the scanned barcode
  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    if (!isScanning || scanned) return;

    setScanned(true);
    setBarcode(data);

    // Display the barcode alert
    Alert.alert('Scanned Barcode', `Type: ${type}\nData: ${data}`, [
      {
        text: 'Add to Meal',
        onPress: () => {
          alert('Barcode added to meal!');
          router.push("/(tabs)/logs/meals");  
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          setScanned(false);  
          setIsScanning(false);
        },
      },
    ]);

    setIsScanning(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-transparent">
        <Text className="text-lg text-white">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        onBarcodeScanned={({ type, data }) => handleBarCodeScanned({ type, data })}
      >
        <TouchableOpacity
          className="absolute top-20 left-5 p-3 bg-gray-200 rounded-lg"
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-500 px-10 py-4 rounded-lg"
          onPress={() => {
            setIsScanning(true); 
            setScanned(false);  
          }}
        >
          <Text className="text-white text-lg font-bold">Scan Barcode</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
};

export default AddMealBarcode;
