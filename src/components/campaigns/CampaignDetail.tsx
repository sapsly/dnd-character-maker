import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCharacters } from '../../hooks/useCharacters'
import {
  getCampaign,
  getCampaignCharacters,
  removeCampaignMember,
  deleteCampaign,
  syncCharacterToCampaign,
  removeCharacterFromCampaign,
  leaveCampaign,
  type Campaign,
  type CampaignCharacter,
} from '../../lib/campaigns'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { EmptyState } from '../ui/EmptyState'
import { Field } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Tag } from '../ui/Tag'
import { Tooltip } from '../ui/Tooltip'
import { ABILITY_KEYS, ABILITY_ABBREV } from '../../types/character'
import '../../styles/campaigns.css'

export default function CampaignDetail() {
  const { user, loading: authLoading } = useAuth()
  const { characters: myCharacters } = useCharacters()
  const { campaignId } = useParams<{ campaignId: string }>()
  const navigate = useNavigate()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [campaignCharacters, setCampaignCharacters] = useState<CampaignCharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notMember, setNotMember] = useState(false)

  // Clear all campaign state and redirect when user signs out
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setCampaign(null)
      setCampaignCharacters([])
      setError(null)
      setNotMember(false)
      setLoading(false)
      navigate('/campaigns', { replace: true })
    }
  }, [user, authLoading, navigate])

  const [removeMemberOpen, setRemoveMemberOpen] = useState<string | null>(null)
  const [removeMemberSubmitting, setRemoveMemberSubmitting] = useState(false)
  const [deleteCampaignOpen, setDeleteCampaignOpen] = useState(false)
  const [deleteCampaignSubmitting, setDeleteCampaignSubmitting] = useState(false)
  const [leaveCampaignOpen, setLeaveCampaignOpen] = useState(false)
  const [leaveCampaignSubmitting, setLeaveCampaignSubmitting] = useState(false)

  const [syncCharacterOpen, setSyncCharacterOpen] = useState(false)
  const [syncCharacterId, setSyncCharacterId] = useState('')
  const [syncCharacterSubmitting, setSyncCharacterSubmitting] = useState(false)
  const [syncCharacterError, setSyncCharacterError] = useState<string | null>(null)

  const [removeOwnCharacterOpen, setRemoveOwnCharacterOpen] = useState(false)
  const [removeOwnCharacterSubmitting, setRemoveOwnCharacterSubmitting] = useState(false)

  const isDM = campaign?.dmUserId === user?.uid
  const myCampaignCharacter = campaignCharacters.find((c) => c.userId === user?.uid)

  // Load campaign and characters
  useEffect(() => {
    if (authLoading || !user || !campaignId) {
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      setNotMember(false)

      const campaignResult = await getCampaign(user.uid, campaignId)
      if (!campaignResult.ok) {
        setError(campaignResult.error ?? 'Could not load campaign')
        setLoading(false)
        return
      }
      if (!campaignResult.value) {
        setError('Campaign not found')
        setLoading(false)
        return
      }

      const loadedCampaign = campaignResult.value
      setCampaign(loadedCampaign)

      // Check membership
      if (!loadedCampaign.members[user.uid]) {
        setNotMember(true)
        setLoading(false)
        return
      }

      // Load characters
      const charsResult = await getCampaignCharacters(loadedCampaign.id, user.uid)
      if (charsResult.ok) {
        setCampaignCharacters(charsResult.value)
      } else {
        setError(charsResult.error ?? 'Could not load campaign characters')
      }

      setLoading(false)
    }

    load()
  }, [user, authLoading, campaignId])

  // Handle remove member (DM only)
  const handleRemoveMember = async (memberUid: string) => {
    if (!campaign || !user || removeMemberSubmitting) return
    setRemoveMemberSubmitting(true)

    const result = await removeCampaignMember(user.uid, campaign.id, memberUid)
    if (result.ok) {
      // Refresh characters
      const charsResult = await getCampaignCharacters(campaign.id, user.uid)
      if (charsResult.ok) {
        setCampaignCharacters(charsResult.value)
      }
      // Show warning if character copy delete was denied
      if (result.value === true) {
        // Check if the character copy still exists
        const stillExists = charsResult.value.some((c) => c.userId === memberUid)
        if (stillExists) {
          // Could show a toast here, but spec says non-blocking confirm with copy text
          // We'll just log for now as the spec mentions showing copy text
          console.warn('Member removed, but their synced character copy could not be deleted')
        }
      }
    } else {
      setError(result.error ?? 'Could not remove member')
    }
    setRemoveMemberSubmitting(false)
    setRemoveMemberOpen(null)
  }

  // Handle delete campaign (DM only)
  const handleDeleteCampaign = async () => {
    if (!campaign || !user || deleteCampaignSubmitting) return
    setDeleteCampaignSubmitting(true)

    const result = await deleteCampaign(user.uid, campaign.id)
    if (result.ok) {
      navigate('/campaigns')
    } else {
      setError(result.error ?? 'Could not delete campaign')
    }
    setDeleteCampaignSubmitting(false)
    setDeleteCampaignOpen(false)
  }

  // Handle sync character
  const handleSyncCharacter = async () => {
    if (!campaign || !user || syncCharacterSubmitting || !syncCharacterId) return
    setSyncCharacterSubmitting(true)
    setSyncCharacterError(null)

    const character = myCharacters.find((c) => c.id === syncCharacterId)
    if (!character) {
      setSyncCharacterError('Character not found')
      setSyncCharacterSubmitting(false)
      return
    }

    const result = await syncCharacterToCampaign(user.uid, campaign.id, character.id, character)
    if (result.ok) {
      // Refresh characters
      const charsResult = await getCampaignCharacters(campaign.id, user.uid)
      if (charsResult.ok) {
        setCampaignCharacters(charsResult.value)
      }
      setSyncCharacterOpen(false)
      setSyncCharacterId('')
    } else {
      setSyncCharacterError(result.error ?? 'Could not sync character')
    }
    setSyncCharacterSubmitting(false)
  }

  // Handle remove own character
  const handleRemoveOwnCharacter = async () => {
    if (!campaign || !user || removeOwnCharacterSubmitting) return
    setRemoveOwnCharacterSubmitting(true)

    const result = await removeCharacterFromCampaign(user.uid, campaign.id)
    if (result.ok) {
      // Refresh characters
      const charsResult = await getCampaignCharacters(campaign.id, user.uid)
      if (charsResult.ok) {
        setCampaignCharacters(charsResult.value)
      }
    } else {
      setError(result.error ?? 'Could not remove character')
    }
    setRemoveOwnCharacterSubmitting(false)
    setRemoveOwnCharacterOpen(false)
  }

  // Handle leave campaign (non-DM members only)
  const handleLeaveCampaign = async () => {
    if (!campaign || !user || leaveCampaignSubmitting) return
    setLeaveCampaignSubmitting(true)

    const result = await leaveCampaign(user.uid, campaign.id)
    if (result.ok) {
      navigate('/campaigns')
    } else {
      setError(result.error ?? 'Could not leave campaign')
    }
    setLeaveCampaignSubmitting(false)
    setLeaveCampaignOpen(false)
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <section className="page campaigns-detail-page">
        <div className="campaigns-detail-loading">
          <p className="campaigns-loading-text">Loading campaign…</p>
          <div className="campaigns-skeleton" />
          <div className="campaigns-skeleton" />
        </div>
      </section>
    )
  }

  // Not found or not member
  if (error || notMember || !campaign) {
    return (
      <section className="page campaigns-detail-page">
        <header className="page-head">
          <h1 className="page-title">Campaign</h1>
          <div className="page-actions">
            <Link to="/campaigns" className="link">
              Back to campaigns
            </Link>
          </div>
        </header>
        <Card className="campaigns-error">
          <Icon name="alert" size={24} className="campaigns-error-icon" />
          <p className="campaigns-error-text">
            {error ?? (notMember ? 'You are not a member of this campaign.' : 'Campaign not found.')}
          </p>
          <Link to="/campaigns">
            <Button variant="secondary">Back to campaigns</Button>
          </Link>
        </Card>
      </section>
    )
  }

  const memberCount = Object.keys(campaign.members).length

  return (
    <section className="page campaigns-detail-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">{campaign.name}</h1>
          <p className="page-subtitle">
            {isDM ? 'You are the DM' : 'Member'} • {memberCount} member{memberCount !== 1 ? 's' : ''} • Code:{' '}
            <code className="campaigns-join-code-display">{campaign.joinCode}</code>
          </p>
        </div>
        <div className="page-actions">
          {isDM && (
            <Tooltip text="Delete campaign" side="top">
              <Button
                variant="danger"
                icon="trash"
                onClick={() => setDeleteCampaignOpen(true)}
                disabled={deleteCampaignSubmitting}
              >
                Delete
              </Button>
            </Tooltip>
          )}
          <Tooltip text="Copy join code" side="top">
            <button
              type="button"
              className="campaigns-copy-btn campaigns-copy-btn--header"
              onClick={() => navigator.clipboard.writeText(campaign.joinCode)}
              aria-label={`Copy join code ${campaign.joinCode}`}
            >
              <Icon name="download" size={14} />
              <span className="campaigns-code">{campaign.joinCode}</span>
            </button>
          </Tooltip>
          {!isDM && (
            <Tooltip text="Leave campaign" side="top">
              <Button
                variant="ghost"
                icon="arrow-right"
                onClick={() => setLeaveCampaignOpen(true)}
                disabled={leaveCampaignSubmitting}
              >
                Leave
              </Button>
            </Tooltip>
          )}
          <Link to="/campaigns">
            <Button variant="ghost" icon="chevron-up">
              Back
            </Button>
          </Link>
        </div>
      </header>

      {error && (
        <div className="campaigns-banner campaigns-banner--error" role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
          <button type="button" className="campaigns-banner-dismiss" onClick={() => setError(null)} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {/* Party Info */}
      <Card className="campaigns-party-card">
        <header className="card-head">
          <h2 className="card-title">Party</h2>
        </header>
        <div className="card-body">
          {isDM ? (
            <>
              <div className="campaigns-member-count">
                <strong>{memberCount}</strong> member{memberCount !== 1 ? 's' : ''} in this campaign
              </div>
              {campaignCharacters.length > 0 ? (
                <ul className="campaigns-member-list">
                  {campaignCharacters.map((char) => (
                    <li key={char.userId} className="campaigns-member-item">
                      <div className="campaigns-member-info">
                        <div className="campaigns-member-avatar" style={{ backgroundColor: char.meta.avatarColor }}>
                          {char.meta.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="campaigns-member-details">
                          <span className="campaigns-member-name">{char.meta.name}</span>
                          <span className="campaigns-member-meta">
                            Level {char.level} • {char.classes[0]?.classId ?? 'No class'}
                          </span>
                        </div>
                      </div>
                      {char.userId !== user?.uid && (
                        <Tooltip text="Remove member" side="top">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="minus"
                            onClick={() => setRemoveMemberOpen(char.userId)}
                            disabled={removeMemberSubmitting}
                            aria-label={`Remove ${char.meta.name} from campaign`}
                          />
                        </Tooltip>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="campaigns-empty-party">No characters synced yet.</p>
              )}
            </>
          ) : (
            <>
              <p className="campaigns-member-count">
                This campaign has <strong>{memberCount}</strong> member{memberCount !== 1 ? 's' : ''}.
              </p>
              {campaignCharacters.length > 0 ? (
                <ul className="campaigns-member-list campaigns-member-list--readonly">
                  {campaignCharacters.map((char) => (
                    <li key={char.userId} className="campaigns-member-item">
                      <div className="campaigns-member-info">
                        <div className="campaigns-member-avatar" style={{ backgroundColor: char.meta.avatarColor }}>
                          {char.meta.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="campaigns-member-details">
                          <span className="campaigns-member-name">{char.meta.name}</span>
                          <span className="campaigns-member-meta">
                            Level {char.level} • {char.classes[0]?.classId ?? 'No class'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="campaigns-empty-party">No characters synced yet.</p>
              )}
            </>
          )}
        </div>
      </Card>

      {/* My Character / Sync Section */}
      <Card className="campaigns-my-character-card">
        <header className="card-head">
          <h2 className="card-title">Your character</h2>
        </header>
        <div className="card-body">
          {myCampaignCharacter ? (
            <div className="campaigns-synced-character">
              <div className="campaigns-synced-character-header">
                <div className="campaigns-synced-character-avatar" style={{ backgroundColor: myCampaignCharacter.meta.avatarColor }}>
                  {myCampaignCharacter.meta.name.charAt(0).toUpperCase()}
                </div>
                <div className="campaigns-synced-character-info">
                  <h3 className="campaigns-synced-character-name">{myCampaignCharacter.meta.name}</h3>
                  <div className="campaigns-synced-character-meta">
                    <span>Level {myCampaignCharacter.level}</span>
                    <Tag tone="neutral">{myCampaignCharacter.species.speciesId}</Tag>
                    {myCampaignCharacter.classes[0] && (
                      <Tag tone="accent">{myCampaignCharacter.classes[0].classId}</Tag>
                    )}
                  </div>
                </div>
              </div>
              <div className="campaigns-synced-character-stats">
                {ABILITY_KEYS.map((ability) => (
                  <div key={ability} className="campaigns-stat">
                    <span className="campaigns-stat-label">{ABILITY_ABBREV[ability]}</span>
                    <span className="campaigns-stat-value">
                      {myCampaignCharacter.combat[ability as keyof typeof myCampaignCharacter.combat] ?? 10}
                    </span>
                  </div>
                ))}
              </div>
              <div className="campaigns-synced-character-actions">
                <Tooltip text="Remove your character from this campaign" side="top">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="minus"
                    onClick={() => setRemoveOwnCharacterOpen(true)}
                    disabled={removeOwnCharacterSubmitting}
                  >
                    Remove
                  </Button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <>
              <EmptyState
                title="No character synced"
                description="Choose one of your characters to bring into this campaign. The DM and other members will see a read-only copy."
                icon="user"
                action={
                  <Button variant="primary" onClick={() => setSyncCharacterOpen(true)}>
                    <Icon name="plus" size={14} />
                    <span>Sync a character</span>
                  </Button>
                }
              />
            </>
          )}
        </div>
      </Card>

      {/* Remove Member Modal */}
      <Modal
        open={!!removeMemberOpen}
        onClose={() => setRemoveMemberOpen(null)}
        title="Remove member"
        size="sm"
      >
        <div className="campaigns-confirm-modal">
          <p className="campaigns-confirm-text">
            Remove this member from the campaign? They will lose access to the party, and their
            synced character copy will be removed.
          </p>
          <div className="campaigns-confirm-actions">
            <Button variant="secondary" onClick={() => setRemoveMemberOpen(null)} disabled={removeMemberSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => removeMemberOpen && handleRemoveMember(removeMemberOpen)} disabled={removeMemberSubmitting}>
              {removeMemberSubmitting ? 'Removing…' : 'Remove member'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Campaign Modal */}
      <Modal
        open={deleteCampaignOpen}
        onClose={() => setDeleteCampaignOpen(false)}
        title="Delete campaign"
        size="sm"
      >
        <div className="campaigns-confirm-modal">
          <p className="campaigns-confirm-text campaigns-confirm-text--danger">
            Delete this campaign? This cannot be undone. All member access and synced character
            copies will be removed.
          </p>
          <div className="campaigns-confirm-actions">
            <Button variant="secondary" onClick={() => setDeleteCampaignOpen(false)} disabled={deleteCampaignSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteCampaign} disabled={deleteCampaignSubmitting}>
              {deleteCampaignSubmitting ? 'Deleting…' : 'Delete campaign'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sync Character Modal */}
      <Modal
        open={syncCharacterOpen}
        onClose={() => {
          setSyncCharacterOpen(false)
          setSyncCharacterError(null)
          setSyncCharacterId('')
        }}
        title="Sync a character"
        size="md"
      >
        <form className="campaigns-modal-form" onSubmit={(e) => { e.preventDefault(); handleSyncCharacter(); }}>
          {myCharacters.length === 0 ? (
            <div className="campaigns-no-characters">
              <Icon name="user" size={24} className="campaigns-no-characters-icon" />
              <p>You don't have any characters yet.</p>
              <Link to="/create">
                <Button variant="primary" size="sm">Create a character</Button>
              </Link>
            </div>
          ) : (
            <>
              <Field label="Character" required error={syncCharacterError || undefined}>
                <Select
                  placeholder="Choose a character"
                  value={syncCharacterId}
                  onValueChange={setSyncCharacterId}
                  options={myCharacters.map((c) => ({
                    value: c.id,
                    label: `${c.meta.name} (Level ${c.level} ${c.classes[0]?.classId ?? 'No class'})`,
                  }))}
                  disabled={syncCharacterSubmitting}
                />
              </Field>

              <Divider label="or" />

              <div className="campaigns-modal-footer">
                <Button type="button" variant="secondary" onClick={() => setSyncCharacterOpen(false)} disabled={syncCharacterSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={syncCharacterSubmitting || !syncCharacterId}>
                  {syncCharacterSubmitting ? 'Syncing…' : 'Sync character'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Remove Own Character Modal */}
      <Modal
        open={removeOwnCharacterOpen}
        onClose={() => setRemoveOwnCharacterOpen(false)}
        title="Remove character"
        size="sm"
      >
        <div className="campaigns-confirm-modal">
          <p className="campaigns-confirm-text">
            Remove your character from this campaign? The DM and other members will no longer see
            your sheet. You can sync it again later.
          </p>
          <div className="campaigns-confirm-actions">
            <Button variant="secondary" onClick={() => setRemoveOwnCharacterOpen(false)} disabled={removeOwnCharacterSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveOwnCharacter} disabled={removeOwnCharacterSubmitting}>
              {removeOwnCharacterSubmitting ? 'Removing…' : 'Remove character'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Campaign Modal */}
      <Modal
        open={leaveCampaignOpen}
        onClose={() => setLeaveCampaignOpen(false)}
        title="Leave campaign"
        size="sm"
      >
        <div className="campaigns-confirm-modal">
          <p className="campaigns-confirm-text">
            Leave this campaign? You'll need the join code to rejoin.
          </p>
          <div className="campaigns-confirm-actions">
            <Button variant="secondary" onClick={() => setLeaveCampaignOpen(false)} disabled={leaveCampaignSubmitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLeaveCampaign} disabled={leaveCampaignSubmitting}>
              {leaveCampaignSubmitting ? 'Leaving…' : 'Leave campaign'}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}