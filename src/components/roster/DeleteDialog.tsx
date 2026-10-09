import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import type { Character } from '../../types/character'

export interface DeleteDialogProps {
  /** Character awaiting confirmation, or `null` when the dialog is closed. */
  character: Character | null
  onCancel: () => void
  onConfirm: (character: Character) => void
}

/**
 * Delete is irreversible and the storage layer has no undo, so confirmation is
 * explicit: the character is named, the consequence is stated in plain words,
 * and the safe action takes initial focus. The consequence names where the
 * roster actually lives — the account when signed in, this browser otherwise.
 */
export function DeleteDialog({ character, onCancel, onConfirm }: DeleteDialogProps) {
  const { user } = useAuth()
  const name = character?.meta.name.trim() || 'Unnamed character'
  const where = user ? 'your account' : 'this browser'

  return (
    <Modal
      open={character !== null}
      onClose={onCancel}
      title={`Delete ${name}?`}
      description={`This removes the character from ${where} for good. The delete is irrecoverable — export a copy first if you want to keep it.`}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} data-autofocus>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (character) onConfirm(character)
            }}
          >
            Delete permanently
          </Button>
        </>
      }
    >
      <p className="delete-detail">
        <span className="delete-detail-name">{name}</span> will disappear from your roster.
      </p>
    </Modal>
  )
}
