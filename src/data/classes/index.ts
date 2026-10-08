import type { ClassDef } from '../../types/character';

import { barbarian } from './barbarian';
import { bard } from './bard';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { monk } from './monk';
import { paladin } from './paladin';
import { ranger } from './ranger';
import { rogue } from './rogue';
import { sorcerer } from './sorcerer';
import { warlock } from './warlock';
import { wizard } from './wizard';
import { artificer } from './artificer';

export { barbarian, bard, cleric, druid, fighter, monk, paladin, ranger, rogue, sorcerer, warlock, wizard, artificer };

/** All 13 classes, ordered for display. */
export const CLASSES: ClassDef[] = [
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
  artificer,
];

const BY_ID: Record<string, ClassDef> = Object.fromEntries(CLASSES.map((c) => [c.id, c]));

export function getClass(id: string): ClassDef | null {
  return BY_ID[id] ?? null;
}