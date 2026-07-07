import {
  Camera,
  CameraErrorCode,
  MediaType,
  MediaTypeSelection,
} from '@capacitor/camera'
import type { MediaResult } from '@capacitor/camera'

export interface CapturedPhoto {
  uri?: string
  webPath: string
  format?: string
}

export type PhotoSource = 'camera' | 'gallery'

export async function capturePhoto(source: PhotoSource): Promise<CapturedPhoto> {
  const media =
    source === 'camera'
      ? await Camera.takePhoto({
          quality: 80,
          targetWidth: 1280,
          targetHeight: 1280,
          webUseInput: true,
        })
      : await chooseSinglePhotoFromGallery()

  if (media.type !== MediaType.Photo || !media.webPath) {
    throw new Error('No photo was returned by the camera plugin.')
  }

  return {
    uri: media.uri,
    webPath: media.webPath,
    format: media.metadata?.format,
  }
}

async function chooseSinglePhotoFromGallery(): Promise<MediaResult> {
  const result = await Camera.chooseFromGallery({
    allowMultipleSelection: false,
    mediaType: MediaTypeSelection.Photo,
    quality: 80,
    targetWidth: 1280,
    targetHeight: 1280,
    webUseInput: true,
  })

  const [photo] = result.results

  if (!photo) {
    throw new Error('No photo was selected.')
  }

  return photo
}

export function getCameraErrorMessage(error: unknown): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case CameraErrorCode.CameraPermissionDenied:
        return 'Camera permission was denied. Enable camera access and try again.'
      case CameraErrorCode.GalleryPermissionDenied:
        return 'Photo library permission was denied. Enable photo access and try again.'
      case CameraErrorCode.TakePhotoCancelled:
      case CameraErrorCode.ChooseMediaCancelled:
        return 'Photo selection was cancelled.'
      case CameraErrorCode.NoCameraAvailable:
        return 'No camera is available on this device.'
      default:
        return error.message || 'The camera plugin returned an error.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to open the camera or photo library.'
}

function isErrorWithCode(
  error: unknown,
): error is { code: CameraErrorCode; message?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  )
}
