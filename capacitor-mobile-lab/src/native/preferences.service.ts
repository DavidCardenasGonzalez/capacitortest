import { Preferences } from '@capacitor/preferences'
import type { AppPlatform } from './platform.service'

const PHOTO_METADATA_KEY = 'photo-lab:last-photo'

export interface StoredPhotoMetadata {
  photoUri: string
  webPath: string
  createdAt: string
  platform: AppPlatform
}

export async function savePhotoMetadata(
  metadata: StoredPhotoMetadata,
): Promise<void> {
  await Preferences.set({
    key: PHOTO_METADATA_KEY,
    value: JSON.stringify(metadata),
  })
}

export async function loadPhotoMetadata(): Promise<StoredPhotoMetadata | null> {
  const result = await Preferences.get({ key: PHOTO_METADATA_KEY })

  if (!result.value) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(result.value)
    if (isStoredPhotoMetadata(parsed)) {
      return parsed
    }

    await clearPhotoMetadata()
    return null
  } catch {
    await clearPhotoMetadata()
    return null
  }
}

export async function clearPhotoMetadata(): Promise<void> {
  await Preferences.remove({ key: PHOTO_METADATA_KEY })
}

function isStoredPhotoMetadata(value: unknown): value is StoredPhotoMetadata {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const metadata = value as Record<string, unknown>

  return (
    typeof metadata.photoUri === 'string' &&
    typeof metadata.webPath === 'string' &&
    typeof metadata.createdAt === 'string' &&
    !Number.isNaN(Date.parse(metadata.createdAt)) &&
    isKnownPlatform(metadata.platform)
  )
}

function isKnownPlatform(value: unknown): value is AppPlatform {
  return value === 'web' || value === 'ios' || value === 'android'
}
