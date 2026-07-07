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
  let listener: PluginListenerHandle | null = null
  let shouldRemoveAfterSetup = false

  void App.addListener('appStateChange', (state) => {
    onChange(toActivityState(state.isActive))
  })
    .then((handle) => {
      if (shouldRemoveAfterSetup) {
        void handle.remove()
        return
      }

      listener = handle
    })
    .catch((error: unknown) => {
      onError(getLifecycleErrorMessage(error))
    })

  return {
    async remove() {
      shouldRemoveAfterSetup = true
      await listener?.remove()
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
