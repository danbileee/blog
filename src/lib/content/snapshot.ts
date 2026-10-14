import fs from 'fs';
import path from 'path';
import { loadRecords, sourceInventory } from './github';
import { ContentRecord, Snapshot } from './types';

declare const LOCAL_DEVELOPMENT_PHASE: boolean;
// Defined by Next's server webpack compilation from its actual phase, never env/query flags.
export function isLocalDevelopment() {
  return typeof LOCAL_DEVELOPMENT_PHASE !== 'undefined' && LOCAL_DEVELOPMENT_PHASE;
}
export function readSnapshot(): Snapshot {
  const root = path.join(process.cwd(), '.cache/i18n');
  const ready = fs.readFileSync(path.join(root, 'ready'), 'utf8');
  const snapshot: Snapshot = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
  if (
    snapshot.version !== 1 ||
    snapshot.ref !== ready ||
    [...snapshot.posts, ...snapshot.careers].some((record) => record.original.meta.devOnly)
  )
    throw new Error('Invalid published snapshot');
  return snapshot;
}
let draftPromise: Promise<ContentRecord[]> | undefined;
export async function localDraftPosts(snapshot: Snapshot): Promise<ContentRecord[]> {
  if (!isLocalDevelopment()) return [];
  if (!draftPromise)
    draftPromise = sourceInventory(undefined, snapshot.ref)
      .then(({ ref, files }) => loadRecords(ref, files, undefined, true))
      .then((records) => records.filter((record) => record.kind === 'posts'));
  return draftPromise;
}
