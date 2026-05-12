import { View, ActivityIndicator } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { colors } from '../lib/colors'

WebBrowser.maybeCompleteAuthSession()

export default function OAuthCallback() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.cyan} size="large" />
    </View>
  )
}
