$cred = Get-Credential -UserName "srinu996316-cell" -Message "Enter your GitHub Personal Access Token (PAT) as the password."
$token = $cred.GetNetworkCredential().Password
if (-not $token) {
    Write-Error "No token entered."
    exit 1
}

Write-Host "Setting temporary remote URL with token..."
.git_portable\cmd\git.exe remote set-url origin "https://${token}@github.com/Animatouv/AgriScanAI.git"

Write-Host "Pushing to GitHub..."
.git_portable\cmd\git.exe push -u origin main

Write-Host "Cleaning up remote URL..."
.git_portable\cmd\git.exe remote set-url origin "https://github.com/Animatouv/AgriScanAI.git"

Write-Host "Done! Code successfully pushed to https://github.com/Animatouv/AgriScanAI"
