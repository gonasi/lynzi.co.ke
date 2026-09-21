# lynzi.co.ke: Lynzi Trading website

A static site (HTML, CSS and a little JavaScript) with no build step, no CMS and no database.

```
docs/                 ← the website. Deploy this folder, and only this folder.
  index.html          Home
  about.html          About Us
  solutions.html      Solutions   (#sourcing #export #manufacturing #finance)
  focus.html          Focus Areas (#construction #agro #industrial #energy)
  group.html          The Group
  contact.html        Contact
  assets/css/styles.css
  assets/js/main.js
  assets/img/         logo mark, favicons, social-share image
  _headers            Cloudflare Pages security and caching headers
  .nojekyll           tells GitHub Pages to serve the files as they are
  robots.txt, sitemap.xml
```

## Preview locally

```bash
python3 -m http.server 8787 --directory docs
```

Then open http://localhost:8787.

## Preview on GitHub Pages

GitHub Pages serves the `docs` folder on `main`, and every push to `main` republishes it automatically. The preview is at https://gonasi.github.io/lynzi.co.ke/ and is useful for review before the real domain goes live. The folder is called `docs` because that's the only folder name GitHub Pages can serve from without a deploy workflow.

## Deploy to Cloudflare Pages (free)

**Option A: Direct Upload (no Git).** In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Upload assets. Name the project (for example `lynzi`) and drag in the **`docs` folder**. To update the site later, upload the folder again as a new deployment.

**Option B: Git.** Push this repo to GitHub and connect it in Pages. Leave the build command empty and set the build output directory to `docs`. Each push then deploys automatically.

**Domain.** In the Pages project, open Custom domains and add both `lynzi.co.ke` and `www.lynzi.co.ke`. Cloudflare shows the DNS records to add at your registrar, or adds them itself if the domain's DNS is already on Cloudflare. SSL is issued automatically. The site treats `https://www.lynzi.co.ke` as its main address.

## Contact form (one-time setup)

The form posts to **Formspree** (free tier):

1. Create a Formspree account using **hello@lynzi.co.ke** and add a new form.
2. Copy the form ID, which is the part after `/f/` in the endpoint (for example `xyzabcde`).
3. In `docs/contact.html`, paste it into `data-formspree=""` on the `<form>` tag, so it reads `data-formspree="xyzabcde"`.
4. Redeploy, then send yourself a test message. The first submission asks you to confirm the address.

Until the ID is set, the Send button opens the visitor's email app with their message already addressed to hello@lynzi.co.ke, so no enquiry is lost in the meantime.

## Before launch: open items

- **`[FIGURE TBC]` placeholders (2):** the infrastructure-investment figure in `focus.html` (Focus Area 01) and "Businesses Built" in `group.html` (the stats row). Search the files for `[FIGURE TBC]` and replace the whole `<span class="tbc">…</span>` with the figure.
- **Copy written for the build that isn't in the brief, to confirm:**
  - The Trade Finance capability list in `solutions.html`: contract and purchase-order financing, cashflow bridging, structured payment terms, integration with the other divisions. The brief gave a body line for Division 04 but no capabilities.
  - Short linking lines: the Home "Who We Are" paragraph, the one-liners on the Home division cards, section intros, the banner subtitles and the CTA line.
- **Formspree ID:** see above.

## Brand

| Token                 | Value                                              |
| --------------------- | -------------------------------------------------- |
| Background (navy)     | `#07101f`                                          |
| Panels / cards        | `#0d1c30`                                          |
| Accent (teal-mint)    | `#22d3a6`                                          |
| Text (off-white)      | `#f2f5f8`                                          |
| Body copy (blue-grey) | `#93a1b1`                                          |
| Headlines             | Fraunces (Google Fonts), italic for emphasis words |
| Body / UI             | Inter (Google Fonts)                               |

**Logo.** `assets/img/lynzi-mark.svg` is the mark: three nested rhombus outlines at decreasing opacity. `lynzi-mark-white.svg` is a single-colour version. `favicon.svg` is a heavier small-size version, with the innermost diamond filled so it stays readable at 16px. On the site, the "Lynzi." wordmark and the "TRADING" label are live text in Fraunces and Inter. For the final vector lockup, a designer should refine the mark and convert the wordmark to outlines, then replace these files.

## Imagery

The photos come from [Unsplash](https://unsplash.com/license): free for commercial use, with no attribution required. They load from Unsplash's image CDN, which serves each visitor a size and format (WebP/AVIF) that fits their screen. Everything below the fold is lazy-loaded. To swap a photo, find its `photo-…` ID in the page HTML and replace it everywhere it appears. To self-host instead, download the sizes you need into `docs/assets/img/` and update the `src`/`srcset` URLs.

| Where                        | Photographer               | Unsplash                                               |
| ---------------------------- | -------------------------- | ------------------------------------------------------ |
| Home hero                    | Valentino Gemelas-Krawczyk | [BD-sOzGXx38](https://unsplash.com/photos/BD-sOzGXx38) |
| Closing CTA bands            | Logan Voss                 | [6MOGP85_V-w](https://unsplash.com/photos/6MOGP85_V-w) |
| Solutions banner             | Aron Yigin                 | [wGR7OXAMeQE](https://unsplash.com/photos/wGR7OXAMeQE) |
| Global Sourcing              | Ruchindra Gunasekara       | [GK8x_XCcDZg](https://unsplash.com/photos/GK8x_XCcDZg) |
| Export                       | Nazarizal Mohammad         | [_q7ZWmsatxs](https://unsplash.com/photos/_q7ZWmsatxs) |
| Manufacturing                | Simon Kadula               | [8gr6bObQLOI](https://unsplash.com/photos/8gr6bObQLOI) |
| Trade Finance                | Viktor Talashuk            | [53McvMr9sjo](https://unsplash.com/photos/53McvMr9sjo) |
| Focus Areas banner           | Sahaj Patel                | [4Du-5uizKi4](https://unsplash.com/photos/4Du-5uizKi4) |
| Construction (Focus page)    | Tye Doring                 | [a7xke_rxZRs](https://unsplash.com/photos/a7xke_rxZRs) |
| Construction (Home card)     | Jacek Dylag                | [nhCPOp4A2Xo](https://unsplash.com/photos/nhCPOp4A2Xo) |
| Agro Products                | Erik Esly                  | [mBl3Kog8t6o](https://unsplash.com/photos/mBl3Kog8t6o) |
| Industrial Inputs & Minerals | Dion Beetson               | [oF7hh97lVqA](https://unsplash.com/photos/oF7hh97lVqA) |
| Renewable Energy             | Philipp                    | [HGBCAbRBIME](https://unsplash.com/photos/HGBCAbRBIME) |
| The Group banner             | imsogabriel stock          | [eeijZpKf2Kg](https://unsplash.com/photos/eeijZpKf2Kg) |
| About banner                 | Mustafa Omar               | [Zkao_QBEjk8](https://unsplash.com/photos/Zkao_QBEjk8) |
| About, Our Story             | Sweder Breet               | [5k68xh2BS3g](https://unsplash.com/photos/5k68xh2BS3g) |
| Contact banner               | imsogabriel stock          | [KlMhH1sWckU](https://unsplash.com/photos/KlMhH1sWckU) |

The network graphic in the Home hero is original SVG drawn in the page. It isn't a photo or a stock asset.
