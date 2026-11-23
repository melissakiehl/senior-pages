# Putting page 01 live on Kinsta (Sevalla)

The deploy-ready site is the **`melissa-landing-pages`** folder, a git repository with one commit already made:

```
melissa-landing-pages/
  README.md, SETUP.md, CREDITS.md      <- notes, never published
  public/                              <- everything in here goes live
    index.html                         <- root page (sends visitors to page 01)
    _redirects                         <- "/" -> /downsizing-realtor-connecticut/
    404.html                           <- "page not found"
    downsizing-realtor-connecticut/    <- page 01: index.html, images/, fonts/
```

Once live, the page is at `https://<your-site>.sevalla.page/downsizing-realtor-connecticut/`, and later at your own domain.

---

## 1. Put the folder on GitHub (one time)
1. Sign in to GitHub. Click **+** (top right), then **New repository**.
2. Name it `melissa-landing-pages`. Choose **Private**, don't add a README, and click **Create repository**.
3. Upload the files. Either:
   - Drag the *contents* of `melissa-landing-pages` (including the `public` folder) onto the repo page and click **Commit changes**, or
   - Push the existing local commit: `git remote add origin https://github.com/<you>/melissa-landing-pages.git` then `git push -u origin main`.

## 2. Create the static site in Sevalla
Since Feb 2, 2026, Kinsta static sites are managed in Sevalla, not MyKinsta.
1. Go to **https://app.sevalla.com** and sign in with your **MyKinsta email and password**, or click the Sevalla link at the bottom of MyKinsta.
   - Sevalla asks for billing details and a payment method before you create anything. Static sites are free within 100 GB of bandwidth and 600 build minutes a month.
2. In the left sidebar, click **Static sites**, then **Create static site**.
3. Under **Source**, choose **Private repository** and then **GitHub**.
4. Click **Connect to GitHub**. In the GitHub tab that opens, allow access to `melissa-landing-pages` and come back.
5. Pick **Repository** `melissa-landing-pages` and **Branch** `main`. Leave **Auto-deploy** on.
6. For **Name**, enter `Melissa Landing Pages`.
7. Under **Build settings**:
   - Turn **Build site before publishing** **OFF**. There's no build command, because these are finished HTML files.
   - **Publish directory:** `public`
   - **Index file:** `index.html`, the default
   - **Error file:** `404.html`
8. Click **Create static site**. The first deployment starts right away.

## 3. Find the free Kinsta/Sevalla web address
- The site opens on its **Overview** tab. When the deployment shows **Deployed** and the status says **Live**, the **Details** card shows the site's **Domain**, something like `melissa-landing-pages-ab12c.sevalla.page`.
- Click **Visit site**. The root address redirects to `/downsizing-realtor-connecticut/`.
- The **Domains** tab lists the same free address.

## 4. Turn on the form (Formspree)
Formspree is a free service that emails you whatever someone types into the form. You don't need a server. The free plan allows 50 submissions a month.
1. Sign up at **https://formspree.io** with **mk@melissakiehl.com**, then click the link in the verification email.
2. In the dashboard, click **+** and then **New Form**. Name it `LP 01 Downsizing`, send emails to `mk@melissakiehl.com`, and click **Create Form**.
3. Open the **Integration** tab and copy the code after `/f/` in the endpoint, for example `xyzabcde`.
4. Open `public/downsizing-realtor-connecticut/index.html` and go to **line 483**:
   `<form class="lead-form" id="lead-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>`
   Replace only `YOUR_FORM_ID` with your code. Line 482 is a comment pointing to it. On GitHub, open the file, click the pencil icon, make the change and click **Commit changes**. Sevalla redeploys automatically.
5. Test it: submit the form on the live page. The green thank-you box should appear, and an email titled **"New note from the Downsizing Realtor CT page"** should arrive at mk@melissakiehl.com. The first time, Formspree may ask you to confirm by email.

If you outgrow 50 a month, Web3Forms or Basin work the same way. Change the form `action` (Web3Forms also needs a hidden `access_key` field).

## 5. Your own domain (when you've chosen one)
1. In the site's **Domains** tab, click **Add custom domain**, enter the domain (for example `homes.melissakiehl.com`) and click **Add custom domain**.
2. At your DNS provider, add the two **TXT** records Sevalla shows. Once both say **Verified**, add the **A** record it shows (or a **CNAME** if your DNS is on Cloudflare). SSL is automatic.
3. In `public/downsizing-realtor-connecticut/index.html`, replace every `YOUR-DOMAIN.com` with the real domain (lines 21, 27, 28, 46, 47 and 48) and commit.

## Adding pages 02–10 later
Copy `public/downsizing-realtor-connecticut/` to a new folder named for the search phrase, for example `public/estate-cleanout-services-connecticut/`. Edit the blocks marked `PAGE-SPECIFIC`, give the page its own main color in the `:root` block (`--accent`, `--accent-dark`, `--accent-tint`; white text on `--accent` must stay at 4.5:1 or better) and commit. Keep `--logo-red` (#b40101) for the logo only. Add a link to `public/index.html`. Once there are several pages, delete the line in `public/_redirects` so the root shows the page list instead of redirecting.
