import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
    FlatList,
    PanGestureHandler,
    RectButton,
    Swipeable,
} from 'react-native-gesture-handler';
import MyText from './../component/MyText'

export default function App(flatdata) {


    return (
        <FlatList
            {...flatdata}
            renderItem={(data) => <SwipeableItem item={flatdata.renderItem(data)} itemContainerStyle={flatdata. itemContainerStyle} />}
        />
    );
}

function SwipeableItem({ item, itemContainerStyle }) {
    const swipeableRef = useRef(null);
    let leftActions = item.props.leftActions
    let dragX;
    let width= 100/leftActions.length*2;
    const renderLeftActions = (progress, dragXx) => {
        dragX = dragXx;
        return (
            <View style={styles.leftActionContainer}>
                <Animated.View style={[styles.leftAction]}>
                    {
                        leftActions.map((x, i) => 
                            <RectButton key={x.name} style={{ ...styles.actionButton, width: width, backgroundColor: x.bgColor }}>
                                <MyText style={styles.actionText}>{x.name}</MyText>
                            </RectButton>
                         )

                    }
               
                </Animated.View>
            </View>
        );
    };



    const onSwipeableLeftOpen = () => {
        const x = dragX.__getValue();
        console.log(x);
        let start=0, i=0;
        let width= 100/leftActions.length*2;
        close();
        while(i<leftActions.length){
            if(x>start && x<start+width){
                leftActions[i].action(item.props.item)
                break;
            }
            i++;
            start+=width;
        }
    };

    const renderRightActions = (progress) => {
        return (
            <RectButton style={styles.rightAction} onPress={close}>
                <MyText style={{ ...styles.actionText}}>Delete</MyText>
            </RectButton>
        );
    };

    const close = () => {
        swipeableRef.current.close();
    };

    return (
        <Swipeable
            ref={swipeableRef}
            friction={2}
            containerStyle={{marginTop: 10, borderRadius: 10}}
            leftThreshold={50}
            renderLeftActions={renderLeftActions}
            onSwipeableLeftOpen={onSwipeableLeftOpen}
            renderRightActions={renderRightActions}>
            <Animated.View style={{...itemContainerStyle}}>
                {item}
            </Animated.View>
        </Swipeable>
    );
}
const styles = StyleSheet.create({
    item: {
       
    },
    itemText: {
        fontSize: 18,
        color: '#333',
    },
    leftActionContainer: {
        width: 200,
        justifyContent: 'center',
    },
    leftAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flex: 1,
        height: "100%",
        borderRightWidth: 1,
        borderRightColor: 'GREEN',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});