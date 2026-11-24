# Melissa's senior landing pages: how they're published

The ten pages are live on **GitHub Pages** (free) at **https://melissakiehl.github.io/senior-pages/**.

```
melissa-landing-pages/                 <- repo melissakiehl/senior-pages, branch main (source)
  README.md, SETUP.md, CREDITS.md, credits/   <- notes
  deploy-pages.sh                      <- copies public/ to the gh-pages branch
  public/                              <- everything in here goes live (branch gh-pages = site root)
    index.html                         <- list of the ten pages
    404.html                           <- "page not found"
    .nojekyll                          <- tells GitHub Pages to serve files as-is
    <slug>/index.html, images/, fonts/ <- one folder per page
```

## 1. Publishing a change
1. Edit files under `public/` and commit on `main`.
2. Run `./deploy-pages.sh`. It copies `public/` to the `gh-pages` branch, and GitHub rebuilds the site in about a minute.
3. GitHub Pages is set to **Settings → Pages → Deploy from a branch → `gh-pages` / (root)**.

All page links are relative, so the site works under the `/senior-pages/` subpath. Canonical, og:url, og:image and JSON-LD URLs use `https://melissakiehl.github.io/senior-pages/<slug>/`.

## 2. The form: Google Sheet + email (Google Apps Script)
Every form on the ten pages posts to one free Google Apps Script web app that runs in your own Google account. No other service, account or card is needed. Each note:
- adds a row to the Google Sheet **Landing Page Leads**, tab **Leads** (Timestamp, Page, Name, Street address, Town or city, State, ZIP, Situation answer, Page URL): https://docs.google.com/spreadsheets/d/1zmZChDzrVOAmM_4bScBprxydr_F2H_4X0UHOMLJKGIk/edit
- emails **mk@melissakiehl.com** with the subject **LEAD: Landing page - <page name>**, then labels that email **LEAD**, stars it and marks it important. The script does the labelling itself because Gmail filters can't be created from the connector.

The script's code is in `apps-script/Code.gs`. One-time setup in the browser, signed in as mk@melissakiehl.com:
1. Open the sheet, then go to **Extensions > Apps Script**. Delete what's in `Code.gs`, paste in all of `apps-script/Code.gs`, and click Save.
2. Choose `testSetup` in the function menu and click **Run**. Google will ask for permission (Sheets and Gmail). Click **Review permissions**, choose your account, then **Advanced > Go to project (unsafe)** if it shows, then **Allow**. This is your own script, so the warning is expected.
3. Click **Deploy > New deployment**, click the gear, and choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
4. Paste that URL between the quotes in `public/lead-endpoint.js`, commit it on `main` and run `./deploy-pages.sh` (or ask the Landing Pages bot to do it). All ten pages read that one file.

Until a URL is in `lead-endpoint.js`, submitting a form sends nothing: the page shows a short note asking people to call 860.480.4169 instead.

If you edit the script later, use **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy** so the URL stays the same. Apps Script's free limits (about 100 emails a day on a regular Gmail account, 1,500 on Google Workspace) are far above what these pages need.

## 3. Your own domain (later)
1. In **Settings → Pages → Custom domain**, enter the domain (for example `homes.melissakiehl.com`), save, and tick **Enforce HTTPS** once it's offered.
2. At your DNS provider, add a **CNAME** record pointing that name to `melissakiehl.github.io`.
3. In every page, replace `https://melissakiehl.github.io/senior-pages/` with the new address (canonical, og:url, og:image and JSON-LD), and in `404.html` change `/senior-pages/` links to `/`. Then commit and deploy.

## Adding another page
Copy one of the page folders under `public/` to a new folder named for the search phrase. Edit the blocks marked `PAGE-SPECIFIC`, give the page its own main color in the `:root` block (`--accent`, `--accent-dark`, `--accent-tint`; white text on `--accent` must stay at 4.5:1 or better; no red), add a link in `public/index.html`, then commit and deploy.

(Kinsta/Sevalla was the earlier plan. It isn't used now.)
