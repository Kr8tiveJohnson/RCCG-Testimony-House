# PostgreSQL setup

PostgreSQL stores the website's content, media, livestream settings, and opt-in browser push notification subscriptions. Membership registrations remain in Google Sheets and continue using the Apps Script described in [the membership setup guide](./google-sheet-membership-setup.md).

## Local development

Install PostgreSQL 16 or later and create a database named `rccg_testimony_house` with a dedicated login role. Do not use the PostgreSQL superuser as the website's database account.

Set `DATABASE_URL` in the root `.env.local` file, using the connection details for that role:

```text
DATABASE_URL=postgresql://rccg_website_app:YOUR_PASSWORD@127.0.0.1:5432/rccg_testimony_house
```

Apply the website schema and start the app:

```powershell
npm run db:setup
npm run dev
```

The setup command creates the website content, media, livestream, and notification tables if they do not already exist. On first read, website content is initialized with the homepage, Sunday service schedule, and ministry descriptions. Sermons and events are managed as database records from `/admin` and start empty on a fresh database. When the livestream settings table is empty, the public livestream page keeps using the built-in default stream until an admin saves a new one.

The private `/admin` page edits the homepage, Sunday services, sermons, ministries, events, and livestream settings. Saving page content writes it to PostgreSQL and the public homepage, `/sermons`, `/ministries`, and `/events` pages read from that saved content.

## Installable app and push notifications

The public site includes an installable web app manifest and service worker. Visitors can choose **Install app** and separately opt in to browser notifications. Subscribers receive a notification when a new sermon is published and an event reminder at 9:00 AM Nigeria time on the day before the event. Notifications are browser/device specific; a visitor must opt in separately on each device.

For livestream notifications, open the Livestream section in Admin, update the public stream link, turn on **We are live now**, and save. Subscribers are notified when the stream is first marked live and whenever the link or platform is changed while it is marked live. Turn the control off when the broadcast ends; saving while offline does not send a notification. This manual live control works for both YouTube and Facebook.

Generate a VAPID key pair with `npx web-push generate-vapid-keys`, then configure these server environment variables in `.env.local` for development and in the production host for deployment:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<generated public key>
VAPID_PRIVATE_KEY=<generated private key>
VAPID_SUBJECT=mailto:rccglp103@gmail.com
CRON_SECRET=<long random secret>
```

Keep `VAPID_PRIVATE_KEY` and `CRON_SECRET` private. `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is intentionally public. Deployments on Vercel use the scheduled job in `vercel.json`; set `CRON_SECRET` in Vercel so its cron request is authorized. The schedule runs at 08:00 UTC (09:00 in Nigeria). Local development has no scheduler; the secured endpoint can be called manually with `Authorization: Bearer <CRON_SECRET>`.

## Deployment

A local PostgreSQL server is reachable only from this computer; a deployed site such as Vercel cannot connect to it. For production, provision a hosted PostgreSQL database, set its private connection string as the server-side `DATABASE_URL` environment variable in the deployment platform, and run `npm run db:setup` against that database before using the livestream admin controls. Never use a `NEXT_PUBLIC_` prefix for the connection string or commit it to source control.

The local database role and connection string are specific to this computer and should not be reused in production.
