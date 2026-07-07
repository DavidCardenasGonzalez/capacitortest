import { Device } from '@capacitor/device'
import type { DeviceInfo } from '@capacitor/device'

export interface BasicDeviceInfo {
  model: string
  platform: DeviceInfo['platform']
  operatingSystem: DeviceInfo['operatingSystem']
  osVersion: string
  manufacturer: string
  isVirtual: boolean
  webViewVersion: string
}

export async function getBasicDeviceInfo(): Promise<BasicDeviceInfo> {
  const info = await Device.getInfo()

  return {
    model: info.model,
    platform: info.platform,
    operatingSystem: info.operatingSystem,
    osVersion: info.osVersion,
    manufacturer: info.manufacturer,
    isVirtual: info.isVirtual,
    webViewVersion: info.webViewVersion,
  }
}
