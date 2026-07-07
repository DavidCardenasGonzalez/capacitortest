import { useEffect } from 'react'
import { PhotoLabPage } from '../features/photo-lab/PhotoLabPage'
import { setupStatusBar } from '../native/statusBar.service'

export default function App() {
  useEffect(() => {
    void setupStatusBar()
  }, [])

  return <PhotoLabPage />
}
