import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { BookingProvider } from './context/BookingContext'
import { UserProvider } from './context/UserContext'

// Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BookingProvider>
          <SafeAreaProvider>
            <AppNavigation />
          </SafeAreaProvider>
        </BookingProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
