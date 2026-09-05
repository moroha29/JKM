# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, roughly evenly weighted:

- **Cold inbound** — strangers arriving via search, a shared link, or a GitHub/LinkedIn profile, with zero prior context on JKM. The site must establish credibility from the first ten seconds.
- **Warm referrals** — people who already half-know the studio (past colleagues, founder friends, referred leads). For them the site's job is to reassure and convert an existing conversation into a signed project.

Both are potential clients evaluating whether to hire a three-person Singapore digital studio for a product, brand, or systems engagement. A secondary audience is existing/current clients who land on the site to reassure themselves the studio delivers.

## Product Purpose

JKM is a three-person Singapore digital studio (strategy, design, engineering in one room) that builds products, brands, and systems for paying clients, plus selective internal tools. The site's purpose is to convert visits into leads: communicate professionalism, prove real delivery ("we get shit done") with named client work, and make it trivially easy to start a conversation.

Success = a qualified visitor emails the studio, or an existing lead feels reassured enough to keep trusting the studio with more work.

## Positioning

Three senior generalists — not a pipeline of account managers and juniors — personally design and ship production-grade technical systems for real, named clients in Singapore (geospatial decision platforms, e-commerce/quotation engines, editorial content systems), and stay close enough to the work to own the unglamorous parts (security, data models, deployment, recovery) that most agencies hand off. A competitor that outsources delivery or shows only concept work could not truthfully make the same claim.

## Operating Context

- Deployed as a static site on GitHub Pages (`moroha29.github.io/JKM/`), auto-published via `.github/workflows/pages.yml` on push to `main`. No backend, build step, or server-side contact form is available unless one is deliberately added (e.g. a static form service).
- The studio's real work lives in separate repos under the `moroha29` GitHub org; some are private client codebases and must not be linked as if public.

## Capabilities and Constraints

- No CMS or backend: all content (case studies, copy, people) is hand-edited in the static site's source.
- **No GitHub repository links anywhere on the site** — the client audience is non-technical and doesn't need them. Case studies link to live product URLs only (where one exists); private-codebase cases get a plain text note instead of a link, never a "View repository" link, even for the two repos that happen to be public (`moroha29/moof-website`, `moroha29/mySOS`).
- Founder identities (names, roles, portraits) are still undecided — current placeholders ("Nameplate reserved") stay placeholders until the founders provide real information. Do not invent names, roles, or bios.
- Contact channel is a direct `mailto:junhong.tan@gmail.com` link — no booking tool or contact form exists.

## Brand Commitments

- Name: **JKM**. Existing tagline: "Ideas, made useful." Existing wordmark/lockup and favicon exist in `assets/` and should be preserved unless the user asks to redo brand identity itself.
- Existing voice: plain, confident, engineering-literate; understated rather than hype-driven ("Small by design. Senior by default."). Preserve this voice in new/rewritten copy.
- Design research the current build cites as influence (principles only, not assets or copy): Locomotive, Studio Freight, Instrument, A1 Gallery's agency collection, Creative Bloq's portfolio review.

## Evidence on Hand

Real, nameable client/product work (confirmed by the user; do not add others):

1. **RexSG** — live at https://www.rexsg.com. Map-first geospatial decision platform for Singapore HDB/property buyers (PostGIS-backed scoring, accessibility, commute, appreciation, and recommendation engines; FastAPI/React/PostGIS stack per the `estate-finder` codebase). This is the same project previously described on the site as "HomeOS" — treat as one project going by RexSG going forward, not two. Underlying repo is private and is never linked. Screenshot on the site is client-supplied, not self-captured.
2. **Moof** — a Shenton Way matcha/hojicha bar. Editorial web + content system, five built design directions on shared content; the chosen direction was promoted to the repo root. Live site: `https://moroha29.github.io/moof-website/` (root, not `/e/`). Photography credited to Zawani Abdul Ghani / HungryGoWhere (existing credit line must be preserved if photography is reused). Repo is public but not linked (no repo links anywhere on this site).
3. **mySOS** — a fully static React site: public product catalogue plus an internal agent quotation engine for custom merchandise (apparel, printing methods, tiered pricing). Live site: `https://moroha29.github.io/mySOS/` (quotation engine at `/quotation_engine/`). Real evidence of production business logic (pricing/cost separation, multiple printing methods, catalogue-driven UI). Repo is public but not linked.
4. **Website Manager** — internal-facing publishing/ops platform: sandboxed visual editing, before/after revision review, role-based access, resumable deployment. Private repo, never linked. No public live demo exists; the current site's reconstructed interface mock is the only visual evidence and should stay clearly labeled as a reconstruction, not a real screenshot.

No testimonials, press mentions, or additional named clients exist beyond the four above. Do not fabricate quotes, logos, or additional client names.

## Product Principles

1. **Named, verifiable work beats a logo wall.** With one true "agency client" (Moof) and three studio-built products used by real businesses, the credible move is depth (real links, real technical detail) over a thin "partners" strip that overstates the roster.
2. **Never link what a visitor can't open.** Private-repo evidence is described, not linked as if browsable; only `moof-website` and `mySOS` get repository links.
3. **Design for the first ten seconds and the tenth minute.** Cold visitors need instant credibility (clear positioning, real product names, a working contact path); warm/returning visitors should be rewarded with real depth (build stories, decisions, outcomes) if they scroll in.
4. **The ask must always be one click away.** Every case study and the top-level nav should make "email us" trivial to find and to act on.
5. **Preserve the studio's understated voice.** Confidence through specificity (numbers, decisions, real names) rather than superlatives or hype copy.

## Accessibility & Inclusion

No product-specific requirement beyond general web accessibility best practice (the incumbent site already respects `prefers-reduced-motion` and includes a skip link; preserve or improve on this bar).
