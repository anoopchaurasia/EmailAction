import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Utility {
    static multipart = async response => {
        const contentType = response.headers.get('Content-Type');
        //return console.log(contentType, await response.text());
        if (contentType && contentType.includes('multipart/mixed')) {
            const boundary = contentType.split('boundary=')[1];
            return response.text().then(text => {
                const parts = text.split(`--${boundary}`);
                return parts.map(part => {
                    
                    const [headers, ...body] = part.split('\r\n\r\n');
                    return { headers: headers, body: body.filter(x => x && x.trim()[0] == "{").map(x => {
                        try{
                           return JSON.parse(x)
                        } catch(e) {
                            console.error(x, "ererer")
                        } }
                        )[0] };
                });
            });
        } else {
            console.log(contentType, "contentType", await response.text())
        }
    }

    static saveData = async function (key, value = "done") {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    static getData = async function (key) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.log('Error retrieving data:', error);
        }
    }
    static deleteData = function (key) {
        return AsyncStorage.removeItem(key);
    }
}


