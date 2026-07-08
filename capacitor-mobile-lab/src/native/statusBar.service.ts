import { StatusBar, Style } from '@capacitor/status-bar'
import { isNativePlatform } from './platform.service'

export async function setupStatusBar(): Promise<void> {
  if (!isNativePlatform()) {
    return
  }

  try {
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#f8fafc' })
  } catch (error) {
    console.warn('Unable to configure the native status bar.', error)
  }
}
