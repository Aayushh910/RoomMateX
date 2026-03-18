from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.utils.email import EmailService
from app.core.config import settings

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@router.post("/send")
def send_contact_form(form_data: ContactFormData):
    """
    Send contact form submission to admin email.
    """
    try:
        # Create HTML email for admin
        admin_email_html = f"""
  <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>New Contact Form Submission - RoomMateX</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr>
    <td align="center">

    <!-- Main Card -->
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">

    <!-- Top Accent Bar -->
    <tr>
    <td style="height:4px; background-color:#111827;"></td>
    </tr>

    <!-- Header -->
    <tr>
    <td style="padding:24px 28px 12px 28px;">
    <h1 style="margin:0; font-size:18px; color:#111827; font-weight:600;">
    New Contact Form Submission
    </h1>
    <p style="margin:6px 0 0 0; font-size:13px; color:#6b7280;">
    RoomMateX Contact Notification
    </p>
    </td>
    </tr>

    <!-- Divider -->
    <tr>
    <td style="padding:0 28px;">
    <hr style="border:none; border-top:1px solid #e5e7eb; margin:10px 0;">
    </td>
    </tr>

    <!-- Body -->
    <tr>
    <td style="padding:16px 28px 24px 28px; font-size:14px; color:#374151;">

    <!-- Contact Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr>
    <td style="padding:6px 0; width:90px; font-weight:600; color:#111827;">Name</td>
    <td style="padding:6px 0;">{form_data.name}</td>
    </tr>
    <tr>
    <td style="padding:6px 0; font-weight:600; color:#111827;">Email</td>
    <td style="padding:6px 0;">
    <a href="mailto:{form_data.email}" style="color:#2563eb; text-decoration:none;">
    {form_data.email}
    </a>
    </td>
    </tr>
    <tr>
    <td style="padding:6px 0; font-weight:600; color:#111827;">Subject</td>
    <td style="padding:6px 0;">{form_data.subject}</td>
    </tr>
    </table>

    <!-- Message Box -->
    <div style="
    background-color:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:6px;
    padding:16px;
    font-size:14px;
    line-height:1.6;
    white-space:pre-wrap;">
    {form_data.message}
    </div>

    <!-- Button -->
    <div style="text-align:center; margin-top:22px;">
    <a href="mailto:{form_data.email}?subject=Re: {form_data.subject}"
    style="
    display:inline-block;
    background-color:#111827;
    color:#ffffff;
    padding:10px 24px;
    border-radius:5px;
    text-decoration:none;
    font-size:13px;
    font-weight:600;">
    Reply to {form_data.name}
    </a>
    </div>

    </td>
    </tr>

    <!-- Footer -->
    <tr>
    <td style="padding:14px 28px; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#9ca3af;">
    © 2026 RoomMateX · Automated Contact Notification
    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
        """

        # Send email to admin with Reply-To header set to user's email
        admin_email = settings.EMAIL_FROM  # Same email used for sending OTPs
        success = EmailService.send_email(
            to_email=admin_email,
            subject=f"New Contact Form: {form_data.subject}",
            html_body=admin_email_html,
            reply_to=form_data.email  # Set Reply-To to user's email
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email. Please try again later."
            )

        return {
            "success": True,
            "message": "Your message has been sent successfully. We'll get back to you soon!"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )
