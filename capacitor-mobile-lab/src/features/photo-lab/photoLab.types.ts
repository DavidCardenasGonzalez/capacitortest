import type { AppActivityState } from '../../native/appLifecycle.service'
import type { BasicDeviceInfo } from '../../native/device.service'
import type { StoredPhotoMetadata } from '../../native/preferences.service'
import type { AppPlatform } from '../../native/platform.service'

export interface PhotoLabState {
  appActivity: AppActivityState | null
  deviceInfo: BasicDeviceInfo | null
  errorMessage: string | null
  isBusy: boolean
  platform: AppPlatform
  photoMetadata: StoredPhotoMetadata | null
  previewPath: string | null
}
