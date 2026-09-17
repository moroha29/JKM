# JKM portfolio

Standalone portfolio for JKM, a three-person Singapore digital studio. It is a
dependency-free static site deployed at <https://moroha29.github.io/JKM/>.

## Featured work

- **HomeOS** — map-first, agentic decision support for Singapore home buyers.
- **Moof** — a matcha bar website chosen from six live design directions, now run from two content files.
- **MySOS** — a merchandise supplier's public site and agent quotation engine, driven by one set of product data.
- **Website Manager** — safe visual editing, revision review, and durable publishing for Moof and mySOS.

The HomeOS, Moof, and MySOS frames are captures from the live project builds
(<https://moroha29.github.io/moof-website/> and <https://moroha29.github.io/mySOS/>).
The Website Manager frame is an interface reconstruction because its production
screens are authenticated. The HomeOS and Website Manager repositories are private,
so their case studies offer a walkthrough instead of a repository link.

## Edit the founders

Search `index.html` for `Creator 01`, `Creator 02`, and `Creator 03`. Replace the
placeholder names and disciplines, then replace each `.person__portrait` block
with an optimized portrait image if desired. Also replace the contact placeholder
with the final project email and social links.

## Local preview

Any static server works:

```bash
python -m http.server 8080
```

Open <http://127.0.0.1:8080/>. All asset paths are relative so the same build works
at the GitHub Pages `/JKM/` project path.

## Design research

The site derives principles—not visual assets or copy—from several references:

- [Locomotive](https://locomotive.ca/en) — work-first sequencing and human studio voice.
- [Studio Freight](https://studiofreight.com/work/studio-freight) — a clear studio promise and visible rationale behind identity choices.
- [Instrument](https://www.instrument.com/home) — integrated brand, product, and technology positioning.
- [A1 Gallery's agency collection](https://www.a1.gallery/type/agency) — strong taste claim, edited project count, and decision-led case studies.
- [Creative Bloq's portfolio review](https://www.creativebloq.com/portfolios/examples-712368) — image-led immersion balanced with clear context and usable navigation.

The resulting direction uses three deeply explained projects, editorial scale,
real project evidence, a collective house voice, and restrained interaction that
respects reduced-motion preferences.

## Deployment

`.github/workflows/pages.yml` deploys the repository root through GitHub Pages on
every push to `main`. No build step, environment secret, or framework runtime is
required.

## Site navigation

The homepage is one continuous page: introduction, selected work, studio, people,
and contact. A floating section menu highlights the current section as you scroll.
The four homepage project cards contain short summaries and link to full case
studies in `projects/`. Each case study links back to `index.html#work` and to the
other projects. All links work on static hosting and without JavaScript.
