import { useCallback, useEffect, useRef, useState } from 'react'
import type { SetStateAction } from 'react'
import {
  capturePhoto,
  getCameraErrorMessage,
  type PhotoSource,
} from '../../native/camera.service'
import {
  getCurrentAppActivity,
  watchAppActivity,
} from '../../native/appLifecycle.service'
import { getBasicDeviceInfo } from '../../native/device.service'
import {
  clearPhotoMetadata,
  loadPhotoMetadata,
  savePhotoMetadata,
} from '../../native/preferences.service'
import { getPlatform } from '../../native/platform.service'
import type { PhotoLabState } from './photoLab.types'

export function usePhotoLab() {
  const [platform] = useState(getPlatform)
  const isMountedRef = useRef(false)
  const [state, setState] = useState<PhotoLabState>({
    appActivity: null,
    deviceInfo: null,
    errorMessage: null,
    isBusy: true,
    platform,
    photoMetadata: null,
    previewPath: null,
  })

  const updateState = useCallback((update: SetStateAction<PhotoLabState>) => {
    if (isMountedRef.current) {
      setState(update)
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    async function loadInitialState() {
      try {
        const [deviceInfo, appActivity, photoMetadata] = await Promise.all([
          getBasicDeviceInfo(),
          getCurrentAppActivity(),
          loadPhotoMetadata(),
        ])

        updateState((current) => ({
          ...current,
          appActivity,
          deviceInfo,
          isBusy: false,
          photoMetadata,
          previewPath: photoMetadata?.webPath ?? null,
        }))
      } catch (error) {
        updateState((current) => ({
          ...current,
          errorMessage: getErrorMessage(error),
          isBusy: false,
        }))
      }
    }

    void loadInitialState()

    const subscription = watchAppActivity(
      (appActivity) => {
        updateState((current) => ({ ...current, appActivity }))
      },
      (message) => {
        updateState((current) => ({ ...current, errorMessage: message }))
      },
    )

    return () => {
      void subscription.remove()
    }
  }, [updateState])

  const selectPhoto = useCallback(
    async (source: PhotoSource) => {
      updateState((current) => ({
        ...current,
        errorMessage: null,
        isBusy: true,
      }))

      try {
        const photo = await capturePhoto(source)
        const metadata = {
          photoUri: photo.uri ?? photo.webPath,
          webPath: photo.webPath,
          createdAt: new Date().toISOString(),
          platform,
        }

        await savePhotoMetadata(metadata)

        updateState((current) => ({
          ...current,
          isBusy: false,
          photoMetadata: metadata,
          previewPath: photo.webPath,
        }))
      } catch (error) {
        updateState((current) => ({
          ...current,
          errorMessage: getCameraErrorMessage(error),
          isBusy: false,
        }))
      }
    },
    [platform, updateState],
  )

  const clearSavedData = useCallback(async () => {
    updateState((current) => ({
      ...current,
      errorMessage: null,
      isBusy: true,
    }))

    try {
      await clearPhotoMetadata()

      updateState((current) => ({
        ...current,
        isBusy: false,
        photoMetadata: null,
        previewPath: null,
      }))
    } catch (error) {
      updateState((current) => ({
        ...current,
        errorMessage: getErrorMessage(error),
        isBusy: false,
      }))
    }
  }, [updateState])

  return {
    ...state,
    clearSavedData,
    selectPhoto,
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}
