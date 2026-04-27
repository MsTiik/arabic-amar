/**
 * Fetches the raw docx bytes from a publicly-shared Google Doc.
 *
 * Uses the public export endpoint (no API key, no service account). Works as long as the
 * doc is shared with "Anyone with the link". If we ever switch to a private doc, swap the
 * implementation here for a `googleapis` call — the rest of the parser stays identical.
 */

export const DEFAULT_DOC_ID = "1wqbU7rsLUm0wqCjQPS2PbtCTThZOxnE2CnClxa8DETc";

export function getDocId(): string {
  return process.env.GOOGLE_DOC_ID ?? DEFAULT_DOC_ID;
}

export function getDocUrl(docId: string = getDocId()): string {
  return `https://docs.google.com/document/d/${docId}/edit`;
}

export function getDocxExportUrl(docId: string = getDocId()): string {
  return `https://docs.google.com/document/d/${docId}/export?format=docx`;
}

export async function fetchDocxBytes(docId: string = getDocId()): Promise<ArrayBuffer> {
  const url = getDocxExportUrl(docId);
  const res = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    headers: {
      // Setting a real-looking UA avoids any heuristic gating Google might apply.
      "user-agent":
        "Mozilla/5.0 (compatible; ArabicAmar/1.0; +https://github.com/MsTiik/arabic-amar)",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Google Doc ${docId} as docx: ${res.status} ${res.statusText}`,
    );
  }
  return await res.arrayBuffer();
}
