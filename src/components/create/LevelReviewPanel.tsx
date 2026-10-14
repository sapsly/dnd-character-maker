import type { Character } from '../../types/character'
import {
  buildClassFeaturesByLevel,
  buildLevelUpChoiceReview,
} from '../../lib/rules/levelReview'
import type {
  ClassFeaturesByLevel,
  ChoiceReviewGroup,
  ChoiceReviewRow,
  LevelFeatureRow,
} from '../../lib/rules/levelReview'
import { Card } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { EmptyState } from '../ui/EmptyState'
import { ExpandableText } from '../ui/ExpandableText'
import { Tag } from '../ui/Tag'

/**
 * Read-only panels for the character editor's Review step.
 *
 * (A) Class features by level — what each class has granted so far.
 * (B) Review past level-up choices — choices already made in past level-ups.
 *
 * Purely presentational: every value comes from the helpers in
 * `lib/rules/levelReview`, and nothing here writes to the character. Rows reuse
 * the character sheet's `.sheet-feature` markup so the editor and the sheet
 * describe features the same way.
 */
function FeatureRow({ row }: { row: LevelFeatureRow }) {
  return (
    <li className="sheet-feature">
      <span className="sheet-feature-level">L{row.level}</span>
      <div>
        <p className="sheet-feature-name">
          {row.name}
          {row.source === 'subclass' ? (
            <Tag tone="muted" className="create-source-tag">
              Subclass
            </Tag>
          ) : null}
        </p>
        {row.description ? (
          <ExpandableText className="sheet-feature-desc" lines={4}>
            {row.description}
          </ExpandableText>
        ) : null}
      </div>
    </li>
  )
}

function ChoiceRow({ row }: { row: ChoiceReviewRow }) {
  return (
    <li>
      <span className="create-choice-name">{row.label}</span>
      {row.detail ? (
        <ExpandableText className="create-list-body" lines={4}>
          {row.detail}
        </ExpandableText>
      ) : null}
    </li>
  )
}

function ClassFeaturesSection({ groups }: { groups: ClassFeaturesByLevel[] }) {
  return (
    <Card title="Class features by level" className="create-card">
      <p className="create-note">
        Read-only. The features each class has granted, up to your current level in it.
      </p>
      {groups.length === 0 ? (
        <EmptyState
          title="No class features yet"
          description="This character has no class levels recorded."
        />
      ) : (
        groups.map((group, index) => (
          <div key={group.classEntryId}>
            {index > 0 ? <Divider /> : null}
            <h3 className="create-list-title">
              {group.className} — level {group.classLevel}
            </h3>
            {group.rows.length === 0 ? (
              <p className="create-note">No features recorded for this class.</p>
            ) : (
              <ul className="sheet-features">
                {group.rows.map((row, rowIndex) => (
                  <FeatureRow key={`${row.level}-${row.name}-${rowIndex}`} row={row} />
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </Card>
  )
}

function ChoiceReviewSection({ groups }: { groups: ChoiceReviewGroup[] }) {
  return (
    <Card title="Review past level-up choices" className="create-card">
      <p className="create-note">
        Read-only. The choices already made during level-ups.
      </p>
      {groups.length === 0 ? (
        <EmptyState
          title="No level-up choices yet"
          description="Choices made when levelling up will be listed here."
        />
      ) : (
        groups.map((group, index) => (
          <div key={group.key}>
            {index > 0 ? <Divider /> : null}
            <h3 className="create-list-title">{group.heading}</h3>
            <ul className="create-gaps">
              {group.rows.map((row, rowIndex) => (
                <ChoiceRow key={`${row.label}-${rowIndex}`} row={row} />
              ))}
            </ul>
          </div>
        ))
      )}
    </Card>
  )
}

export default function LevelReviewPanel({ character }: { character: Character }) {
  const classGroups = buildClassFeaturesByLevel(character)
  const choiceGroups = buildLevelUpChoiceReview(character)

  return (
    <>
      <ClassFeaturesSection groups={classGroups} />
      <ChoiceReviewSection groups={choiceGroups} />
    </>
  )
}
