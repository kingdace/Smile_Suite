Write-Host "Network IP Detection and Configuration Update" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Function to get IP address with multiple fallback methods
function Get-NetworkIP {
    $ip = $null

    # Method 1: Try ipconfig (most reliable on Windows)
    try {
        $ipConfig = ipconfig | Select-String "IPv4 Address"
        if ($ipConfig) {
            $ip = ($ipConfig -split ":")[1].Trim()
            Write-Host "Method 1 (ipconfig): Found IP $ip" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Method 1 failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # Method 2: Try Get-NetIPAddress (PowerShell native)
    if (-not $ip) {
        try {
            $netIP = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1
            if ($netIP) {
                $ip = $netIP.IPAddress
                Write-Host "Method 2 (Get-NetIPAddress): Found IP $ip" -ForegroundColor Gray
            }
        } catch {
            Write-Host "Method 2 failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Method 3: Try WMI
    if (-not $ip) {
        try {
            $wmiIP = Get-WmiObject -Class Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true -and $_.IPAddress -ne $null } | Select-Object -First 1
            if ($wmiIP -and $wmiIP.IPAddress) {
                $ip = $wmiIP.IPAddress[0]
                Write-Host "Method 3 (WMI): Found IP $ip" -ForegroundColor Gray
            }
        } catch {
            Write-Host "Method 3 failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    return $ip
}

# Get current IP
Write-Host "Detecting your current network IP address..." -ForegroundColor Yellow
$currentIP = Get-NetworkIP

if (-not $currentIP) {
    Write-Host ""
    Write-Host "Could not automatically detect IP address." -ForegroundColor Red
    Write-Host "This might be due to university network restrictions." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please enter your IP address manually:" -ForegroundColor Cyan
    Write-Host "You can find it by running 'ipconfig' in another terminal" -ForegroundColor Gray
    Write-Host ""
    do {
        $currentIP = Read-Host "Enter your IP address (e.g., 192.168.1.100)"
        if ($currentIP -match '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$') {
            break
        } else {
            Write-Host "Invalid IP format. Please try again." -ForegroundColor Red
        }
    } while ($true)
}

Write-Host ""
Write-Host "Using IP Address: $currentIP" -ForegroundColor Green
Write-Host ""

# Check if files exist and are writable
$filesToUpdate = @(
    @{Path = 'config/cors.php'; Name = 'CORS Configuration'},
    @{Path = 'vite.config.js'; Name = 'Vite Configuration'},
    @{Path = 'MOBILE_ACCESS_SETUP.md'; Name = 'Documentation'}
)

Write-Host "Checking file permissions..." -ForegroundColor Yellow
$canUpdate = $true

foreach ($file in $filesToUpdate) {
    if (Test-Path $file.Path) {
        try {
            $content = Get-Content $file.Path -Raw -ErrorAction Stop
            Write-Host "  $($file.Name): OK" -ForegroundColor Green
        } catch {
            Write-Host "  $($file.Name): Cannot read - $($_.Exception.Message)" -ForegroundColor Red
            $canUpdate = $false
        }
    } else {
        Write-Host "  $($file.Name): File not found" -ForegroundColor Red
        $canUpdate = $false
    }
}

if (-not $canUpdate) {
    Write-Host ""
    Write-Host "Cannot update files due to permission issues." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator or check file permissions." -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Updating configuration files..." -ForegroundColor Yellow

# Update CORS configuration
Write-Host "  Updating CORS configuration..." -ForegroundColor Gray
try {
    $corsContent = Get-Content 'config/cors.php' -Raw
    # Remove old network IPs and add new one
    $corsContent = $corsContent -replace 'http://\d+\.\d+\.\d+\.\d+:5173', "http://$currentIP:5173"
    $corsContent = $corsContent -replace 'http://\d+\.\d+\.\d+\.\d+:8000', "http://$currentIP:8000"
    Set-Content 'config/cors.php' $corsContent -Encoding UTF8
    Write-Host "    CORS: Updated successfully" -ForegroundColor Green
} catch {
    Write-Host "    CORS: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Update Vite configuration
Write-Host "  Updating Vite configuration..." -ForegroundColor Gray
try {
    $viteContent = Get-Content 'vite.config.js' -Raw
    # Update HMR host for network access
    $viteContent = $viteContent -replace 'host: "localhost"', "host: `"$currentIP`""
    $viteContent = $viteContent -replace 'host: "\d+\.\d+\.\d+\.\d+"', "host: `"$currentIP`""
    Set-Content 'vite.config.js' $viteContent -Encoding UTF8
    Write-Host "    Vite: Updated successfully" -ForegroundColor Green
} catch {
    Write-Host "    Vite: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Update documentation
Write-Host "  Updating documentation..." -ForegroundColor Gray
try {
    $docContent = Get-Content 'MOBILE_ACCESS_SETUP.md' -Raw
    $docContent = $docContent -replace '\d+\.\d+\.\d+\.\d+', $currentIP
    Set-Content 'MOBILE_ACCESS_SETUP.md' $docContent -Encoding UTF8
    Write-Host "    Documentation: Updated successfully" -ForegroundColor Green
} catch {
    Write-Host "    Documentation: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Configuration update completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app will now be accessible at:" -ForegroundColor Cyan
Write-Host "  Local: http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Network: http://$currentIP:8000" -ForegroundColor Yellow
Write-Host "  Vite Dev: http://$currentIP:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "  1. Run: php artisan config:clear" -ForegroundColor White
Write-Host "  2. Start servers: npm run serve:network && npm run dev:network" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
