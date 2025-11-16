# 🎯 Complete Auto-Sync Solution: Detect & Update New Repos

## The Challenge

You want the portfolio to:
1. ✅ Auto-update when you push to existing repos
2. ✅ **Auto-detect when you create NEW repos**
3. ✅ Add new repos to portfolio automatically

## 🔍 Current Behavior

### What Works:
- ✅ Full sync scans ALL your repos (including new ones)
- ✅ Runs every Sunday at midnight
- ✅ Can be triggered manually

### What Doesn't Work Yet:
- ❌ New repos don't have the notification workflow
- ❌ Pushing to a new repo doesn't trigger portfolio update
- ❌ You have to manually add workflow to each new repo

## ✅ Complete Solution (3 Options)

### Option 1: Automatic Detection via Frequent Sync (EASIEST)

Make the portfolio scan for new repos more frequently.

**Edit `.github/workflows/sync-portfolio.yml`:**

```yaml
on:
  # Run every 6 hours instead of weekly
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
    # OR
    - cron: '0 * * * *'    # Every hour
    # OR  
    - cron: '*/30 * * * *' # Every 30 minutes
```

**Pros:**
- ✅ Zero setup needed
- ✅ Automatically detects ALL new repos
- ✅ No workflow needed in other repos

**Cons:**
- ⏱️ Up to 6 hours delay (or 1 hour, or 30 min depending on schedule)

**Recommendation:** Use `0 */6 * * *` (every 6 hours) - good balance!

---

### Option 2: GitHub App with Webhooks (MOST AUTOMATIC)

Create a GitHub App that listens to ALL repo events.

**How it works:**
```
Create new repo → GitHub sends webhook → Portfolio updates
Push to any repo → GitHub sends webhook → Portfolio updates
```

**Setup:**
1. Create GitHub App: https://github.com/settings/apps/new
2. Set webhook URL to trigger portfolio workflow
3. Subscribe to `push` and `repository` events
4. Install app on your account

**Pros:**
- ✅ Instant updates (no delay)
- ✅ Detects new repos immediately
- ✅ No workflow needed in other repos

**Cons:**
- 🔧 Complex setup
- 💰 Requires webhook server (or use GitHub Actions as webhook receiver)

---

### Option 3: Hybrid Approach (RECOMMENDED)

Combine frequent sync + manual workflow for new repos.

**Setup:**

1. **Increase sync frequency** (every 6 hours):
   ```yaml
   schedule:
     - cron: '0 */6 * * *'
   ```

2. **Add workflow to existing repos** (one-time):
   ```bash
   ./scripts/setup-auto-sync.sh
   ```

3. **For new repos:** Either:
   - Wait up to 6 hours for auto-detection, OR
   - Manually trigger full sync once, OR
   - Add the workflow file (copy from template)

**Pros:**
- ✅ Best of both worlds
- ✅ Existing repos update instantly
- ✅ New repos detected within 6 hours
- ✅ Can manually trigger for immediate update

**Cons:**
- ⚙️ Requires initial setup for existing repos

---

## 🚀 Recommended Implementation

### Step 1: Update Sync Frequency

Edit `.github/workflows/sync-portfolio.yml`:

```yaml
on:
  push:
    branches:
      - main
      - master
  
  # Run every 6 hours to detect new repos
  schedule:
    - cron: '0 */6 * * *'  # At minute 0 past every 6th hour
  
  workflow_dispatch:
    inputs:
      sync_type:
        description: 'Type of sync to perform'
        required: false
        default: 'full'
        type: choice
        options:
          - full
          - incremental
  
  repository_dispatch:
    types: [update-portfolio]
```

### Step 2: Setup Existing Repos

```bash
cd /Users/guillaume_deramchi/Documents/website

# Create new token (after revoking the old one)
# Then run:
./scripts/setup-auto-sync.sh
```

### Step 3: For Future New Repos

**Option A - Automatic (Wait 6 hours):**
- Create new repo
- Push code
- Wait up to 6 hours
- Portfolio auto-updates ✅

**Option B - Manual (Instant):**
- Create new repo
- Copy `.github/workflows/notify-portfolio.yml` from template
- Add PORTFOLIO_TOKEN secret
- Push code
- Portfolio updates instantly ✅

**Option C - Trigger (30 seconds):**
- Create new repo
- Push code
- Go to: https://github.com/gderamchi/website/actions
- Click "Run workflow" → "full"
- Portfolio updates in 2 minutes ✅

---

## 📊 Comparison Table

| Method | New Repo Detection | Update Speed | Setup Complexity |
|--------|-------------------|--------------|------------------|
| **Weekly Sync** | ✅ Yes | 🐌 Up to 7 days | ⭐ Easy |
| **6-Hour Sync** | ✅ Yes | 🚶 Up to 6 hours | ⭐ Easy |
| **Hourly Sync** | ✅ Yes | 🏃 Up to 1 hour | ⭐ Easy |
| **Workflow per Repo** | ❌ No (manual) | ⚡ Instant | ⭐⭐ Medium |
| **GitHub App** | ✅ Yes | ⚡ Instant | ⭐⭐⭐ Complex |
| **Hybrid (Recommended)** | ✅ Yes | ⚡ Instant (existing)<br>🏃 6h (new) | ⭐⭐ Medium |

---

## 🎯 My Recommendation

Use the **Hybrid Approach**:

1. **Set sync to every 6 hours** (detects new repos automatically)
2. **Add workflow to existing repos** (instant updates for those)
3. **For new repos:** Just wait 6 hours or trigger manually once

This gives you:
- ✅ Instant updates for existing repos
- ✅ Automatic detection of new repos (max 6h delay)
- ✅ Option to manually trigger for immediate update
- ✅ Reasonable GitHub Actions usage (4 runs/day)

---

## 🔧 Implementation

### Update the workflow file:

```bash
cd /Users/guillaume_deramchi/Documents/website
```

Edit `.github/workflows/sync-portfolio.yml` and change:

```yaml
schedule:
  - cron: '0 0 * * 0'  # Weekly (Sunday midnight)
```

To:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

Then commit and push:

```bash
git add .github/workflows/sync-portfolio.yml
git commit -m "Update sync frequency to every 6 hours for new repo detection"
git push
```

### Setup existing repos:

```bash
# Create new PAT token first!
# Then run:
./scripts/setup-auto-sync.sh
```

---

## ✅ Verification

After setup, your portfolio will:

1. **Existing repos with workflow:**
   - Push → Instant update (2-3 minutes)

2. **New repos without workflow:**
   - Create repo → Auto-detected within 6 hours
   - OR manually trigger for instant update

3. **All repos:**
   - Scanned every 6 hours automatically
   - Always up-to-date

---

## 🎉 Result

You'll have a **fully automatic portfolio** that:
- ✅ Updates instantly when you push to existing repos
- ✅ Detects new repos within 6 hours
- ✅ Requires minimal maintenance
- ✅ Works seamlessly across all repos

**No more manual updates needed!** 🚀
