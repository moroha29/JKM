# JKM portfolio

Standalone portfolio for JKM, a three-person Singapore digital studio. It is a
dependency-free static site deployed at <https://moroha29.github.io/JKM/>.

## Featured work

- **RexSG** — a live, public geospatial decision platform (HDB Match) for
  Singapore home buyers, at <https://www.rexsg.com>.
- **Moof** — an editorial web and content system for a matcha bar, at
  <https://moroha29.github.io/moof-website/>.
- **mySOS** — a public merchandise catalogue and internal quotation engine
  sharing one dataset, at <https://moroha29.github.io/mySOS/>.
- **Website Manager** — safe visual editing, revision review, and durable
  publishing for non-technical teams.

RexSG, Moof, and mySOS screenshots are captured from their live production
builds. The Website Manager frame is an interface reconstruction because its
production screens are authenticated. Moof photography is credited on the
page to Zawani Abdul Ghani / HungryGoWhere, matching the source project's
content credit. No client repositories are linked from this site; clients
evaluating the studio don't need GitHub links.

## Edit the founders

Search `index.html` for `Nameplate reserved`. Replace the three placeholder
person cards with real names, roles, and portraits when the founders are
ready.

## Local preview

Any static server works:

```bash
python -m http.server 8080
```

Open <http://127.0.0.1:8080/>. All asset paths are relative so the same build
works at the GitHub Pages `/JKM/` project path.

## Direction

The site's visual system is a Singapore civic wayfinding/estate-directory
signboard: forest green and navy panels, cream ground, one reserved amber
accent, Archivo for display type, JetBrains Mono for tabular figures. It
replaces an earlier dark-mode "digital studio" template. See `PRODUCT.md` for
product truth and `.impeccable/surfaces/index-html.md` for the direction
contract.

## Deployment

`.github/workflows/pages.yml` deploys the repository root through GitHub
Pages on every push to `main`. No build step, environment secret, or
framework runtime is required.
