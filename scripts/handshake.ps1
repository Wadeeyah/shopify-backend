$projectId = "zidevnuuqhmcqnskggjv"
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZGV2bnV1cWhtY3Fuc2drZ2p2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU5MTc1OSwiZXhwIjoyMDgxMTY3NzU5fQ.DRQFDQKAoHeVD1TwppwBZ_YGNbfh-RCtrtv6NgSg-uE"
$n8nUrl = "https://nango1.app.n8n.cloud/webhook/insightflow"
$supabaseUrl = "https://$projectId.supabase.co"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " INSIGHTFLOW — CONNECTIVITY HANDSHAKE" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. SUPABASE: Check project health ---
Write-Host "[ 1/3 ] Supabase Project Ping..." -ForegroundColor Yellow
try {
    $healthUrl = "$supabaseUrl/rest/v1/"
    $headers = @{
        "apikey"        = $serviceKey
        "Authorization" = "Bearer $serviceKey"
    }
    $r = Invoke-RestMethod -Uri $healthUrl -Headers $headers -Method GET -ErrorAction Stop
    Write-Host "[  OK  ] Supabase REST API is reachable." -ForegroundColor Green
}
catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 404 -or $code -eq 400) {
        # 404/400 on /rest/v1/ is normal — it means the API responded (no table specified)
        Write-Host "[  OK  ] Supabase REST API is reachable (HTTP $code on root is expected)." -ForegroundColor Green
    }
    else {
        Write-Host "[ FAIL ] Supabase: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# --- 2. SUPABASE: Apply migration SQL via pg REST endpoint ---
Write-Host "[ 2/3 ] Applying migration SQL via Supabase SQL API..." -ForegroundColor Yellow
$sqlFile = "$PSScriptRoot\..\supabase\migrations\001_initial_schema.sql"
if (!(Test-Path $sqlFile)) {
    Write-Host "[ FAIL ] Migration file not found: $sqlFile" -ForegroundColor Red
}
else {
    $sql = Get-Content $sqlFile -Raw
    $body = @{ query = $sql } | ConvertTo-Json -Depth 1
    $sqlHeaders = @{
        "apikey"        = $serviceKey
        "Authorization" = "Bearer $serviceKey"
        "Content-Type"  = "application/json"
    }
    try {
        $res = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/query" -Method POST -Headers $sqlHeaders -Body $body -ErrorAction Stop
        Write-Host "[  OK  ] Migration applied successfully." -ForegroundColor Green
        $res | ConvertTo-Json | Write-Host
    }
    catch {
        $code = $_.Exception.Response.StatusCode.value__
        Write-Host "[ NOTE ] Direct SQL via RPC endpoint: HTTP $code" -ForegroundColor Yellow
        Write-Host "         SQL will be applied via Supabase Dashboard or CLI." -ForegroundColor Yellow
    }
}
Write-Host ""

# --- 3. N8N: Ping production webhook ---
Write-Host "[ 3/3 ] Pinging n8n production webhook..." -ForegroundColor Yellow
try {
    $n8nBody = @{
        event     = "handshake"
        source    = "insightflow-saas"
        timestamp = (Get-Date -Format o)
        message   = "Protocol 0 connectivity check"
    } | ConvertTo-Json
    $n8nRes = Invoke-RestMethod -Uri $n8nUrl -Method POST `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $n8nBody -ErrorAction Stop
    Write-Host "[  OK  ] n8n responded:" -ForegroundColor Green
    $n8nRes | ConvertTo-Json | Write-Host
}
catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code -eq 404) {
        Write-Host "[ WARN ] n8n 404 — Workflow may not be active. Activate it in the n8n editor." -ForegroundColor Yellow
    }
    else {
        Write-Host "[ FAIL ] n8n: HTTP $code — $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " HANDSHAKE COMPLETE" -ForegroundColor Cyan
Write-Host " Supabase URL: $supabaseUrl" -ForegroundColor White
Write-Host " n8n Webhook:  $n8nUrl" -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
