import resend
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via Resend API."""
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_body: str, reply_to: str = None) -> bool:
        """Send an email using Resend API."""
        
        logger.info(f"📧 Email request: To={to_email}, Subject={subject}")
        
        # Development mode - just log
        if settings.EMAIL_DEV_MODE:
            logger.info("=" * 70)
            logger.info("📧 EMAIL (DEV MODE - Not Actually Sent)")
            logger.info("=" * 70)
            logger.info(f"To: {to_email}")
            logger.info(f"Subject: {subject}")
            logger.info("=" * 70)
            print("\n" + "=" * 70)
            print("📧 EMAIL LOGGED (DEV MODE)")
            print("=" * 70)
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("=" * 70 + "\n")
            return True
        
        # Production mode - send via Resend API
        logger.info("🚀 PRODUCTION MODE - Sending via Resend API...")
        
        try:
            if not settings.RESEND_API_KEY:
                logger.error("❌ RESEND_API_KEY not configured")
                return False
            
            resend.api_key = settings.RESEND_API_KEY
            
            params = {
                "from": "RoomMateX <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_body
            }
            
            if reply_to:
                params["reply_to"] = reply_to
            
            email = resend.Emails.send(params)
            
            logger.info(f"✅ Email sent successfully to {to_email}")
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Resend Error: {type(e).__name__}: {e}")
            return False
    
    @staticmethod
    def send_otp_email(to_email: str, otp_code: str, user_name: str) -> bool:
        """Send OTP verification email."""
        subject = "Verify Your RoomMateX Account"
        
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🔐" * 30)
            print(f"🔐 OTP CODE FOR {user_name}: {otp_code}")
            print("🔐" * 30 + "\n")
            logger.info(f"📧 [DEV MODE] OTP for {user_name}: {otp_code}")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>RoomMateX - Email Verification</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
            <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#4f46e5; padding:25px;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">RoomMateX</h1>
                    <p style="color:#e0e7ff; margin:5px 0 0; font-size:14px;">
                        Secure Account Verification
                    </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:35px 30px;">

                    <h2 style="margin-top:0; color:#111827;">Verify Your Email</h2>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        Hello <strong>{user_name}</strong>,
                    </p>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        To complete your verification process, please use the One-Time Password (OTP) below:
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center; margin:30px 0;">
                        <div style="
                        display:inline-block;
                        background-color:#eef2ff;
                        border:2px solid #4f46e5;
                        padding:18px 40px;
                        border-radius:6px;">
                        <span style="
                            font-size:30px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#4f46e5;">
                            {otp_code}
                        </span>
                        </div>
                    </div>

                    <!-- Timer Notice -->
                    <div style="
                        background-color:#fff7ed;
                        border-left:4px solid #f97316;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:14px;
                        color:#7c2d12;">
                        ⏳ This OTP is valid for <strong>5 minutes</strong> only.
                        Please complete verification before it expires.
                    </div>

                    <!-- Security Notice -->
                    <div style="
                        background-color:#fef2f2;
                        border-left:4px solid #ef4444;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:13px;
                        color:#7f1d1d;">
                        🔒 For security reasons, never share this OTP with anyone.
                        RoomMateX will never ask for your OTP via phone or email.
                    </div>

                    <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                        If you did not request this verification, please ignore this email.
                    </p>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

                    <p style="text-align:center; font-size:12px; color:#9ca3af;">
                        © 2026 RoomMateX. All rights reserved.<br>
                        This is an automated message. Please do not reply.
                    </p>

                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
        """
        
        return EmailService.send_email(to_email, subject, html)
    
    @staticmethod
    def send_password_reset_email(to_email: str, otp_code: str, user_name: str) -> bool:
        """Send password reset OTP email."""
        subject = "Reset Your RoomMateX Password"
        
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🔑" * 30)
            print(f"🔑 PASSWORD RESET OTP FOR {user_name}: {otp_code}")
            print("🔑" * 30 + "\n")
            logger.info(f"📧 [DEV MODE] Password reset OTP for {user_name}: {otp_code}")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>RoomMateX - Password Reset</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
            <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#ef4444; padding:25px;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">RoomMateX</h1>
                    <p style="color:#fee2e2; margin:5px 0 0; font-size:14px;">
                        Password Reset Request
                    </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:35px 30px;">

                    <h2 style="margin-top:0; color:#111827;">Reset Your Password</h2>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        Hello <strong>{user_name}</strong>,
                    </p>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        We received a request to reset your RoomMateX account password. Use the OTP below to proceed:
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center; margin:30px 0;">
                        <div style="
                        display:inline-block;
                        background-color:#fef2f2;
                        border:2px solid #ef4444;
                        padding:18px 40px;
                        border-radius:6px;">
                        <span style="
                            font-size:30px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#ef4444;">
                            {otp_code}
                        </span>
                        </div>
                    </div>

                    <!-- Timer Notice -->
                    <div style="
                        background-color:#fff7ed;
                        border-left:4px solid #f97316;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:14px;
                        color:#7c2d12;">
                        ⏳ This OTP is valid for <strong>5 minutes</strong> only.
                    </div>

                    <!-- Security Warning -->
                    <div style="
                        background-color:#fef2f2;
                        border-left:4px solid #ef4444;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:13px;
                        color:#7f1d1d;">
                        ⚠️ <strong>Security Alert:</strong> If you didn't request a password reset, 
                        please ignore this email and ensure your account is secure.
                    </div>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

                    <p style="text-align:center; font-size:12px; color:#9ca3af;">
                        © 2026 RoomMateX. All rights reserved.<br>
                        This is an automated message. Please do not reply.
                    </p>

                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
        """
        
        return EmailService.send_email(to_email, subject, html)

    @staticmethod
    def send_account_delete_email(to_email: str, otp_code: str, user_name: str) -> bool:
        """Send account deletion OTP email."""
        subject = "Delete Your RoomMateX Account"
        
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🗑️" * 30)
            print(f"🗑️ ACCOUNT DELETE OTP FOR {user_name}: {otp_code}")
            print("🗑️" * 30 + "\n")
            logger.info(f"📧 [DEV MODE] Account delete OTP for {user_name}: {otp_code}")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>RoomMateX - Account Deletion</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
            <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#dc2626; padding:25px;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">RoomMateX</h1>
                    <p style="color:#fecaca; margin:5px 0 0; font-size:14px;">
                        Account Deletion Request
                    </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:35px 30px;">

                    <h2 style="margin-top:0; color:#111827;">Delete Your Account</h2>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        Hello <strong>{user_name}</strong>,
                    </p>

                    <p style="color:#374151; font-size:15px; line-height:1.6;">
                        We received a request to permanently delete your RoomMateX account. Use the OTP below to confirm:
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center; margin:30px 0;">
                        <div style="
                        display:inline-block;
                        background-color:#fee2e2;
                        border:2px solid #dc2626;
                        padding:18px 40px;
                        border-radius:6px;">
                        <span style="
                            font-size:30px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#dc2626;">
                            {otp_code}
                        </span>
                        </div>
                    </div>

                    <!-- Timer Notice -->
                    <div style="
                        background-color:#fff7ed;
                        border-left:4px solid #f97316;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:14px;
                        color:#7c2d12;">
                        ⏳ This OTP is valid for <strong>5 minutes</strong> only.
                    </div>

                    <!-- Warning -->
                    <div style="
                        background-color:#fef2f2;
                        border-left:4px solid #dc2626;
                        padding:12px 15px;
                        margin:20px 0;
                        font-size:13px;
                        color:#7f1d1d;">
                        ⚠️ <strong>Warning:</strong> This action is permanent and cannot be undone. 
                        All your data including properties, reviews, and wishlist will be deleted.
                    </div>

                    <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                        If you did not request account deletion, please ignore this email and ensure your account is secure.
                    </p>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

                    <p style="text-align:center; font-size:12px; color:#9ca3af;">
                        © 2026 RoomMateX. All rights reserved.<br>
                        This is an automated message. Please do not reply.
                    </p>

                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
        """
        
        return EmailService.send_email(to_email, subject, html)