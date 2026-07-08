import { App } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'

export interface AppActivityState {
  isActive: boolean
  label: 'active' | 'background'
}

export interface LifecycleSubscription {
  remove: () => Promise<void>
}

export async function getCurrentAppActivity(): Promise<AppActivityState> {
  const state = await App.getState()
  return toActivityState(state.isActive)
}

export function watchAppActivity(
  onChange: (state: AppActivityState) => void,
  onError: (message: string) => void,
): LifecycleSubscription {
  let isRemoved = false

  const listenerPromise = App.addListener('appStateChange', (state) => {
    if (!isRemoved) {
      onChange(toActivityState(state.isActive))
    }
  })
    .then(async (handle) => {
      if (isRemoved) {
        await removeListener(handle)
        return null
      }

      return handle
    })
    .catch((error: unknown) => {
      if (!isRemoved) {
        onError(getLifecycleErrorMessage(error))
      }

      return null
    })

  return {
    async remove() {
      isRemoved = true
      const listener = await listenerPromise
      await removeListener(listener)
    },
  }
}

function toActivityState(isActive: boolean): AppActivityState {
  return {
    isActive,
    label: isActive ? 'active' : 'background',
  }
}

function getLifecycleErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Unable to subscribe to app lifecycle events.'
}

async function removeListener(
  listener: PluginListenerHandle | null,
): Promise<void> {
  await listener?.remove()
}
