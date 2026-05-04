export function audioManifestKey(arabic: string): string {
  return arabic.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").trim();
}
