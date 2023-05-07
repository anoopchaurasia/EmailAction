import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  RectButton,
  Swipeable,
} from 'react-native-gesture-handler';

export default function App() {
  const data = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
];

return (
    <PanGestureHandler >
    <View style={styles.container}>
      <Text style={styles.title}>Swipeable List</Text>
      <View style={styles.list}>
        {data.map((item) => (
            <SwipeableItem key={item.id} item={item} />
            ))}
      </View>
    </View>
    </PanGestureHandler>
  );
}

function SwipeableItem({ item }) {
  const swipeableRef = useRef(null);

  const renderLeftActions = (progress) => {
    return (
      <RectButton style={styles.leftAction} onPress={close}>
        <Text style={styles.actionText}>Archive</Text>
      </RectButton>
    );
  };

  const renderRightActions = (progress) => {
    return (
      <RectButton style={styles.rightAction} onPress={close}>
        <Text style={styles.actionText}>Delete</Text>
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
      leftThreshold={80}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
        <Animated.View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </Animated.View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  list: {
    width: '80%',
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  leftAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    padding: 20,
  },
  rightAction: {
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    padding: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});