# Wedding Invitation — React (Vite)

This is a small single-page React app (Vite) that shows a groom image and a form for guests to enter their name/relation. After submit, the app replaces the image with a groom video and uses the browser's built-in TTS (Hindi) to speak a personalized invitation.

## Features
- Static groom photo (public/groom.png)
- Form: guest name, relation, older checkbox
- On submit: replaces image with groom video (public/groom_base.mp4) and uses `speechSynthesis` to speak a Hindi invitation
- Pre-Congratulate section: record video+audio messages from guest (saved locally in browser; can download)

## How to run

1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173).

## Replace assets
- Replace `public/groom.png` with your groom portrait (recommended 800x800).
- Optionally, add `public/groom_base.mp4` — a short base video of the groom (the app will play this and the browser TTS will read the personalized message).

## Notes
- The voice uses the browser `speechSynthesis` API with `hi-IN` locale. Sound may be blocked until a user interaction occurs (the form submit counts).
- This project is fully client-side and free — no external paid APIs are used.
