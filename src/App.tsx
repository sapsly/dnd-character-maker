import { useEffect } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import RosterPage from './components/roster/RosterPage'
import CharacterSheetPage from './components/sheet/CharacterSheetPage'
import LevelUpPage from './components/levelup/LevelUpPage'
import CreateCharacterPage from './components/create/CreateCharacterPage'
import EditCharacterPage from './components/create/EditCharacterPage'
import CompendiumPage from './components/compendium/CompendiumPage'
import { HeaderSettings } from './components/ui/HeaderSettings'
import { AccountMenu } from './components/auth/AccountMenu'

function NotFoundPage() {
  return (
    <section className="page stub-page">
      <header className="page-head">
        <h1 className="page-title">Page not found</h1>
      </header>
      <div className="panel stub-panel">
        <p className="stub-lead">That address does not match any screen in this app.</p>
        <Link className="link" to="/">
          Back to roster
        </Link>
      </div>
    </section>
  )
}

/** Resets scroll position on every navigation. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppShell() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <header className="app-header">
        <div className="app-header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">
              d20
            </span>
            <span className="brand-name">Character Ledger</span>
          </Link>
          <div className="app-header-tools">
            <nav className="app-nav" aria-label="Primary">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                Roster
              </NavLink>
              <NavLink
                to="/compendium"
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                Compendium
              </NavLink>
            </nav>
            <div className="app-header-settings">
              {/* Account leads the strip: it is the control that must stay
                  visible when this row scrolls sideways on a phone, and the
                  only one that changes who is using the app. Settings stays
                  last so its popover anchors flush to the content edge, and
                  every appearance control — skin, density, accent, colour
                  mode — now lives inside it, leaving the strip to the account
                  and one whisper. */}
              <AccountMenu />
              <HeaderSettings />
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<RosterPage />} />
          <Route path="/compendium" element={<CompendiumPage />} />
          <Route path="/create" element={<CreateCharacterPage />} />
          <Route path="/character/:id/edit" element={<EditCharacterPage />} />
          <Route path="/character/:id" element={<CharacterSheetPage />} />
          <Route path="/character/:id/level-up" element={<LevelUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  )
}
