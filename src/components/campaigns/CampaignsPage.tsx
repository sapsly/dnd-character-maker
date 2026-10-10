import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAuthDialog } from '../../context/AuthDialogContext'
import {
  createCampaign,
  joinCampaign,
  listMyCampaigns,
  type Campaign,
} from '../../lib/campaigns'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { Modal } from '../ui/Modal'
import { Tag } from '../ui/Tag'
import { TextInput } from '../ui/TextInput'
import { Tooltip } from '../ui/Tooltip'
import '../../styles/campaigns.css'

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ234567'
const JOIN_CODE_LENGTH = 6

function generateJoinCode(length = JOIN_CODE_LENGTH): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)]
  }
  return code
}

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth()
  const { openSignIn } = useAuthDialog()
  const navigate = useNavigate()

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newCampaignOpen, setNewCampaignOpen] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')
  const [newCampaignJoinCode, setNewCampaignJoinCode] = useState('')
  const [newCampaignError, setNewCampaignError] = useState<string | null>(null)
  const [newCampaignSubmitting, setNewCampaignSubmitting] = useState(false)

  const [joinCampaignOpen, setJoinCampaignOpen] = useState(false)
  const [joinCodeInput, setJoinCodeInput] = useState('')
  const [joinCampaignError, setJoinCampaignError] = useState<string | null>(null)
  const [joinCampaignSubmitting, setJoinCampaignSubmitting] = useState(false)

  // Clear campaigns state when user signs out
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setCampaigns([])
      setError(null)
      setLoading(false)
    }
  }, [user, authLoading])

  // Load campaigns when auth state settles
  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false)
      return
    }
    const load = async () => {
      setLoading(true)
      setError(null)
      const result = await listMyCampaigns(user.uid)
      if (result.ok) {
        setCampaigns(result.value)
      } else {
        setError(result.error ?? 'Failed to load campaigns')
      }
      setLoading(false)
    }
    load()
  }, [user, authLoading])

  // Regenerate join code
  const handleRegenerateCode = () => {
    setNewCampaignJoinCode(generateJoinCode())
  }

  // Handle new campaign submit
  const handleNewCampaignSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (newCampaignSubmitting || !user) return
    setNewCampaignError(null)
    setNewCampaignSubmitting(true)

    const name = newCampaignName.trim()
    const code = newCampaignJoinCode.trim().toUpperCase() || undefined

    if (!name) {
      setNewCampaignError('Enter a campaign name.')
      setNewCampaignSubmitting(false)
      return
    }

    const result = await createCampaign(user.uid, name, code)
    if (result.ok && result.value) {
      setCampaigns((prev) => [result.value!, ...prev])
      setNewCampaignOpen(false)
      setNewCampaignName('')
      setNewCampaignJoinCode(generateJoinCode())
      navigate(`/campaigns/${result.value.id}`)
    } else {
      setNewCampaignError(result.error ?? 'Could not create campaign')
    }
    setNewCampaignSubmitting(false)
  }

  // Handle join campaign submit
  const handleJoinCampaignSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (joinCampaignSubmitting || !user) return
    setJoinCampaignError(null)
    setJoinCampaignSubmitting(true)

    const code = joinCodeInput.trim().toUpperCase()
    if (!code) {
      setJoinCampaignError('Enter a join code.')
      setJoinCampaignSubmitting(false)
      return
    }

    const result = await joinCampaign(user.uid, code)
    if (result.ok && result.value) {
      setCampaigns((prev) => [result.value!, ...prev])
      setJoinCampaignOpen(false)
      setJoinCodeInput('')
      navigate(`/campaigns/${result.value.id}`)
    } else {
      setJoinCampaignError(result.error ?? 'Could not join campaign')
    }
    setJoinCampaignSubmitting(false)
  }

  // Handle join code input change (uppercase transform)
  const handleJoinCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setJoinCodeInput(upper)
    setJoinCampaignError(null)
  }

  // Handle new campaign join code change
  const handleNewCampaignCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setNewCampaignJoinCode(upper)
    setNewCampaignError(null)
  }

  // Copy join code to clipboard
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Clipboard API not available or denied
    }
  }

  const memberCount = (campaign: Campaign) => Object.keys(campaign.members).length

  {/* ... */}
{/* Signed out state */}
  if (!user) {
    return (
      <section className="page campaigns-page">
        <header className="page-head">
          <h1 className="page-title">Campaigns</h1>
        </header>

        <Card className="campaigns-signed-out">
          <div className="campaigns-signed-out-content">
            <Icon name="book" size={48} className="campaigns-signed-out-icon" />
            <h2 className="campaigns-signed-out-title">Campaigns live in your account</h2>
            <p className="campaigns-signed-out-desc">
              Sign in to create campaigns, join games with a DM's code, and sync characters
              so the whole party can see each other's sheets.
            </p>
            <Button variant="primary" size="md" onClick={openSignIn} block>
              <Icon name="user" size={16} />
              <span>Sign in to continue</span>
            </Button>
          </div>
        </Card>
      </section>
    )
  }

  // Signed in - loading
  if (loading) {
    return (
      <section className="page campaigns-page">
        <header className="page-head">
          <h1 className="page-title">Campaigns</h1>
        </header>
        <div className="campaigns-loading">
          <p className="campaigns-loading-text">Loading campaigns…</p>
          <div className="campaigns-skeleton" />
          <div className="campaigns-skeleton" />
          <div className="campaigns-skeleton" />
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="page campaigns-page">
        <header className="page-head">
          <h1 className="page-title">Campaigns</h1>
        </header>
        <Card className="campaigns-error">
          <Icon name="alert" size={24} className="campaigns-error-icon" />
          <p className="campaigns-error-text">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="page campaigns-page">
      <header className="page-head">
        <h1 className="page-title">Campaigns</h1>
        <div className="page-actions">
          <Button variant="secondary" onClick={() => setJoinCampaignOpen(true)}>
            <Icon name="arrow-right" size={14} />
            <span>Join a campaign</span>
          </Button>
          <Button variant="primary" onClick={() => setNewCampaignOpen(true)}>
            <Icon name="plus" size={14} />
            <span>New campaign</span>
          </Button>
        </div>
      </header>

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create a new campaign to become the DM, or join one with a code from your DM."
          icon="book"
          action={
            <Button variant="primary" onClick={() => setNewCampaignOpen(true)}>
              <Icon name="plus" size={14} />
              <span>Create your first campaign</span>
            </Button>
          }
        />
      ) : (
        <ul className="campaigns-list">
          {campaigns.map((campaign) => (
            <li key={campaign.id} className="campaigns-list-item">
              <Link to={`/campaigns/${campaign.id}`} className="campaigns-list-link">
                <div className="campaigns-list-main">
                  <div className="campaigns-list-name-row">
                    <h3 className="campaigns-list-name">{campaign.name}</h3>
                    {campaign.dmUserId === user.uid && (
                      <Tag tone="accent" solid>
                        DM
                      </Tag>
                    )}
                  </div>
                  <div className="campaigns-list-meta">
                    <span className="campaigns-list-members">
                      <Icon name="user" size={12} />
                      {memberCount(campaign)} member{memberCount(campaign) !== 1 ? 's' : ''}
                    </span>
                    <Tooltip
                      text="Copy join code"
                      side="top"
                    >
                      <button
                        type="button"
                        className="campaigns-copy-btn"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyCode(campaign.joinCode)
                        }}
                        aria-label={`Copy join code ${campaign.joinCode}`}
                      >
                        <Icon name="download" size={14} />
                        <span className="campaigns-code">{campaign.joinCode}</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <Icon name="arrow-right" size={16} className="campaigns-list-chevron" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* New Campaign Modal */}
      <Modal
        open={newCampaignOpen}
        onClose={() => {
          setNewCampaignOpen(false)
          setNewCampaignError(null)
        }}
        title="New campaign"
        size="md"
      >
        <form className="campaigns-modal-form" onSubmit={handleNewCampaignSubmit}>
          <Field label="Campaign name" required error={newCampaignError || undefined}>
            <TextInput
              placeholder="The Lost Mine of Phandelver"
              value={newCampaignName}
              onValueChange={setNewCampaignName}
              maxLength={80}
              data-autofocus
            />
          </Field>

          <Field
            label="Join code"
            hint="6–8 characters. Letters and numbers only (no I, O, 0, 1). Leave blank to auto-generate."
          >
            <div className="campaigns-code-input-row">
              <TextInput
                placeholder="Auto-generated"
                value={newCampaignJoinCode}
                onValueChange={handleNewCampaignCodeChange}
                maxLength={8}
                spellCheck={false}
                autoCapitalize="characters"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon="upload"
                onClick={handleRegenerateCode}
                disabled={newCampaignSubmitting}
                aria-label="Regenerate join code"
              />
            </div>
          </Field>

          <Divider label="or" />

          <div className="campaigns-modal-footer">
            <Button type="button" variant="secondary" onClick={() => setNewCampaignOpen(false)} disabled={newCampaignSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={newCampaignSubmitting}>
              {newCampaignSubmitting ? 'Creating…' : 'Create campaign'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Join Campaign Modal */}
      <Modal
        open={joinCampaignOpen}
        onClose={() => {
          setJoinCampaignOpen(false)
          setJoinCampaignError(null)
          setJoinCodeInput('')
        }}
        title="Join a campaign"
        size="md"
      >
        <form className="campaigns-modal-form" onSubmit={handleJoinCampaignSubmit}>
          <Field label="Join code" required error={joinCampaignError || undefined}>
            <TextInput
              placeholder="ABC123"
              value={joinCodeInput}
              onValueChange={handleJoinCodeChange}
              maxLength={8}
              spellCheck={false}
              autoCapitalize="characters"
              data-autofocus
            />
          </Field>

          <Divider label="or" />

          <div className="campaigns-modal-footer">
            <Button type="button" variant="secondary" onClick={() => setJoinCampaignOpen(false)} disabled={joinCampaignSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={joinCampaignSubmitting}>
              {joinCampaignSubmitting ? 'Joining…' : 'Join campaign'}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}