import { useEffect } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import RosterPage from './components/roster/RosterPage'
import CharacterSheetPage from './components/sheet/CharacterSheetPage'
import LevelUpPage from './components/levelup/LevelUpPage'
import CreateCharacterPage from './components/create/CreateCharacterPage'
import EditCharacterPage from './components/create/EditCharacterPage'
import CompendiumPage from './components/compendium/CompendiumPage'
import { DensityToggle } from './components/ui/DensityToggle'
import { AccentPicker } from './components/ui/AccentPicker'
import { ThemeModePicker } from './components/ui/ThemeModePicker'
import { SkinPicker } from './components/ui/SkinPicker'

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
              <DensityToggle label="Layout density" />
              {/* Skin sets the world, accent picks the hue within it, mode sets
                  the light — so skin sits next to accent, and the two controls
                  the user learns together (accent/mode) never move apart. */}
              <SkinPicker label="Visual style" />
              <AccentPicker label="Accent colour" />
              <ThemeModePicker label="Colour mode" />
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
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
