import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { usePhotoLab } from './usePhotoLab'

export function PhotoLabPage() {
  const {
    appActivity,
    clearSavedData,
    deviceInfo,
    errorMessage,
    isBusy,
    photoMetadata,
    platform,
    previewPath,
    selectPhoto,
  } = usePhotoLab()

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">React 18 + Vite + Capacitor</p>
          <h1>Capacitor Mobile Lab</h1>
        </div>
        <span className="platform-pill">{platform}</span>
      </header>

      {errorMessage ? <p className="alert">{errorMessage}</p> : null}

      <div className="content-grid">
        <Card title="Platform information">
          <dl className="info-list">
            <div>
              <dt>Runtime platform</dt>
              <dd>{platform}</dd>
            </div>
            <div>
              <dt>Plugin platform</dt>
              <dd>{deviceInfo?.platform ?? 'Loading...'}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>{deviceInfo?.model ?? 'Loading...'}</dd>
            </div>
            <div>
              <dt>OS</dt>
              <dd>
                {deviceInfo
                  ? `${deviceInfo.operatingSystem} ${deviceInfo.osVersion}`
                  : 'Loading...'}
              </dd>
            </div>
            <div>
              <dt>Manufacturer</dt>
              <dd>{deviceInfo?.manufacturer || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Virtual device</dt>
              <dd>{deviceInfo ? yesNo(deviceInfo.isVirtual) : 'Loading...'}</dd>
            </div>
            <div>
              <dt>WebView</dt>
              <dd>{deviceInfo?.webViewVersion || 'Unknown'}</dd>
            </div>
          </dl>
        </Card>

        <Card title="App lifecycle">
          <div className="status-row">
            <span
              className={`status-dot ${
                appActivity?.isActive ? 'status-dot--active' : ''
              }`}
            />
            <strong>{appActivity?.label ?? 'unknown'}</strong>
          </div>
          <p className="muted">
            Native state changes arrive through a service-backed listener and
            are removed when the React hook unmounts.
          </p>
        </Card>
      </div>

      <Card title="Camera and local persistence">
        <div className="action-row">
          <Button disabled={isBusy} onClick={() => void selectPhoto('camera')}>
            Take photo
          </Button>
          <Button
            disabled={isBusy}
            onClick={() => void selectPhoto('gallery')}
            variant="secondary"
          >
            Select photo
          </Button>
          <Button
            disabled={isBusy || !photoMetadata}
            onClick={() => void clearSavedData()}
            variant="danger"
          >
            Clear saved data
          </Button>
        </div>

        <div className="photo-layout">
          <div className="photo-preview">
            {previewPath ? (
              <img alt="Selected lab preview" src={previewPath} />
            ) : (
              <span>No photo selected</span>
            )}
          </div>

          <dl className="info-list">
            <div>
              <dt>Saved URI</dt>
              <dd className="breakable">
                {photoMetadata?.photoUri ?? 'Nothing saved yet'}
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>
                {photoMetadata
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(photoMetadata.createdAt))
                  : 'Nothing saved yet'}
              </dd>
            </div>
            <div>
              <dt>Saved platform</dt>
              <dd>{photoMetadata?.platform ?? 'Nothing saved yet'}</dd>
            </div>
          </dl>
        </div>
      </Card>
    </main>
  )
}

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}
