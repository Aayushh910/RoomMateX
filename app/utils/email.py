import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP."""
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_body: str) -> bool:
        """Send an email using SMTP."""
        # Development mode - just log the email
        if settings.EMAIL_DEV_MODE:
            logger.info("=" * 60)
            logger.info("📧 EMAIL (DEV MODE - Not Actually Sent)")
            logger.info("=" * 60)
            logger.info(f"To: {to_email}")
            logger.info(f"Subject: {subject}")
            logger.info("=" * 60)
            print("\n" + "=" * 60)
            print("📧 EMAIL SENT (DEV MODE)")
            print("=" * 60)
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("=" * 60)
            return True
        
        # Production mode - actually send email
        try:
            # Validate email configuration
            if not settings.EMAIL_USERNAME or not settings.EMAIL_PASSWORD:
                logger.error("Email credentials not configured")
                return False
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = settings.EMAIL_FROM
            message["To"] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_body, "html")
            message.attach(html_part)
            
            # Connect to SMTP server
            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=10) as server:
                server.starttls()
                server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
                server.send_message(message)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed: {e}")
            logger.error("Please check EMAIL_USERNAME and EMAIL_PASSWORD in .env")
            logger.error("For Gmail, you need to use an App Password, not your regular password")
            logger.error("See GMAIL_SETUP_GUIDE.md for instructions")
            return False
            
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error sending email: {e}")
            return False
            
        except Exception as e:
            logger.error(f"Unexpected error sending email: {e}")
            return False
    
    @staticmethod
    def send_otp_email(to_email: str, otp_code: str, user_name: str) -> bool:
        """Send OTP verification email."""
        subject = "Verify Your RoomMateX Account"
        
        # Development mode - show OTP clearly
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🔐" * 30)
            print(f"🔐 OTP CODE FOR {user_name}: {otp_code}")
            print("🔐" * 30 + "\n")
        
        # Create HTML email with actual values
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
        
        # Development mode - show OTP clearly
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🔑" * 30)
            print(f"🔑 PASSWORD RESET OTP FOR {user_name}: {otp_code}")
            print("🔑" * 30 + "\n")
        
        # Create HTML email with actual values
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
        
        # Development mode - show OTP clearly
        if settings.EMAIL_DEV_MODE:
            print("\n" + "🗑️" * 30)
            print(f"🗑️ ACCOUNT DELETE OTP FOR {user_name}: {otp_code}")
            print("🗑️" * 30 + "\n")
        
        # Create HTML email with actual values
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
                        border:2px solid:#dc2626;
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



def send_request_accepted_email(to_email: str, sender_name: str, property_title: str, property_details: dict, owner_details: dict) -> bool:
    """Send email when contact request is accepted with property and owner details."""
    subject = f"Your Request for '{property_title}' Has Been Accepted!"
    
    # Development mode - show details clearly
    if settings.EMAIL_DEV_MODE:
        print("\n" + "✅" * 30)
        print(f"✅ REQUEST ACCEPTED EMAIL FOR {sender_name}")
        print(f"Property: {property_title}")
        print(f"Owner: {owner_details['name']}")
        print(f"Owner Email: {owner_details['email']}")
        print(f"Owner Phone: {owner_details.get('phone', 'Not provided')}")
        print("✅" * 30 + "\n")
    
    # Format amenities
    amenities_html = ""
    if property_details.get('amenities'):
        amenities_list = ", ".join([a.replace('_', ' ').title() for a in property_details['amenities']])
        amenities_html = f"""
        <tr>
            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                <strong style="color:#374151;">Amenities:</strong> {amenities_list}
            </td>
        </tr>
        """
    
    # Create HTML email
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Request Accepted - RoomMateX</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
        <tr>
        <td align="center">

            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

            <!-- Header -->
            <tr>
                <td align="center" style="background-color:#10b981; padding:25px;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">🎉 Great News!</h1>
                <p style="color:#d1fae5; margin:5px 0 0; font-size:14px;">
                    Your Contact Request Has Been Accepted
                </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:35px 30px;">

                <h2 style="margin-top:0; color:#111827;">Hello {sender_name}!</h2>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                    Good news! The property owner has accepted your contact request for:
                </p>

                <!-- Property Details Box -->
                <div style="
                    background-color:#f0fdf4;
                    border-left:4px solid #10b981;
                    padding:20px;
                    margin:20px 0;
                    border-radius:4px;">
                    <h3 style="margin:0 0 15px; color:#065f46; font-size:18px;">
                        📍 {property_title}
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Location:</strong> {property_details['area']}, {property_details['city']}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Type:</strong> {property_details['type'].title()}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Monthly Rent:</strong> ₹{property_details['rent']:,}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Deposit:</strong> ₹{property_details['deposit']:,}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Available From:</strong> {property_details['available_from']}
                            </td>
                        </tr>
                        {amenities_html}
                    </table>
                </div>

                <!-- Owner Contact Details -->
                <div style="
                    background-color:#eff6ff;
                    border-left:4px solid #3b82f6;
                    padding:20px;
                    margin:20px 0;
                    border-radius:4px;">
                    <h3 style="margin:0 0 15px; color:#1e40af; font-size:18px;">
                        👤 Owner Contact Information
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Name:</strong> {owner_details['name']}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Email:</strong> 
                                <a href="mailto:{owner_details['email']}" style="color:#3b82f6; text-decoration:none;">
                                    {owner_details['email']}
                                </a>
                            </td>
                        </tr>
                        {f'''<tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Phone:</strong> 
                                <a href="tel:{owner_details.get('phone', '')}" style="color:#3b82f6; text-decoration:none;">
                                    {owner_details.get('phone', 'Not provided')}
                                </a>
                            </td>
                        </tr>''' if owner_details.get('phone') else ''}
                        {f'''<tr>
                            <td style="padding:8px 0; color:#6b7280; font-size:14px;">
                                <strong style="color:#374151;">Location:</strong> {owner_details.get('city', 'Not specified')}
                            </td>
                        </tr>''' if owner_details.get('city') else ''}
                    </table>
                </div>

                <!-- Next Steps -->
                <div style="
                    background-color:#fef3c7;
                    border-left:4px solid #f59e0b;
                    padding:15px;
                    margin:20px 0;
                    font-size:14px;
                    color:#78350f;">
                    <strong>📝 Next Steps:</strong>
                    <ul style="margin:10px 0; padding-left:20px;">
                        <li style="margin:5px 0;">Contact the owner using the details above</li>
                        <li style="margin:5px 0;">Schedule a property visit</li>
                        <li style="margin:5px 0;">Discuss terms and finalize the agreement</li>
                    </ul>
                </div>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                    We recommend contacting the owner as soon as possible to schedule a visit and discuss further details.
                </p>

                <p style="color:#6b7280; font-size:14px; line-height:1.6; margin-top:20px;">
                    Best of luck with your new home!<br>
                    <strong>The RoomMateX Team</strong>
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
