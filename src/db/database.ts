import Dexie, { type EntityTable } from 'dexie'
import type { GameState } from '../store/types'

interface SavedGame {
  id: number
  name: string
  state: GameState
  savedAt: Date
}

const db = new Dexie('CampgroundTycoon') as Dexie & {
  saves: EntityTable<SavedGame, 'id'>
}

db.version(1).stores({
  saves: '++id, name, savedAt',
})

export async function saveGame(
  state: GameState,
  name = 'autosave'
): Promise<void> {
  const existing = await db.saves.where('name').equals(name).first()
  if (existing) {
    await db.saves.update(existing.id, { state, savedAt: new Date() })
  } else {
    await db.saves.add({ name, state, savedAt: new Date() } as SavedGame)
  }
}

export async function loadGame(name = 'autosave'): Promise<GameState | null> {
  const save = await db.saves.where('name').equals(name).first()
  return save?.state ?? null
}

export async function listSaves(): Promise<
  Array<{ name: string; savedAt: Date }>
> {
  const saves = await db.saves.toArray()
  return saves.map((s) => ({ name: s.name, savedAt: s.savedAt }))
}

export async function deleteSave(name: string): Promise<void> {
  await db.saves.where('name').equals(name).delete()
}

export async function clearSave(): Promise<void> {
  await db.saves.clear()
}
