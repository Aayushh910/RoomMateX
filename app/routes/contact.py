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
        <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
            <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">

                <!-- Header -->
                <tr>
                    <td align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:30px;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px;">📬 New Contact Form Submission</h1>
                    <p style="color:#e0e7ff; margin:8px 0 0; font-size:14px;">
                        RoomMateX Contact Form
                    </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:40px 35px;">

                    <h2 style="margin-top:0; color:#111827; font-size:20px;">Contact Details</h2>

                    <!-- Sender Info Box -->
                    <div style="
                        background-color:#f0f9ff;
                        border-left:4px solid #3b82f6;
                        padding:20px;
                        margin:20px 0;
                        border-radius:4px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:8px 0; color:#374151; font-size:15px;">
                                    <strong style="color:#1e40af;">Name:</strong> {form_data.name}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0; color:#374151; font-size:15px;">
                                    <strong style="color:#1e40af;">Email:</strong> 
                                    <a href="mailto:{form_data.email}" style="color:#3b82f6; text-decoration:none;">
                                        {form_data.email}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0; color:#374151; font-size:15px;">
                                    <strong style="color:#1e40af;">Subject:</strong> {form_data.subject}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Message Box -->
                    <div style="margin:25px 0;">
                        <h3 style="color:#111827; font-size:16px; margin-bottom:12px;">Message:</h3>
                        <div style="
                            background-color:#f9fafb;
                            border:1px solid #e5e7eb;
                            padding:20px;
                            border-radius:6px;
                            color:#374151;
                            font-size:15px;
                            line-height:1.6;
                            white-space:pre-wrap;">
{form_data.message}
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align:center; margin:30px 0;">
                        <a href="mailto:{form_data.email}?subject=Re: {form_data.subject}" 
                           style="
                            display:inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color:#ffffff;
                            padding:14px 32px;
                            text-decoration:none;
                            border-radius:6px;
                            font-weight:bold;
                            font-size:15px;">
                            Reply to {form_data.name}
                        </a>
                    </div>

                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">

                    <p style="text-align:center; font-size:12px; color:#9ca3af;">
                        © 2026 RoomMateX. All rights reserved.<br>
                        This is an automated notification from your contact form.
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
