# GitHub Pages Deployment Script
# Usage: .\deploy.ps1 -RepoName "your-repo-name"

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "`n========================================`n" -ForegroundColor Green
Write-Host "🚀 DEPLOYING TO GITHUB PAGES" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Green

# Set base path for GitHub Pages
$env:VITE_BASE_PATH = "/$RepoName"

Write-Host "📦 Building for production..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build failed! Fix errors and try again." -ForegroundColor Red
    Remove-Item Env:VITE_BASE_PATH
    exit 1
}

Write-Host "`n📤 Deploying to GitHub Pages..." -ForegroundColor Cyan
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Deployment failed! Check your git remote and try again." -ForegroundColor Red
    Remove-Item Env:VITE_BASE_PATH
    exit 1
}

# Clean up
Remove-Item Env:VITE_BASE_PATH

Write-Host "`n========================================`n" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
Write-Host "🌐 Your site will be live at:" -ForegroundColor Cyan
Write-Host "   https://YOUR-USERNAME.github.io/$RepoName`n" -ForegroundColor Yellow
Write-Host "⏱️  It may take 1-2 minutes to go live.`n" -ForegroundColor Gray
Write-Host "📝 Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Enable GitHub Pages in repo Settings → Pages" -ForegroundColor White
Write-Host "   2. Update Google Cloud OAuth with production URL" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Green

