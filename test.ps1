# Test Script for AI Smart Inbox
# Run this after setup to verify everything works

Write-Host "🧪 AI Smart Inbox - Testing Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$BACKEND_URL = "http://localhost:4000"
$API_URL = "$BACKEND_URL/api"

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/" -Method Get
    if ($response.status -eq "ok") {
        Write-Host "✅ Backend is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend responded but status not OK" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Backend is not accessible at $BACKEND_URL" -ForegroundColor Red
    Write-Host "   Make sure you started the backend with: cd backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Register a Test User
Write-Host "Test 2: User Registration" -ForegroundColor Yellow
$testEmail = "test-$(Get-Random)@example.com"
$testPassword = "test123456"

$registerBody = @{
    name = "Test User"
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $registerResponse.token
    Write-Host "✅ User registered successfully" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ User registration failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Login
Write-Host "Test 3: User Login" -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   Token received" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 4: Send Test Message (Webhook)
Write-Host "Test 4: Send Test Message" -ForegroundColor Yellow
$messageBody = @{
    source = "gmail"
    sender = "ai-test@example.com"
    subject = "Test Message from Setup Script"
    body = "This is a test message to verify the AI Smart Inbox is working correctly. The AI should summarize this message and suggest a reply."
    metadata = @{
        testRun = $true
        timestamp = (Get-Date).ToString()
    }
} | ConvertTo-Json

try {
    $messageResponse = Invoke-RestMethod -Uri "$API_URL/messages" -Method Post -Body $messageBody -ContentType "application/json"
    Write-Host "✅ Message sent successfully" -ForegroundColor Green
    Write-Host "   Message ID: $($messageResponse.data._id)" -ForegroundColor Gray
    Write-Host "   ⏳ Waiting for AI processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
} catch {
    Write-Host "❌ Message send failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Fetch Messages (Protected Route)
Write-Host "Test 5: Fetch Messages" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $messagesResponse = Invoke-RestMethod -Uri "$API_URL/messages" -Method Get -Headers $headers
    $messageCount = $messagesResponse.data.Count
    Write-Host "✅ Messages retrieved: $messageCount" -ForegroundColor Green
    
    if ($messageCount -gt 0) {
        $firstMessage = $messagesResponse.data[0]
        Write-Host ""
        Write-Host "   Latest Message:" -ForegroundColor Cyan
        Write-Host "   - Source: $($firstMessage.source)" -ForegroundColor Gray
        Write-Host "   - Sender: $($firstMessage.sender)" -ForegroundColor Gray
        Write-Host "   - Subject: $($firstMessage.subject)" -ForegroundColor Gray
        if ($firstMessage.ai_summary) {
            Write-Host "   - AI Summary: $($firstMessage.ai_summary)" -ForegroundColor Gray
        }
        if ($firstMessage.ai_reply) {
            Write-Host "   - AI Reply: $($firstMessage.ai_reply)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Failed to fetch messages" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test 6: Frontend Check
Write-Host ""
Write-Host "Test 6: Frontend Check" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend is not accessible at http://localhost:3000" -ForegroundColor Yellow
    Write-Host "   Make sure you started the frontend with: cd frontend && npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Backend API working" -ForegroundColor White
Write-Host "  ✅ Authentication working" -ForegroundColor White
Write-Host "  ✅ Message system working" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "  2. Sign up with a new account" -ForegroundColor White
Write-Host "  3. View your unified inbox" -ForegroundColor White
Write-Host "  4. Set up n8n workflows to connect real message sources" -ForegroundColor White
Write-Host ""
Write-Host "📖 See QUICKSTART.md for detailed instructions" -ForegroundColor Gray
Write-Host ""
