import Dexie from 'dexie'

const db = new Dexie('CampgroundTycoon')

db.version(1).stores({
  saves: '++id, name, savedAt',
})

export async function saveGame(state, name = 'autosave') {
  const existing = await db.saves.where('name').equals(name).first()
  if (existing) {
    await db.saves.update(existing.id, { state, savedAt: new Date() })
  } else {
    await db.saves.add({ name, state, savedAt: new Date() })
  }
}

export async function loadGame(name = 'autosave') {
  const save = await db.saves.where('name').equals(name).first()
  return save?.state ?? null
}

export async function listSaves() {
  const saves = await db.saves.toArray()
  return saves.map((s) => ({ name: s.name, savedAt: s.savedAt }))
}

export async function deleteSave(name) {
  await db.saves.where('name').equals(name).delete()
}

export async function clearSave() {
  await db.saves.clear()
}
