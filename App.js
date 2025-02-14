import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Start watching location
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Use high accuracy for better results
          timeInterval: 1000, // Update every 2 seconds
          distanceInterval: 0.5, // Update every 1 meter
        },
        (newLocation) => {
          setLocation(newLocation);
          setLastUpdateTime(performance.now());
        }
      );

      setSubscription(sub);
    })();

    // Cleanup function to stop location tracking
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);


  const getTimeSinceLastUpdate = () => {
    if (!lastUpdateTime) return null;
    const now = performance.now();
    const timeDiff = now - lastUpdateTime; // Time difference in milliseconds
    return timeDiff.toPrecision(2); // Return time in seconds
  };

  return (
    <View style={styles.container}>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <>
        <Text>
          Latitude: {location.coords.latitude}{"\n"}
          Longitude: {location.coords.longitude}{"\n"}
          Altitude: {location.coords.altitude}{"\n"}
          Speed: {location.coords.speed} m/s
        </Text>
        <Text>Time since last update: {getTimeSinceLastUpdate()} milliseconds</Text>
        </>
      ) : (
        <Text>Waiting for location...</Text>
      )}
      <Text>{Date()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "salmon"
  },
});

export default App;
