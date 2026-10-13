import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Notice from './components/Notice.jsx'
import { initHub, requireUser } from './lib/hub'

const root = createRoot(document.getElementById('root'))

// Students sign in once, at the class hub: render the calculator only for a signed-in person.
async function start() {
  try {
    initHub()
  } catch (error) {
    root.render(<Notice>{String(error.message || error)}</Notice>)
    return
  }
  root.render(<Notice>Checking your class sign-in…</Notice>)
  try {
    await requireUser() // signed-out visitors go to the hub's sign-in and come back
  } catch {
    root.render(
      <Notice>
        <p>Couldn&apos;t reach the class hub to check your sign-in.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
      </Notice>
    )
    return
  }
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
