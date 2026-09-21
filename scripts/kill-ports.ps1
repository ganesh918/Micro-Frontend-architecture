# Stops stale MFD dev servers blocking ports 4000 and 5000-5005
$ports = @(4000, 5000, 5001, 5002, 5003, 5004, 5005)
$pids = @()

foreach ($port in $ports) {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($conn in $connections) {
    if ($conn.OwningProcess -and $pids -notcontains $conn.OwningProcess) {
      $pids += $conn.OwningProcess
    }
  }
}

if ($pids.Count -eq 0) {
  Write-Host "No processes found on ports $($ports -join ', ')."
  exit 0
}

Write-Host "Stopping processes on MFD ports: $($pids -join ', ')"
foreach ($processId in $pids) {
  $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
  if ($proc -and $proc.ProcessName -eq 'node') {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped node.exe (PID $processId)"
  } else {
    Write-Host "  Skipped PID $processId (not node.exe)"
  }
}

Write-Host "Done. Run 'npm run dev' again."
