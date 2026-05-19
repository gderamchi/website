# 🚀 Automatic Portfolio Sync Setup

## Goal
Make your portfolio automatically update whenever you push to **ANY** of your public repos.

## 📋 How It Works

```
You push to repo → GitHub webhook → Portfolio workflow runs → Portfolio updates
```

### Current Behavior (Before Setup):
- ❌ Push to `hack-the-gap` → Nothing happens
- ❌ Push to `mini-hack` → Nothing happens  
- ✅ Push to `website` → Only updates website repo (incremental)
- ✅ Sunday midnight → Full sync (all repos)

### After Setup:
- ✅ Push to `hack-the-gap` → Portfolio updates automatically!
- ✅ Push to `mini-hack` → Portfolio updates automatically!
- ✅ Push to ANY repo → Portfolio updates automatically!

## 🎯 Quick Setup (Automated)

### Step 1: Create Personal Access Token (PAT)

1. Go to: **https://github.com/settings/tokens/new**
2. Fill in:
   - **Note:** `Portfolio Auto-Sync`
   - **Expiration:** No expiration (or 1 year)
   - **Scopes:** Check ✅ `repo` (Full control of private repositories)
3. Click **"Generate token"**
4. **Copy the token** (starts with `ghp_...`) - you'll need it in Step 2

⚠️ **IMPORTANT:** Save this token somewhere safe! You won't be able to see it again.

### Step 2: Run the Automated Setup Script

```bash
cd /Users/guillaume_deramchi/Documents/website
./scripts/setup-auto-sync.sh
```

The script will:
1. ✅ Check if GitHub CLI is installed
2. ✅ Fetch all your public repos
3. ✅ Add the notification workflow to each repo
4. ✅ Add the PORTFOLIO_TOKEN secret to each repo
5. ✅ Commit and push the changes

**That's it!** Your portfolio will now auto-update on every push.

## 🔧 Manual Setup (If Script Fails)

If the automated script doesn't work, you can set it up manually:

### For Each Repository:

#### 1. Add the Workflow File

Create `.github/workflows/notify-portfolio.yml`:

```yaml
name: Notify Portfolio

on:
  push:
    branches:
      - main
      - master

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger portfolio update
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Authorization: token ${{ secrets.PORTFOLIO_TOKEN }}" \
            https://api.github.com/repos/gderamchi/website/dispatches \
            -d '{"event_type":"update-portfolio","client_payload":{"repository":"${{ github.repository }}","ref":"${{ github.ref }}","pusher":"${{ github.actor }}"}}'
```

#### 2. Add the Secret

1. Go to your repo: `https://github.com/gderamchi/YOUR-REPO/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `PORTFOLIO_TOKEN`
4. Value: Paste your PAT from Step 1
5. Click **"Add secret"**

#### 3. Commit and Push

```bash
git add .github/workflows/notify-portfolio.yml
git commit -m "Add automatic portfolio sync notification"
git push
```

### Repeat for All Repos

You need to do this for:
- ✅ hack-the-gap
- ✅ hack-station-f
- ✅ minihack-foodtech
- ✅ mini-hack
- ✅ ai-video-maker
- ✅ landing-page
- ✅ startup-idea
- ✅ hackathonblackbox42
- ✅ (and any other repos you want to track)

## 🧪 Testing

### Test the Setup:

1. Make a small change to any repo (e.g., update README)
2. Commit and push:
   ```bash
   git commit -am "Test portfolio sync"
   git push
   ```
3. Check GitHub Actions:
   - Go to: https://github.com/gderamchi/website/actions
   - You should see "Sync Portfolio Projects" running
   - It should say "Triggered by push to gderamchi/YOUR-REPO"

4. Wait 2-3 minutes

5. Check your portfolio:
   - Go to: https://guillaume-portfolio-omega.vercel.app/projects
   - Your project should be updated!

## 📊 What Happens When You Push

```
1. You push to hack-the-gap
   ↓
2. GitHub triggers notify-portfolio.yml workflow in hack-the-gap
   ↓
3. Workflow sends API request to website repo
   ↓
4. website repo receives repository_dispatch event
   ↓
5. sync-portfolio.yml workflow runs (FULL SYNC)
   ↓
6. Scans all your repos
   ↓
7. Updates projects-data.js
   ↓
8. Commits and pushes
   ↓
9. Vercel deploys from `main`
   ↓
10. Portfolio is updated! 🎉
```

## 🔍 Troubleshooting

### Workflow doesn't trigger

**Check:**
1. Is PORTFOLIO_TOKEN secret set in the repo?
2. Does the token have `repo` scope?
3. Is the workflow file in `.github/workflows/notify-portfolio.yml`?
4. Did you push to `main` or `master` branch?

**Fix:**
```bash
# Check if workflow exists
ls -la .github/workflows/

# Check if secret is set (will show *** if set)
gh secret list

# Re-add secret
echo "YOUR_TOKEN" | gh secret set PORTFOLIO_TOKEN
```

### Portfolio doesn't update

**Check:**
1. Go to: https://github.com/gderamchi/website/actions
2. Look for failed workflows (red X)
3. Click on the workflow to see error logs

**Common issues:**
- ❌ BLACKBOX_API secret not set → AI features disabled (but sync still works)
- ❌ Rate limit exceeded → Wait 1 hour or add GITHUB_TOKEN
- ❌ Syntax error in workflow → Check YAML formatting

### Token expired

**Fix:**
1. Create a new token (Step 1 above)
2. Update secret in ALL repos:
   ```bash
   # Using GitHub CLI
   for repo in hack-the-gap hack-station-f minihack-foodtech; do
     echo "YOUR_NEW_TOKEN" | gh secret set PORTFOLIO_TOKEN --repo gderamchi/$repo
   done
   ```

## 🎯 Alternative: Simpler Approach

If the above is too complex, you can use a **simpler approach**:

### Option 1: Manual Trigger (Current)
- Push to any repo
- Go to: https://github.com/gderamchi/website/actions
- Click "Run workflow" → Select "full"
- Takes 30 seconds of your time

### Option 2: More Frequent Schedule
Edit `.github/workflows/sync-portfolio.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours instead of weekly
```

This way your portfolio updates automatically 4 times a day.

## ✅ Verification Checklist

After setup, verify:

- [ ] Created Personal Access Token with `repo` scope
- [ ] Added workflow file to each repo
- [ ] Added PORTFOLIO_TOKEN secret to each repo
- [ ] Tested by pushing to one repo
- [ ] Saw workflow run in website/actions
- [ ] Portfolio updated with changes

## 🎉 Success!

Once set up, you'll never have to manually update your portfolio again!

Every push to any repo = automatic portfolio update. 🚀

---

**Need help?** Check the workflow logs at: https://github.com/gderamchi/website/actions
