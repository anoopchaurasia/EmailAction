import {Text} from 'react-native';
import { useTheme } from '@react-navigation/native';


export default function MyText(props) {
    const colors = useTheme().colors;
    props = {...props};
     props.style =  props.style || {};
    return <Text style = {[{ color: colors.text }, props.style]} {...props} />
}