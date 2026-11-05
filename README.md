# Shubham 98

Windows 98 themed personal portfolio: real window management, responsive down to phones.

```sh
npm install
npm run dev    # local dev
npm run build  # outputs to build/
npm test       # window manager checks
```

All visitor-facing copy lives in `src/content.js`.

## Floppy, the AI assistant

Needs `ANTHROPIC_API_KEY` set in Netlify's environment variables. Spending is capped in code: 5 requests a minute per IP, 20 a day per IP, and 200 a day in total (`src/assistant.js`). Without it, Floppy still shows updates and says the AI is offline. Use `npx netlify-cli dev` to run the chat locally, because `npm run dev` doesn't serve functions.

To post an update, add an entry to `src/updates.json` and push to `master`. Floppy pops it up once for each visitor and can answer questions about it:

```json
{
  "id": "unique-id",
  "date": "2026-11-05",
  "source": "LinkedIn",
  "title": "Short headline",
  "text": "A sentence or two.",
  "url": "https://www.linkedin.com/posts/..."
}
```
 Deep links work: `/#projects`, `/#about`, `/#contact`.
