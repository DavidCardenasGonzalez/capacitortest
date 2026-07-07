import { Capacitor } from '@capacitor/core'

export type AppPlatform = 'web' | 'ios' | 'android'

export function getPlatform(): AppPlatform {
  const platform = Capacitor.getPlatform()

  if (platform === 'ios' || platform === 'android') {
    return platform
  }

  return 'web'
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}
