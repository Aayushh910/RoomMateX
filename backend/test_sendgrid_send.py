#!/usr/bin/env python3
"""
Test SendGrid email sending with detailed error reporting.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

def test_send_email():
    """Test sending an email via SendGrid with detailed logging."""
    
    print("=" * 70)
    print("🧪 SENDGRID EMAIL SEND TEST")
    print("=" * 70)
    print()
    
    # Get config
    api_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("SENDGRID_FROM_EMAIL")
    
    if not api_key or not from_email:
        print("❌ Missing configuration!")
        print(f"   SENDGRID_API_KEY: {'Set' if api_key else 'NOT SET'}")
        print(f"   SENDGRID_FROM_EMAIL: {'Set' if from_email else 'NOT SET'}")
        return False
    
    print(f"From: {from_email}")
    print(f"API Key: {api_key[:10]}...")
    print()
    
    # Get test recipient
    to_email = input("Enter test email address (or press Enter for default): ").strip()
    if not to_email:
        to_email = "aayushsavaliya910@gmail.com"
    
    print(f"To: {to_email}")
    print()
    print("Sending test email...")
    print()
    
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        # Create message
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject="RoomMateX - Test Email",
            html_content="""
            <html>
            <body>
                <h2>Test Email from RoomMateX</h2>
                <p>If you received this, your SendGrid configuration is working!</p>
                <p>Test OTP: <strong>123456</strong></p>
            </body>
            </html>
            """
        )
        
        # Send
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        
        print("=" * 70)
        print("📊 SENDGRID RESPONSE")
        print("=" * 70)
        print(f"Status Code: {response.status_code}")
        print(f"Body: {response.body}")
        print(f"Headers: {response.headers}")
        print("=" * 70)
        print()
        
        if response.status_code == 202:
            print("✅ Email accepted by SendGrid!")
            print()
            print("📧 NEXT STEPS:")
            print("   1. Check inbox: " + to_email)
            print("   2. Check spam folder")
            print("   3. Wait 1-2 minutes for delivery")
            print("   4. Check SendGrid Activity:")
            print("      https://app.sendgrid.com/activity")
            print()
            print("   If still not received, check SendGrid Activity for:")
            print("   - Bounce reasons")
            print("   - Block reasons")
            print("   - Delivery status")
            print()
            return True
        else:
            print(f"⚠️ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print("=" * 70)
        print("❌ ERROR")
        print("=" * 70)
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print()
        
        # Check for common errors
        error_str = str(e).lower()
        
        if "forbidden" in error_str or "403" in error_str:
            print("💡 SOLUTION:")
            print("   Your API key doesn't have permission to send emails.")
            print()
            print("   Fix:")
            print("   1. Go to: https://app.sendgrid.com/settings/api_keys")
            print("   2. Create new API key with 'Full Access'")
            print("   3. Update SENDGRID_API_KEY in .env")
            print()
            
        elif "unauthorized" in error_str or "401" in error_str:
            print("💡 SOLUTION:")
            print("   Your API key is invalid.")
            print()
            print("   Fix:")
            print("   1. Go to: https://app.sendgrid.com/settings/api_keys")
            print("   2. Create new API key")
            print("   3. Update SENDGRID_API_KEY in .env")
            print()
            
        elif "from email" in error_str or "sender" in error_str:
            print("💡 SOLUTION:")
            print("   Your sender email is not verified.")
            print()
            print("   Fix:")
            print("   1. Go to: https://app.sendgrid.com/settings/sender_auth")
            print("   2. Click 'Verify a Single Sender'")
            print("   3. Add: " + from_email)
            print("   4. Check email and verify")
            print()
        
        return False


if __name__ == "__main__":
    print()
    success = test_send_email()
    print()
    
    if success:
        print("🎉 Test completed successfully!")
    else:
        print("⚠️ Test failed. Please fix the issues above.")
    print()
    
    sys.exit(0 if success else 1)
