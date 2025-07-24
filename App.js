import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { BookingProvider } from './context/BookingContext'

// Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </BookingProvider>
    </ThemeProvider>
  );
}
