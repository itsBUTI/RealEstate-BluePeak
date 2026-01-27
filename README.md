# BluePeak Realty (React + Vite)

Premium real estate demo website built with React, Vite, and Tailwind.

Run locally:
	npm install
	npm run dev

Email (EmailJS):
	- Copy .env.example to .env.local
	- Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
	- Restart the dev server after changing env vars
	- Do NOT use/store any EmailJS private key in this app
	- If sending fails locally, add your current origin to EmailJS Allowed Origins (e.g. http://localhost:5173 or http://localhost:5174)

Build and preview:
	npm run build
	npm run preview

Deploy:
	Standard Vite SPA output in dist.
	Configure your host to rewrite all routes to /index.html for client-side routing.

Demo content:

	src/data/properties.js
	src/data/agents.js

Assets:
	public/properties
	public/avatars
