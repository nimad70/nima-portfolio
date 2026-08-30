# Runbook: Restore nimadaryabar.com on GitHub Pages

**Status when written:** 2026-08-30 — domain resolves to a Spaceship parking page. HTTPS times out.

## Diagnosis

Nameservers moved to Spaceship correctly, but **the zone is empty** — Advanced DNS
shows `DNS Records (0)`. When a Spaceship zone has no records, Spaceship answers
the apex itself with its parking IPs.

```
nimadaryabar.com  A → 54.149.79.189, 34.216.117.25
                      = ec2-*.us-west-2.compute.amazonaws.com (Spaceship parking)
                      = serves <title>Parking Page</title> on :80, nothing on :443
www.nimadaryabar.com  → does not resolve at all (no A, no CNAME)
```

These two A records are **injected, not stored**. They do not appear in the
Advanced DNS panel and there is no parking toggle to switch off — which is exactly
why they are hard to find. Verified apex-only, not a wildcard: a nonexistent
subdomain returns NXDOMAIN.

```sh
dig @launch1.spaceship.net nimadaryabar.com A +short   # 54.149.79.189, 34.216.117.25
dig +short doesnotexist.nimadaryabar.com A             # empty -> not a wildcard
```

The GitHub side is **untouched and fine** — `nimad70.github.io/nima-portfolio/`
still 301-redirects to `nimadaryabar.com`, which proves the custom domain from the
repo's `CNAME` file is still registered with Pages.

### Why it looks completely dead, not merely wrong

GitHub Pages sends `Strict-Transport-Security` while "Enforce HTTPS" is on. Any
browser that previously loaded the site over HTTPS now force-upgrades to HTTPS,
which times out. Returning visitors and Google get a hard failure, not the parking page.

## Fix

### Step 1 — Add the records. There is nothing to delete and nothing to switch off.

The zone is empty, so there are no parking records to remove and no parking
setting to disable. **Adding your own apex A records is what stops the parking
answer** — Spaceship only injects it while the zone has nothing of its own.

Spaceship dashboard -> `nimadaryabar.com` -> **Advanced DNS** -> under
`CUSTOM RECORDS` / `Default record group`, use the **"Start by choosing a record"**
row and click **A**.

> **Manage DNS presets** is not a shortcut here. The DNS Preset Manager only
> offers "Create custom records preset" and "Create custom nameservers preset" —
> presets are templates you build yourself to reuse across your own domains, not
> a library of vendor configurations. There is no GitHub Pages preset. Building
> one is more work than entering these five records once.

**Add** these (Host `@` may be shown as blank or as the domain itself):

| Type  | Host | Value                | TTL |
|-------|------|----------------------|-----|
| A     | @    | 185.199.108.153      | 300 |
| A     | @    | 185.199.109.153      | 300 |
| A     | @    | 185.199.110.153      | 300 |
| A     | @    | 185.199.111.153      | 300 |
| AAAA  | @    | 2606:50c0:8000::153  | 300 |
| AAAA  | @    | 2606:50c0:8001::153  | 300 |
| AAAA  | @    | 2606:50c0:8002::153  | 300 |
| AAAA  | @    | 2606:50c0:8003::153  | 300 |
| CNAME | www  | `nimad70.github.io.` | 300 |

All four A records are required — GitHub load-balances across them. The AAAA
records are optional but give IPv6 visitors a direct path. Note the trailing dot
on the CNAME value.

**TTL:** Spaceship's dropdown offers fixed choices rather than a free-text value,
so 300 may not be selectable — pick the shortest on offer. Its default of 30 min is
acceptable and does not delay this fix: the switch away from parking is governed by
the *old* record's TTL (already 300s), not the new one. A short TTL matters only so
that a typo is cheap to correct. Raise it to 1 hour once everything is verified.

### Step 2 — Verify propagation

```sh
dig +short nimadaryabar.com A          # expect the four 185.199.10x.153
dig +short www.nimadaryabar.com CNAME  # expect nimad70.github.io.
curl -sSI http://nimadaryabar.com | head -3   # expect Server: GitHub.com
```

The parking IPs disappear on their own the moment real A records exist — the
injected answer stops as soon as the zone is non-empty. If `54.149.79.189` is
still coming back after the records are saved, it is cached: wait for the old TTL
to expire, or query the authoritative server directly to see the truth:

```sh
dig @launch1.spaceship.net nimadaryabar.com A +short
```

Wait until `dig` shows the GitHub IPs before moving on. Usually minutes.

### Step 3 — Re-issue the TLS certificate

GitHub only requests a Let's Encrypt cert after its own DNS check passes.

1. Repo -> **Settings** -> **Pages**
2. Confirm **Source** is the branch serving the site (`main`, root)
3. Under **Custom domain**, click **Remove**, then re-enter `nimadaryabar.com` and **Save**
   (this forces a fresh DNS check — do not skip)
4. Wait for the green "DNS check successful"
5. Tick **Enforce HTTPS** once it becomes selectable (can take up to ~1 hour
   while the cert is provisioned — the checkbox stays greyed out until then)

Do not remove the `CNAME` file from the repo; Pages reads the custom domain from it.

### Step 4 — Final verification

```sh
curl -sSI https://nimadaryabar.com | head -3        # expect 200, Server: GitHub.com
curl -sSI https://www.nimadaryabar.com | head -5    # expect 301 -> https://nimadaryabar.com
```

## Rollback

Deleting the records you added returns the zone to empty, which brings the parking
page back. There is no reason to do this — nothing of value is on those IPs.

## Note for the Cloudflare migration (Phase 6)

Cloudflare Pages can only attach an **apex** custom domain when the zone is on
Cloudflare's own nameservers. That migration means repointing NS at Spaceship from
`launch1/launch2.spaceship.net` to the pair Cloudflare assigns. Spaceship stays the
registrar. Do that only once the new site is built and verified on a `*.pages.dev`
URL, so the live site is never dark again.

Cloudflare's own nameservers behave the same way on an empty zone, so import the
records before switching NS, not after.
