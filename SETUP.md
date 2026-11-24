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

## 2. Turn on the form (Formspree)
Formspree is a free service that emails you whatever someone types into the form. You don't need a server. The free plan allows 50 submissions a month.
1. Sign up at **https://formspree.io** with **mk@melissakiehl.com**, then click the link in the verification email.
2. In the dashboard, click **+** and then **New Form**. Name it, for example, `Landing pages`, send emails to `mk@melissakiehl.com`, and click **Create Form**.
3. Open the **Integration** tab and copy the code after `/f/` in the endpoint, for example `xyzabcde`.
4. Open `public/downsizing-realtor-connecticut/index.html` and go to **line 483**:
   `<form class="lead-form" id="lead-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>`
   Replace only `YOUR_FORM_ID` with your code. Line 482 is a comment pointing to it. Commit it on `main`, then run `./deploy-pages.sh` (or ask the Landing Pages bot to do it). Each of the ten pages has its own form line, so repeat this for every page with its own form, or use one Formspree form for all of them.
   Until a real ID is in place, submitting a form sends nothing: the page shows a short note asking people to call 860.480.4169 instead.
5. Test it: submit the form on the live page. The green thank-you box should appear, and an email titled **"New note from the Downsizing Realtor CT page"** should arrive at mk@melissakiehl.com. The first time, Formspree may ask you to confirm by email.

If you outgrow 50 a month, Web3Forms or Basin work the same way. Change the form `action` (Web3Forms also needs a hidden `access_key` field).

## 3. Your own domain (later)
1. In **Settings → Pages → Custom domain**, enter the domain (for example `homes.melissakiehl.com`), save, and tick **Enforce HTTPS** once it's offered.
2. At your DNS provider, add a **CNAME** record pointing that name to `melissakiehl.github.io`.
3. In every page, replace `https://melissakiehl.github.io/senior-pages/` with the new address (canonical, og:url, og:image and JSON-LD), and in `404.html` change `/senior-pages/` links to `/`. Then commit and deploy.

## Adding another page
Copy one of the page folders under `public/` to a new folder named for the search phrase. Edit the blocks marked `PAGE-SPECIFIC`, give the page its own main color in the `:root` block (`--accent`, `--accent-dark`, `--accent-tint`; white text on `--accent` must stay at 4.5:1 or better; no red), add a link in `public/index.html`, then commit and deploy.

(Kinsta/Sevalla was the earlier plan. It isn't used now.)
