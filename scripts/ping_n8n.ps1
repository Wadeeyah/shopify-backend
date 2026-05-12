$n8nUrl = "https://nango1.app.n8n.cloud/webhook/insightflow"
$body = '{"event":"handshake","source":"insightflow-saas","timestamp":"2026-02-19T15:25:00Z","message":"Phase 2 connectivity check"}'

Write-Host "Pinging n8n production webhook..." -ForegroundColor Cyan
try {
    $headers = @{ "Content-Type" = "application/json" }
    $r = Invoke-RestMethod -Uri $n8nUrl -Method POST -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "[OK] n8n responded:" -ForegroundColor Green
    $r | ConvertTo-Json -Depth 3
}
catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "HTTP $code - $($_.Exception.Message)" -ForegroundColor Yellow
    if ($code -eq 404) {
        Write-Host "Workflow not active. Activate in n8n editor and retry." -ForegroundColor Yellow
    }
    elseif ($code -eq 200 -or $null -eq $code) {
        Write-Host "[OK] n8n is reachable." -ForegroundColor Green
    }
}
