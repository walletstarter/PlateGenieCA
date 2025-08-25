// Minimal fuzzy blocklist: leet normalization + edit distance <= 1
const leetMap: Record<string,string> = { "0":"O","1":"I","3":"E","4":"A","5":"S","7":"T" };

export function normalizeLeet(s: string): string {
  return s.toUpperCase().replace(/[013457]/g, c => leetMap[c] ?? c);
}

export function editDistanceLe1(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (la > lb) i++;
    else if (la < lb) j++;
    else { i++; j++; }
  }
  return true; // allow tail diff as one edit
}

export function isBannedCandidate(plate: string, bannedList: string[]): boolean {
  const p = normalizeLeet(plate);
  return bannedList.some(b => {
    const bn = normalizeLeet(b);
    return p.includes(bn) || editDistanceLe1(p, bn);
  });
}
