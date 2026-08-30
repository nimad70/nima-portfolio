# Runbook: Restore nimadaryabar.com on GitHub Pages

**Status when written:** 2026-08-30 — domain resolves to a Spaceship parking page. HTTPS times out.

## Diagnosis

Nameservers moved to Spaceship correctly, but the zone was created with Spaceship's
default **parking** A records instead of GitHub Pages' IPs.

```
nimadaryabar.com  A → 54.149.79.189, 34.216.117.25
                      = ec2-*.us-west-2.compute.amazonaws.com (Spaceship parking)
                      = serves <title>Parking Page</title> on :80, nothing on :443
www.nimadaryabar.com  → does not resolve at all (no A, no CNAME)
```

The GitHub side is **untouched and fine** — `nimad70.github.io/nima-portfolio/`
still 301-redirects to `nimadaryabar.com`, which proves the custom domain from the
repo's `CNAME` file is still registered with Pages.

### Why it looks completely dead, not merely wrong

GitHub Pages sends `Strict-Transport-Security` while "Enforce HTTPS" is on. Any
browser that previously loaded the site over HTTPS now force-upgrades to HTTPS,
which times out. Returning visitors and Google get a hard failure, not the parking page.

## Fix

### Step 1 — Turn off parking at Spaceship

In the Spaceship dashboard, open the domain and **disable Parking / "Website
placeholder"** before touching DNS. If left on, it can re-add the parking records.

### Step 2 — Replace the DNS records

Spaceship dashboard -> `nimadaryabar.com` -> **Advanced DNS**.

**Delete** both parking A records: `54.149.79.189` and `34.216.117.25`.

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

Use a low TTL (300) for now; raise it to 3600 once everything is confirmed working.

### Step 3 — Verify propagation

```sh
dig +short nimadaryabar.com A          # expect the four 185.199.10x.153
dig +short www.nimadaryabar.com CNAME  # expect nimad70.github.io.
curl -sSI http://nimadaryabar.com | head -3   # expect Server: GitHub.com
```

Wait until `dig` shows the GitHub IPs before moving on. Usually minutes.

### Step 4 — Re-issue the TLS certificate

GitHub only requests a Let's Encrypt cert after its own DNS check passes.

1. Repo -> **Settings** -> **Pages**
2. Confirm **Source** is the branch serving the site (`main`, root)
3. Under **Custom domain**, click **Remove**, then re-enter `nimadaryabar.com` and **Save**
   (this forces a fresh DNS check — do not skip)
4. Wait for the green "DNS check successful"
5. Tick **Enforce HTTPS** once it becomes selectable (can take up to ~1 hour
   while the cert is provisioned — the checkbox stays greyed out until then)

Do not remove the `CNAME` file from the repo; Pages reads the custom domain from it.

### Step 5 — Final verification

```sh
curl -sSI https://nimadaryabar.com | head -3        # expect 200, Server: GitHub.com
curl -sSI https://www.nimadaryabar.com | head -5    # expect 301 -> https://nimadaryabar.com
```

## Rollback

Restoring `54.149.79.189` / `34.216.117.25` returns the parking page. There is no
reason to do this — nothing of value is on those IPs.

## Note for the Cloudflare migration (Phase 3)

Cloudflare Pages can only attach an **apex** custom domain when the zone is on
Cloudflare's own nameservers. That migration means repointing NS at Spaceship from
`launch1/launch2.spaceship.net` to the pair Cloudflare assigns. Spaceship stays the
registrar. Do that only once the new site is built and verified on a `*.pages.dev`
URL, so the live site is never dark again.
