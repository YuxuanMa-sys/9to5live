// utils/ImagePickerHelper.js
import { Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export const launchImagePicker = async () => {
    await checkMediaPermissions();

    return new Promise((resolve, reject) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 800,
                maxWidth: 800,
                quality: 1,
            },
            (response) => {
                if (response.didCancel) {
                    resolve(null);  // 用户取消选择
                } else if (response.errorCode) {
                    reject(response.errorMessage);
                } else {
                    resolve(response.assets[0].uri);
                }
            }
        );
    });
};

const checkMediaPermissions = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: 'Permission to access gallery',
                message: 'We need your permission to access your photos',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return Promise.reject('We need permission to access your photos');
        }
    }
    // iOS: react-native-image-picker 自动在 pod 里处理授权
    return Promise.resolve();
};
