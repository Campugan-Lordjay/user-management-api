$body = @{
    firstName = "Jane"
    lastName = "Smith"
    email = "jane.smith@example.com"
    password = "password456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -Body $body -ContentType "application/json" 