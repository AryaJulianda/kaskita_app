import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function WaveButton() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const startX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const endX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <TouchableOpacity style={styles.container}>
      <AnimatedLinearGradient
        colors={["#ff4d6d", "#4d9eff", "#b0ff1d"]}
        start={{ x: startX as any, y: 0 }}
        end={{ x: endX as any, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>Wave Button</Text>
      </AnimatedLinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    overflow: "hidden",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
