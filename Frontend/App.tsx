import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'; // đường dẫn có thể điều chỉnh nếu khác
// Nếu bạn đang dùng TypeScript thì file nên là AppNavigator.tsx

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;