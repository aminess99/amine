<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/11nPwu-na6fEQPGtE1_PaRMKnDbr8xIeT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render

This repo includes a `render.yaml` blueprint that deploys the app as a Render **Static Site**.

1. In Render, choose **New → Blueprint** and connect this GitHub repository.
2. When prompted, enter `GEMINI_API_KEY` (your Gemini API key). It is injected at build time.
3. Render runs `npm install && npm run build` and publishes `dist/`.
4. To use a custom domain: open the service → **Settings → Custom Domains**, add your domain,
   then update the DNS records at your domain registrar as Render instructs
   (remove the old Replit records). Render issues the SSL certificate automatically.
