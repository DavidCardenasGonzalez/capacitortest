import { StatusBar, Style } from '@capacitor/status-bar'
import { isNativePlatform } from './platform.service'

export async function setupStatusBar(): Promise<void> {
  if (!isNativePlatform()) {
    return
  }

  await StatusBar.setStyle({ style: Style.Light })
  await StatusBar.setBackgroundColor({ color: '#f8fafc' })
}
