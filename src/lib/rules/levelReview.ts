import type { Character } from '../../types/character';
import { getClass } from '../../data/classes';
import { FEATS } from '../../data/feats';
import { getSpell } from '../../data/spells';
import { skillName } from '../rules/skillList';
import { ABILITY_ABBREV } from '../../types/character';

export interface LevelFeatureRow {
  level: number;
  name: string;
  description: string;
  source: 'class' | 'subclass';
}

export interface ClassFeaturesByLevel {
  classEntryId: string;
  className: string;
  classLevel: number;
  rows: LevelFeatureRow[];
}

export interface ChoiceReviewRow {
  label: string;
  detail?: string;
}

export interface ChoiceReviewGroup {
  key: string;
  heading: string;
  rows: ChoiceReviewRow[];
}

/**
 * Builds class features by level for all class entries in the character.
 * Preserves the order of class entries as they appear in character.classes.
 */
export function buildClassFeaturesByLevel(character: Character): ClassFeaturesByLevel[] {
  const result: ClassFeaturesByLevel[] = [];

  for (const entry of character.classes) {
    const classDef = getClass(entry.classId);
    if (!classDef) {
      // Skip gracefully if ClassDef can't be resolved
      continue;
    }

    const rows: LevelFeatureRow[] = [];

    // Collect class features from levels 1..entry.level
    for (let lvl = 1; lvl <= entry.level; lvl++) {
      const features = classDef.featuresByLevel[lvl] ?? [];
      for (const feature of features) {
        rows.push({
          level: lvl,
          name: feature.name,
          description: feature.description,
          source: 'class',
        });
      }
    }

    // Collect subclass features if subclassId is set
    if (entry.subclassId) {
      const subclassDef = classDef.subclasses.find((s) => s.id === entry.subclassId);
      if (subclassDef) {
        for (const feature of subclassDef.features) {
          if (feature.level <= entry.level) {
            rows.push({
              level: feature.level,
              name: feature.name,
              description: feature.description,
              source: 'subclass',
            });
          }
        }
      }
    }

    // Sort by level ascending (stable - class rows precede subclass rows within a level)
    rows.sort((a, b) => a.level - b.level);

    result.push({
      classEntryId: entry.id,
      className: classDef.name,
      classLevel: entry.level,
      rows,
    });
  }

  return result;
}

/**
 * Builds level-up choice review groups for display in the character editor.
 * Only includes groups that have at least one row.
 */
export function buildLevelUpChoiceReview(character: Character): ChoiceReviewGroup[] {
  const groups: ChoiceReviewGroup[] = [];

  // Helper to create a group only if it has rows
  const maybePushGroup = (group: ChoiceReviewGroup) => {
    if (group.rows.length > 0) {
      groups.push(group);
    }
  };

  // 1. Subclass
  const subclassRows: ChoiceReviewRow[] = [];
  for (const entry of character.classes) {
    if (entry.subclassId) {
      const classDef = getClass(entry.classId);
      if (classDef) {
        const subclassDef = classDef.subclasses.find((s) => s.id === entry.subclassId);
        if (subclassDef) {
          subclassRows.push({ label: subclassDef.name });
        }
      }
    }
  }
  maybePushGroup({ key: 'subclass', heading: 'Subclass', rows: subclassRows });

  // 2. Ability score improvements & feats
  const asiFeatRows: ChoiceReviewRow[] = [];
  for (const choice of character.choices) {
    if (choice.kind === 'featOrAsi' || choice.kind === 'asiAbilityIncrease') {
      const parts: string[] = [];
      parts.push(`Level ${choice.grantedAtLevel}`);

      for (const pick of choice.picks) {
        if (pick.optionId) {
          const feat = FEATS.find((f) => f.id === pick.optionId);
          if (feat) {
            parts.push(feat.name);
          } else {
            parts.push(pick.optionId);
          }
        }
        if (pick.abilityIncreases) {
          const incParts: string[] = [];
          for (const [abilityKey, value] of Object.entries(pick.abilityIncreases)) {
            if (value !== 0) {
              const abbrev = ABILITY_ABBREV[abilityKey as keyof typeof ABILITY_ABBREV] ?? abilityKey.toUpperCase();
              incParts.push(`${value > 0 ? '+' : ''}${value} ${abbrev}`);
            }
          }
          if (incParts.length > 0) {
            parts.push(incParts.join(', '));
          }
        }
      }

      const detail = parts.length > 1 ? parts.slice(1).join(' · ') : undefined;
      asiFeatRows.push({ label: choice.label, detail });
    }
  }
  maybePushGroup({ key: 'asiFeats', heading: 'Ability score improvements & feats', rows: asiFeatRows });

  // 3. Weapon mastery
  for (const entry of character.classes) {
    if (entry.weaponMasteries.length > 0) {
      const classDef = getClass(entry.classId);
      const className = classDef?.name ?? entry.classId;
      maybePushGroup({
        key: `weaponMastery-${entry.id}`,
        heading: `${className} weapon mastery`,
        rows: entry.weaponMasteries.map((wm) => ({ label: wm })),
      });
    }
  }

  // 4. Skills
  for (const entry of character.classes) {
    if (entry.skillPicks.length > 0) {
      const classDef = getClass(entry.classId);
      const className = classDef?.name ?? entry.classId;
      maybePushGroup({
        key: `skills-${entry.id}`,
        heading: `${className} skills`,
        rows: entry.skillPicks.map((sk) => ({ label: skillName(sk) })),
      });
    }
  }

  // 5. Feature choices
  for (const entry of character.classes) {
    const featurePickKeys = Object.keys(entry.featurePicks);
    if (featurePickKeys.length === 0) continue;

    const classDef = getClass(entry.classId);
    const className = classDef?.name ?? entry.classId;
    const subclassDef = entry.subclassId && classDef
      ? classDef.subclasses.find((s) => s.id === entry.subclassId)
      : null;

    // Build a lookup of all features (class + subclass) for this entry up to its level
    const featureMap = new Map<string, { feature: { name: string; options?: Array<{ id: string; name: string }> }; source: 'class' | 'subclass' }>();

    // Class features
    if (classDef) {
      for (let lvl = 1; lvl <= entry.level; lvl++) {
        const features = classDef.featuresByLevel[lvl] ?? [];
        for (const feature of features) {
          featureMap.set(feature.id, { feature, source: 'class' });
        }
      }
    }

    // Subclass features
    if (subclassDef) {
      for (const feature of subclassDef.features) {
        if (feature.level <= entry.level) {
          const key = feature.id ?? `${subclassDef.id}::${feature.name}`;
          featureMap.set(key, { feature, source: 'subclass' });
        }
      }
    }

    const featureRows: ChoiceReviewRow[] = [];

    for (const key of featurePickKeys) {
      const ids = entry.featurePicks[key] ?? [];
      if (ids.length === 0) continue;

      // The key may be featureId or featureId::optionId
      const baseFeatureId = key.split('::')[0];
      const featureInfo = featureMap.get(baseFeatureId);

      const selectedOptionNames = ids.map((id) => {
        if (featureInfo?.feature.options) {
          const option = featureInfo.feature.options.find((o) => o.id === id);
          return option?.name ?? id;
        }
        return id;
      });

      const label = featureInfo?.feature.name ?? key;
      const detail = selectedOptionNames.length > 0 ? selectedOptionNames.join(', ') : ids.join(', ');

      featureRows.push({ label, detail });
    }

    maybePushGroup({
      key: `featureChoices-${entry.id}`,
      heading: `${className} feature choices`,
      rows: featureRows,
    });
  }

  // 6. Spells per class entry
  for (const entry of character.classes) {
    const classDef = getClass(entry.classId);
    const className = classDef?.name ?? entry.classId;
    const spellRows: ChoiceReviewRow[] = [];

    // Cantrips
    if (entry.cantripIds.length > 0) {
      const names = entry.cantripIds.map((id) => getSpell(id)?.name ?? id).join(', ');
      spellRows.push({ label: 'Cantrips', detail: names });
    }

    // Spells known
    if (entry.spellIdsKnown.length > 0) {
      const names = entry.spellIdsKnown.map((id) => getSpell(id)?.name ?? id).join(', ');
      spellRows.push({ label: 'Spells known', detail: names });
    }

    // Spells prepared
    if (entry.spellIdsPrepared.length > 0) {
      const names = entry.spellIdsPrepared.map((id) => getSpell(id)?.name ?? id).join(', ');
      spellRows.push({ label: 'Spells prepared', detail: names });
    }

    maybePushGroup({
      key: `spells-${entry.id}`,
      heading: `${className} spells`,
      rows: spellRows,
    });
  }

  // 7. Lineage spells
  const lineageSpellIds = character.lineageSpellIds ?? {};
  const allLineageSpellIds = Object.values(lineageSpellIds).flat();
  if (allLineageSpellIds.length > 0) {
    const lineageRows: ChoiceReviewRow[] = [];

    // Group by level for display
    const sortedLevels = Object.keys(lineageSpellIds)
      .map((k) => Number(k))
      .sort((a, b) => a - b);

    for (const level of sortedLevels) {
      const ids = lineageSpellIds[level] ?? [];
      if (ids.length > 0) {
        const names = ids.map((id) => getSpell(id)?.name ?? id).join(', ');
        lineageRows.push({ label: `Level ${level}`, detail: names });
      }
    }

    maybePushGroup({
      key: 'lineageSpells',
      heading: 'Lineage spells',
      rows: lineageRows,
    });
  }

  return groups;
}