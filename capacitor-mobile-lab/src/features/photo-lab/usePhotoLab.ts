import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const platform = useMemo(() => getPlatform(), [])
  const [state, setState] = useState<PhotoLabState>({
    appActivity: null,
    deviceInfo: null,
    errorMessage: null,
    isBusy: true,
    platform,
    photoMetadata: null,
    previewPath: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadInitialState() {
      try {
        const [deviceInfo, appActivity, photoMetadata] = await Promise.all([
          getBasicDeviceInfo(),
          getCurrentAppActivity(),
          loadPhotoMetadata(),
        ])

        if (!isMounted) {
          return
        }

        setState((current) => ({
          ...current,
          appActivity,
          deviceInfo,
          isBusy: false,
          photoMetadata,
          previewPath: photoMetadata?.webPath ?? null,
        }))
      } catch (error) {
        if (!isMounted) {
          return
        }

        setState((current) => ({
          ...current,
          errorMessage: getErrorMessage(error),
          isBusy: false,
        }))
      }
    }

    void loadInitialState()

    const subscription = watchAppActivity(
      (appActivity) => {
        setState((current) => ({ ...current, appActivity }))
      },
      (message) => {
        setState((current) => ({ ...current, errorMessage: message }))
      },
    )

    return () => {
      isMounted = false
      void subscription.remove()
    }
  }, [])

  const selectPhoto = useCallback(
    async (source: PhotoSource) => {
      setState((current) => ({
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

        setState((current) => ({
          ...current,
          isBusy: false,
          photoMetadata: metadata,
          previewPath: photo.webPath,
        }))
      } catch (error) {
        setState((current) => ({
          ...current,
          errorMessage: getCameraErrorMessage(error),
          isBusy: false,
        }))
      }
    },
    [platform],
  )

  const clearSavedData = useCallback(async () => {
    setState((current) => ({
      ...current,
      errorMessage: null,
      isBusy: true,
    }))

    try {
      await clearPhotoMetadata()

      setState((current) => ({
        ...current,
        isBusy: false,
        photoMetadata: null,
        previewPath: null,
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        errorMessage: getErrorMessage(error),
        isBusy: false,
      }))
    }
  }, [])

  return {
    ...state,
    clearSavedData,
    selectPhoto,
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.'
}
