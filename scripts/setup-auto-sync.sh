#!/bin/bash

# Script to automatically add portfolio notification workflow to all your repos
# This enables automatic portfolio updates when you push to any repo

set -e

echo "🚀 Setting up automatic portfolio sync for all repos..."
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo ""
    echo "   On macOS: brew install gh"
    echo "   Then run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "   Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get username
USERNAME=$(gh api user -q .login)
echo "👤 GitHub username: $USERNAME"
echo ""

# Check if PORTFOLIO_TOKEN secret exists
echo "🔑 Checking for PORTFOLIO_TOKEN secret..."
echo ""
echo "⚠️  IMPORTANT: You need to create a Personal Access Token (PAT)"
echo "   1. Go to: https://github.com/settings/tokens/new"
echo "   2. Name: 'Portfolio Auto-Sync'"
echo "   3. Expiration: No expiration (or 1 year)"
echo "   4. Scopes: Check 'repo' (Full control of private repositories)"
echo "   5. Click 'Generate token'"
echo "   6. Copy the token (starts with ghp_...)"
echo ""
read -p "   Have you created the token? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please create the token first, then run this script again"
    exit 1
fi

read -p "   Paste your token here: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

echo "✅ Token received"
echo ""

# Get all repos
echo "📦 Fetching your repositories..."
REPOS=$(gh repo list $USERNAME --limit 100 --json name,isPrivate,isFork -q '.[] | select(.isPrivate == false and .isFork == false) | .name')

if [ -z "$REPOS" ]; then
    echo "❌ No public repositories found"
    exit 1
fi

REPO_COUNT=$(echo "$REPOS" | wc -l | tr -d ' ')
echo "✅ Found $REPO_COUNT public repositories"
echo ""

# Exclude the portfolio repo itself
REPOS=$(echo "$REPOS" | grep -v "^website$" || true)

echo "🔧 Will add workflow to these repos:"
echo "$REPOS" | sed 's/^/   - /'
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Create workflow file content
WORKFLOW_CONTENT='name: Notify Portfolio

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
            https://api.github.com/repos/'$USERNAME'/website/dispatches \
            -d '"'"'{"event_type":"update-portfolio","client_payload":{"repository":"${{ github.repository }}","ref":"${{ github.ref }}","pusher":"${{ github.actor }}"}}'"'"'
'

SUCCESS_COUNT=0
FAILED_COUNT=0

# Process each repo
while IFS= read -r REPO; do
    echo ""
    echo "📝 Processing: $REPO"
    
    # Clone repo to temp directory
    TEMP_DIR=$(mktemp -d)
    
    if gh repo clone "$USERNAME/$REPO" "$TEMP_DIR" -- --depth 1 &> /dev/null; then
        cd "$TEMP_DIR"
        
        # Create .github/workflows directory if it doesn't exist
        mkdir -p .github/workflows
        
        # Write workflow file
        echo "$WORKFLOW_CONTENT" > .github/workflows/notify-portfolio.yml
        
        # Check if there are changes
        if git diff --quiet; then
            echo "   ℹ️  Workflow already exists, skipping"
        else
            # Add secret to repo
            echo "   🔑 Adding PORTFOLIO_TOKEN secret..."
            echo "$TOKEN" | gh secret set PORTFOLIO_TOKEN --repo "$USERNAME/$REPO" 2>&1 | grep -v "token" || true
            
            # Commit and push
            git add .github/workflows/notify-portfolio.yml
            git commit -m "Add automatic portfolio sync notification" &> /dev/null
            
            if git push &> /dev/null; then
                echo "   ✅ Successfully added workflow"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            else
                echo "   ❌ Failed to push changes"
                FAILED_COUNT=$((FAILED_COUNT + 1))
            fi
        fi
        
        cd - > /dev/null
        rm -rf "$TEMP_DIR"
    else
        echo "   ❌ Failed to clone repository"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done <<< "$REPOS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   ✅ Success: $SUCCESS_COUNT repos"
echo "   ❌ Failed: $FAILED_COUNT repos"
echo ""
echo "🎉 Your portfolio will now automatically update when you push to any repo!"
echo ""
echo "🧪 Test it:"
echo "   1. Push to any of your repos"
echo "   2. Check: https://github.com/$USERNAME/website/actions"
echo "   3. You should see 'Sync Portfolio Projects' running"
echo ""
