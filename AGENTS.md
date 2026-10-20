<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Level 2 vocabulary-bank coverage

Whenever adding or changing Level 2 content, treat vocabulary-bank coverage as a required acceptance criterion. Every standalone Arabic word or verb form must flow through `getLevelTwoVocabularyEntries()` in `src/lib/vocabulary-bank.ts` and be searchable by Arabic, transliteration, and English. Existing Level 2 collections are already derived there, so do not duplicate their entries manually; when introducing a new Level 2 collection or data source, connect it to that function. Update `tests/lib/vocabulary-bank.test.ts` to cover the new source and run the Level 2 content validator plus the affected vocabulary tests before considering the work complete.
