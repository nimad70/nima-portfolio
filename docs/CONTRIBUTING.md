# Working agreements

## Branching

**Never commit to `main`.** `main` only ever receives merges from `dev`.

```
main                 production · protected
 └── dev             integration · default PR target
      ├── feat/…     new capability
      ├── fix/…      bug fix
      ├── chore/…    tooling, deps, config
      └── docs/…     documentation only
```

Every branch starts from `dev` and returns to `dev` by pull request. `dev` merges
to `main` only when the full suite is green and the manual checklist below passes.

```sh
git checkout dev && git pull
git checkout -b feat/thing dev
# …work…
git push -u origin feat/thing     # open PR into dev
```

### Branch protection

Configure on **both** `main` and `dev`:

- Require a pull request before merging
- Require status checks to pass
- Block direct pushes and force pushes

## Commits

Conventional Commits, so history stays greppable and releases can be generated:

```
feat(chat): stream grounded answers from Workers AI
fix(nav): make the mobile toggle keyboard operable
chore(ci): add axe to the e2e job
docs(architecture): record the static-first decision
```

Scope is the area touched (`chat`, `nav`, `content`, `worker`, `ci`, …).
Write the subject in the imperative, under ~72 characters.

## CI gates

Every PR into `dev` must pass:

| Check | Command |
|---|---|
| Types | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit + component | `npm run test` |
| Build | `npm run build` |
| End-to-end | `npm run test:e2e` |
| Accessibility | axe, zero violations, inside the e2e job |
| Performance | Lighthouse CI budget |
| Content | invalid MDX frontmatter or a broken internal link fails the build |

## Manual checklist before `dev → main`

- [ ] Every route renders meaningful content with **JavaScript disabled**
- [ ] The whole site is navigable by **keyboard alone**
- [ ] Both themes checked at 375px and 1440px
- [ ] Every legacy `.html` URL 301s to its new route
- [ ] The chatbot declines to answer something outside its corpus rather than inventing one
- [ ] No hardcoded colour outside `tokens.css`

## Testing

Tests are anchored to real defects — see `docs/ARCHITECTURE.md` § Invariants. Each
invariant exists because the pre-rebuild site violated it, and each has a test.

**Deliberately not done:** markup snapshot tests, coverage thresholds, unit tests
of React rendering. They cost maintenance and catch nothing here.

## Deploy targets

| Branch | Target |
|---|---|
| `main` | production — `nimadaryabar.com` |
| `dev` | `dev.nimadaryabar.com` |
| PR branches | per-PR preview URL |

The production DNS cutover happens once, late, against a build already verified on
`*.workers.dev`. See `docs/DNS-RESTORE.md`.
