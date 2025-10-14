"""
Email Service Module for Focused Room Website

This module provides email functionality for newsletter subscriptions,
confirmations, and other automated emails using SendGrid with fallback options.
"""

import logging
import os
from typing import Any

# Configure logging
logger = logging.getLogger(__name__)


class EmailService:
    """
    Email service class that handles sending emails via multiple providers.

    Supports:
    - SendGrid (primary)
    - SMTP fallback
    - Console logging (development)
    """

    def __init__(self):
        """Initialize email service with configuration from environment."""
        self.sendgrid_api_key = os.environ.get("SENDGRID_API_KEY")
        self.mail_server = os.environ.get("MAIL_SERVER")
        self.mail_port = os.environ.get("MAIL_PORT")
        self.mail_username = os.environ.get("MAIL_USERNAME")
        self.mail_password = os.environ.get("MAIL_PASSWORD")
        self.mail_sender = os.environ.get("MAIL_DEFAULT_SENDER", "noreply@focusedroom.com")

        # Determine email provider
        self.provider = self._determine_provider()
        logger.info(f"Email service initialized with provider: {self.provider}")

    def _determine_provider(self) -> str:
        """Determine which email provider to use based on available credentials."""
        if self.sendgrid_api_key:
            return "sendgrid"
        elif all([self.mail_server, self.mail_port, self.mail_username, self.mail_password]):
            return "smtp"
        else:
            return "console"

    def send_subscription_confirmation(self, email: str) -> dict[str, Any]:
        """
        Send subscription confirmation email.

        Args:
            email: Recipient email address

        Returns:
            Dict with success status and details
        """
        subject = "Welcome to Focused Room Newsletter! 🎯"
        html_content = self._get_subscription_email_html()
        text_content = self._get_subscription_email_text()

        return self._send_email(
            to_email=email, subject=subject, html_content=html_content, text_content=text_content
        )

    def send_big_five_results(self, email: str, results: dict[str, Any]) -> dict[str, Any]:
        """
        Send Big Five personality test results via email.

        Args:
            email: Recipient email address
            results: Dictionary containing test results

        Returns:
            Dict with success status and details
        """
        subject = "Your Big Five Personality Results - Focused Room 🧠"
        html_content = self._get_big_five_email_html(results)
        text_content = self._get_big_five_email_text(results)

        return self._send_email(
            to_email=email, subject=subject, html_content=html_content, text_content=text_content
        )

    def send_big_five_report_with_pdf(
        self,
        email: str,
        results: dict[str, Any],
        pdf_bytes: bytes,
        pdf_filename: str = "personality_report.pdf",
    ) -> dict[str, Any]:
        """
        Send Big Five personality test results via email with PDF attachment.

        This is the PRODUCTION METHOD for delivering comprehensive personality reports.
        It includes both an HTML email preview and a professional PDF attachment.

        Args:
            email: Recipient email address
            results: Dictionary containing test results
            pdf_bytes: PDF file as bytes
            pdf_filename: Name for the PDF attachment (default: personality_report.pdf)

        Returns:
            Dict with success status and details

        Example:
            >>> from app.utils.report_generator import generate_bigfive_report_pdf
            >>> pdf_bytes = generate_bigfive_report_pdf(...)
            >>> email_service.send_big_five_report_with_pdf(
            ...     email="user@example.com",
            ...     results={...},
            ...     pdf_bytes=pdf_bytes
            ... )
        """
        subject = "🧠 Your Complete Big Five Personality Report - Focused Room"
        html_content = self._get_big_five_pdf_email_html(results)
        text_content = self._get_big_five_pdf_email_text(results)

        return self._send_email_with_attachment(
            to_email=email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            attachment_bytes=pdf_bytes,
            attachment_filename=pdf_filename,
            attachment_type="application/pdf",
        )

    def _send_email(
        self, to_email: str, subject: str, html_content: str, text_content: str
    ) -> dict[str, Any]:
        """
        Send email using the configured provider.

        Args:
            to_email: Recipient email address
            subject: Email subject line
            html_content: HTML email content
            text_content: Plain text email content

        Returns:
            Dict with success status and details
        """
        try:
            if self.provider == "sendgrid":
                return self._send_via_sendgrid(to_email, subject, html_content, text_content)
            elif self.provider == "smtp":
                return self._send_via_smtp(to_email, subject, html_content, text_content)
            else:
                return self._send_via_console(to_email, subject, html_content, text_content)

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return {"success": False, "error": str(e), "provider": self.provider}

    def _send_via_sendgrid(
        self, to_email: str, subject: str, html_content: str, text_content: str
    ) -> dict[str, Any]:
        """Send email via SendGrid API."""
        try:
            import sendgrid
            from sendgrid.helpers.mail import Content, Email, Mail, To

            sg = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)

            from_email = Email(self.mail_sender)
            to_email_obj = To(to_email)

            # Create mail object
            mail = Mail(
                from_email=from_email,
                to_emails=to_email_obj,
                subject=subject,
                plain_text_content=text_content,
                html_content=html_content,
            )

            # Send email
            response = sg.send(mail)

            logger.info(f"Email sent via SendGrid to {to_email}, status: {response.status_code}")

            return {
                "success": True,
                "provider": "sendgrid",
                "status_code": response.status_code,
                "message_id": response.headers.get("X-Message-Id"),
            }

        except ImportError:
            logger.error("SendGrid library not installed. Install with: pip install sendgrid")
            return {
                "success": False,
                "error": "SendGrid library not installed",
                "provider": "sendgrid",
            }
        except Exception as e:
            logger.error(f"SendGrid error: {str(e)}")
            return {"success": False, "error": str(e), "provider": "sendgrid"}

    def _send_via_smtp(
        self, to_email: str, subject: str, html_content: str, text_content: str
    ) -> dict[str, Any]:
        """Send email via SMTP."""
        try:
            import smtplib
            from email.mime.multipart import MIMEMultipart
            from email.mime.text import MIMEText

            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.mail_sender
            msg["To"] = to_email

            # Add text and HTML parts
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")

            msg.attach(text_part)
            msg.attach(html_part)

            # Send email
            with smtplib.SMTP(self.mail_server, int(self.mail_port)) as server:
                server.starttls()
                server.login(self.mail_username, self.mail_password)
                server.send_message(msg)

            logger.info(f"Email sent via SMTP to {to_email}")

            return {"success": True, "provider": "smtp", "message": "Email sent successfully"}

        except Exception as e:
            logger.error(f"SMTP error: {str(e)}")
            return {"success": False, "error": str(e), "provider": "smtp"}

    def _send_via_console(
        self, to_email: str, subject: str, html_content: str, text_content: str
    ) -> dict[str, Any]:
        """Log email to console (development mode)."""
        logger.info("=" * 50)
        logger.info(f"EMAIL WOULD BE SENT TO: {to_email}")
        logger.info(f"SUBJECT: {subject}")
        logger.info("CONTENT:")
        logger.info(text_content)
        logger.info("=" * 50)

        # Also print to console for development
        print(f"\n📧 EMAIL TO: {to_email}")
        print(f"📝 SUBJECT: {subject}")
        print(f"📄 CONTENT: {text_content[:200]}...")

        return {
            "success": True,
            "provider": "console",
            "message": "Email logged to console (development mode)",
        }

    def _get_subscription_email_html(self) -> str:
        """Generate HTML content for subscription confirmation email."""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to Focused Room</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .button { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Welcome to Focused Room!</h1>
                </div>
                <div class="content">
                    <h2>Thank you for subscribing!</h2>
                    <p>You're now part of the Focused Room community, where productivity meets personality.</p>

                    <h3>What's next?</h3>
                    <ul>
                        <li><strong>Chrome Extension:</strong> Block distractions and stay focused</li>
                        <li><strong>Big Five Test:</strong> Discover your personality type</li>
                        <li><strong>Productivity Tips:</strong> Weekly insights and strategies</li>
                        <li><strong>Early Access:</strong> Be first to try new features</li>
                    </ul>

                    <p style="text-align: center; margin: 30px 0;">
                        <a href="https://focusedroom.com" class="button">Visit Focused Room</a>
                    </p>

                    <p><small>We'll email you this ebook and occasional updates; unsubscribe any time.</small></p>
                </div>
                <div class="footer">
                    <p>Focused Room - Privacy-first productivity tools</p>
                    <p>If you didn't subscribe, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_subscription_email_text(self) -> str:
        """Generate plain text content for subscription confirmation email."""
        return """
        Welcome to Focused Room! 🎯

        Thank you for subscribing to our newsletter!

        You're now part of the Focused Room community, where productivity meets personality.

        What's next?
        - Chrome Extension: Block distractions and stay focused
        - Big Five Test: Discover your personality type
        - Productivity Tips: Weekly insights and strategies
        - Early Access: Be first to try new features

        Visit us at: https://focusedroom.com

        We'll email you this ebook and occasional updates; unsubscribe any time.

        ---
        Focused Room - Privacy-first productivity tools
        If you didn't subscribe, you can safely ignore this email.
        """

    def _get_big_five_email_html(self, results: dict[str, Any]) -> str:
        """Generate HTML content for Big Five results email."""
        scores = results.get("scores", {})

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Your Big Five Results</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2c3e50; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
                .trait {{ margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }}
                .trait-name {{ font-weight: bold; text-transform: capitalize; }}
                .score {{ color: #3498db; font-size: 18px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧠 Your Big Five Results</h1>
                </div>
                <div class="content">
                    <h2>Personality Profile</h2>
                    <p>Here are your Big Five personality trait scores:</p>

                    <div class="trait">
                        <div class="trait-name">Openness: <span class="score">{scores.get('openness', 0):.1f}/100</span></div>
                    </div>
                    <div class="trait">
                        <div class="trait-name">Conscientiousness: <span class="score">{scores.get('conscientiousness', 0):.1f}/100</span></div>
                    </div>
                    <div class="trait">
                        <div class="trait-name">Extraversion: <span class="score">{scores.get('extraversion', 0):.1f}/100</span></div>
                    </div>
                    <div class="trait">
                        <div class="trait-name">Agreeableness: <span class="score">{scores.get('agreeableness', 0):.1f}/100</span></div>
                    </div>
                    <div class="trait">
                        <div class="trait-name">Neuroticism: <span class="score">{scores.get('neuroticism', 0):.1f}/100</span></div>
                    </div>

                    <p>Visit <a href="https://focusedroom.com">Focused Room</a> for more personality insights and productivity tools.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_big_five_email_text(self, results: dict[str, Any]) -> str:
        """Generate plain text content for Big Five results email."""
        scores = results.get("scores", {})

        return f"""
        Your Big Five Personality Results 🧠

        Here are your personality trait scores:

        Openness: {scores.get('openness', 0):.1f}/100
        Conscientiousness: {scores.get('conscientiousness', 0):.1f}/100
        Extraversion: {scores.get('extraversion', 0):.1f}/100
        Agreeableness: {scores.get('agreeableness', 0):.1f}/100
        Neuroticism: {scores.get('neuroticism', 0):.1f}/100

        Visit https://focusedroom.com for more personality insights and productivity tools.
        """

    def _send_email_with_attachment(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        attachment_bytes: bytes,
        attachment_filename: str,
        attachment_type: str = "application/pdf",
    ) -> dict[str, Any]:
        """
        Send email with attachment using the configured provider.

        Currently only supports SendGrid (SMTP attachment support can be added later).
        """
        try:
            if self.provider == "sendgrid":
                return self._send_via_sendgrid_with_attachment(
                    to_email,
                    subject,
                    html_content,
                    text_content,
                    attachment_bytes,
                    attachment_filename,
                    attachment_type,
                )
            else:
                logger.warning(
                    f"Attachments not supported for provider: {self.provider}. Sending without attachment."
                )
                return self._send_email(to_email, subject, html_content, text_content)

        except Exception as e:
            logger.error(f"Failed to send email with attachment to {to_email}: {str(e)}")
            return {"success": False, "error": str(e), "provider": self.provider}

    def _send_via_sendgrid_with_attachment(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        attachment_bytes: bytes,
        attachment_filename: str,
        attachment_type: str,
    ) -> dict[str, Any]:
        """Send email with attachment via SendGrid API."""
        try:
            import base64

            import sendgrid
            from sendgrid.helpers.mail import (
                Attachment,
                Email,
                FileContent,
                FileName,
                FileType,
                Mail,
                To,
            )

            sg = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)

            from_email = Email(self.mail_sender)
            to_email_obj = To(to_email)

            # Create mail object
            mail = Mail(
                from_email=from_email,
                to_emails=to_email_obj,
                subject=subject,
                plain_text_content=text_content,
                html_content=html_content,
            )

            # Add attachment
            encoded_file = base64.b64encode(attachment_bytes).decode()
            attached_file = Attachment(
                FileContent(encoded_file),
                FileName(attachment_filename),
                FileType(attachment_type),
            )
            mail.attachment = attached_file

            # Send email
            response = sg.send(mail)

            logger.info(
                f"Email with attachment sent via SendGrid to {to_email}, status: {response.status_code}"
            )

            return {
                "success": True,
                "provider": "sendgrid",
                "status_code": response.status_code,
                "message_id": response.headers.get("X-Message-Id"),
            }

        except Exception as e:
            logger.error(f"SendGrid attachment error: {str(e)}")
            return {"success": False, "error": str(e), "provider": "sendgrid"}

    def _convert_markdown_to_html(self, markdown_text: str) -> str:
        """
        Convert markdown text to formatted HTML for email.

        Handles common markdown elements:
        - Headers (##, ###)
        - Bold (**text**)
        - Lists (- item)
        - Quotes
        - Emoji preservation
        """
        if not markdown_text:
            return ""

        import re

        # Split into lines for processing
        lines = markdown_text.split("\n")
        html_lines = []
        in_list = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Skip completely empty lines
            if not stripped:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                continue

            # Headers - strip ALL leading # and whitespace
            if stripped.startswith("###"):
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                # Remove all # characters and strip
                text = re.sub(r"^#+\s*", "", stripped)
                # Convert bold
                text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
                html_lines.append(f"<h3>{text}</h3>")
            elif stripped.startswith("##"):
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                # Remove all # characters and strip
                text = re.sub(r"^#+\s*", "", stripped)
                # Convert bold
                text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
                html_lines.append(f"<h2>{text}</h2>")
            elif stripped.startswith("#"):
                # Handle single # as well
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                text = re.sub(r"^#+\s*", "", stripped)
                text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
                html_lines.append(f"<h2>{text}</h2>")
            # List items
            elif stripped.startswith("- ") or stripped.startswith("* "):
                if not in_list:
                    html_lines.append("<ul>")
                    in_list = True
                # Get list item text
                text = stripped[2:].strip()
                # Convert bold
                text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
                html_lines.append(f"<li>{text}</li>")
            # Regular paragraphs
            else:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                # Convert bold
                text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", stripped)
                html_lines.append(f"<p>{text}</p>")

        # Close any open list
        if in_list:
            html_lines.append("</ul>")

        return "\n".join(html_lines)

    def send_welcome_vision_email(self, email: str, user_name: str = "") -> dict[str, Any]:
        """
        Send welcome + vision email from founder.

        Args:
            email: Recipient email address
            user_name: User's first name (optional)

        Returns:
            Dict with success status and details
        """
        subject = "🎯 Welcome to Focused Room - Your Journey to Deep Focus Starts Here"
        html_content = self._get_welcome_vision_email_html(user_name)
        text_content = self._get_welcome_vision_email_text(user_name)

        return self._send_email(
            to_email=email, subject=subject, html_content=html_content, text_content=text_content
        )

    def send_big_five_report_email(
        self, email: str, user_name: str, markdown_report: str, scores: dict[str, float]
    ) -> dict[str, Any]:
        """
        Send Big Five personality report via email (markdown formatted as HTML).

        Args:
            email: Recipient email address
            user_name: User's first name
            markdown_report: Full markdown report from database
            scores: Dictionary of trait scores

        Returns:
            Dict with success status and details
        """
        subject = f"🧠 {user_name}, Your Personalized Big Five Personality Report"
        html_content = self._get_big_five_report_email_html(user_name, markdown_report, scores)
        text_content = self._get_big_five_report_email_text(user_name, markdown_report)

        return self._send_email(
            to_email=email, subject=subject, html_content=html_content, text_content=text_content
        )

    def _get_big_five_pdf_email_html(self, results: dict[str, Any]) -> str:
        """
        Generate HTML content for Big Five PDF email.
        (Placeholder for PDF attachment functionality)
        """
        return self._get_big_five_email_html(results)

    def _get_big_five_pdf_email_text(self, results: dict[str, Any]) -> str:
        """
        Generate plain text content for Big Five PDF email.
        (Placeholder for PDF attachment functionality)
        """
        return self._get_big_five_email_text(results)

    def _get_welcome_vision_email_html(self, user_name: str = "") -> str:
        """Generate HTML content for welcome + vision email from founder."""
        greeting = f"{user_name}" if user_name else "friend"

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Focused Room</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #2d3748;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #FAF9F5;
                }}
                .container {{
                    background: white;
                    margin: 20px auto;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(15, 23, 36, 0.08);
                }}
                .header {{
                    background: linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%);
                    color: white;
                    padding: 45px 35px;
                    text-align: center;
                    position: relative;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }}
                .header p {{
                    margin: 15px 0 0 0;
                    font-size: 18px;
                    opacity: 0.95;
                    font-weight: 500;
                }}
                .content {{
                    padding: 40px 35px;
                }}
                .content p {{
                    font-size: 16px;
                    line-height: 1.8;
                    margin-bottom: 18px;
                    color: #4a5568;
                }}
                .welcome-badge {{
                    background: linear-gradient(135deg, rgba(122, 158, 159, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%);
                    border: 2px solid #7A9E9F;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                    text-align: center;
                }}
                .welcome-badge h2 {{
                    margin: 0 0 10px 0;
                    color: #7A9E9F;
                    font-size: 24px;
                }}
                .welcome-badge p {{
                    margin: 0;
                    font-size: 17px;
                    color: #2d3748;
                    line-height: 1.7;
                }}
                .pillar-box {{
                    background: #f9f9f9;
                    border-radius: 12px;
                    border-left: 4px solid #7A9E9F;
                    padding: 25px;
                    margin: 25px 0;
                }}
                .pillar-box h3 {{
                    margin: 0 0 15px 0;
                    color: #7A9E9F;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }}
                .pillar-number {{
                    background: #7A9E9F;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                }}
                .pillar-box p {{
                    margin: 0;
                    color: #4a5568;
                }}
                .cta-button {{
                    display: inline-block;
                    padding: 16px 32px;
                    background: #7A9E9F;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 15px 0;
                    text-align: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(122, 158, 159, 0.25);
                }}
                .cta-button:hover {{
                    background: #6B8B8C;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(122, 158, 159, 0.3);
                }}
                .stats-box {{
                    background: linear-gradient(135deg, rgba(229, 62, 62, 0.05) 0%, rgba(229, 62, 62, 0.08) 100%);
                    border: 2px solid rgba(229, 62, 62, 0.2);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                }}
                .stats-box h3 {{
                    margin: 0 0 15px 0;
                    color: #e53e3e;
                    font-size: 20px;
                }}
                .footer {{
                    text-align: center;
                    padding: 30px;
                    background: #FAF9F5;
                    font-size: 14px;
                    color: #718096;
                }}
                .signature {{
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid #E2E8F0;
                    color: #4a5568;
                }}
                .signature strong {{
                    color: #2d3748;
                }}
                .emoji {{
                    font-size: 24px;
                    display: inline-block;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Welcome to Focused Room, {greeting}!</h1>
                    <p>You just took the first step toward reclaiming your attention</p>
                </div>

                <div class="content">
                    <div class="welcome-badge">
                        <h2>✨ This is Your Moment</h2>
                        <p>You're not here by accident. You're here because you know there's more to life than endless scrolling. <strong>You're ready to build something extraordinary.</strong></p>
                    </div>

                    <p>Hi {greeting},</p>

                    <p>I'm <strong>Souvik</strong>, and I built Focused Room because I was drowning in the same digital chaos you're fighting.</p>

                    <p>Brilliant ideas, big dreams, genuine potential—but <strong>hemorrhaging my attention</strong> to infinite scroll, notification pings, and the dopamine slot machine of social media.</p>

                    <div class="stats-box">
                        <h3>⚠️ The Attention War (And Why You're Losing)</h3>
                        <p><strong>Here's what you're up against:</strong></p>
                        <p>• Social media companies employ <strong>teams of PhDs</strong> in psychology and neuroscience<br>
                        • They invest <strong>hundreds of billions of dollars</strong> in behavioral manipulation<br>
                        • Their goal: Keep you scrolling, clicking, watching—forever<br>
                        • Your goal: Build a meaningful life</p>
                        <p style="margin-top: 15px;"><strong>It's not a fair fight. Until now.</strong></p>
                    </div>

                    <h2 style="color: #7A9E9F; margin: 35px 0 20px 0;">🌟 The Focused Room Ecosystem</h2>
                    <p>You didn't just sign up for a tool. You joined a <strong>complete system</strong> built to help you develop focus, discipline, and deep work—one intentional step at a time.</p>

                    <div class="pillar-box">
                        <h3><span class="pillar-number">1</span> Understand Your Brain</h3>
                        <p><strong>The Big Five Personality Test (8 minutes)</strong> reveals how YOUR brain is wired for focus, productivity, and growth. No generic advice—personalized strategies based on your unique personality.</p>
                        <p style="margin-top: 15px; color: #4a5568;"><strong>Why this matters:</strong> Most productivity advice fails because it ignores how YOUR brain works. Understanding your personality is the foundation of sustainable focus.</p>
                        <p style="margin-top: 12px;">
                            <a href="https://focusedroom.com/big-five" class="cta-button">
                                Take Your Test Now (Free) →
                            </a>
                        </p>
                    </div>

                    <div class="pillar-box">
                        <h3><span class="pillar-number">2</span> Protect Your Attention</h3>
                        <p><strong>Chrome Extension + Mobile Apps (coming soon)</strong> block distractions across ALL your devices. We maintain <strong>one of the world's largest blocklists</strong>—covering social media, news, entertainment, shopping, and adult content (protecting children and adults from addiction).</p>
                        <p style="margin-top: 15px; color: #4a5568;"><strong>The science:</strong> Hundreds of billions of dollars are spent engineering platforms to hijack your attention. We fight back with cognitive behavioral psychology—making distractions just annoying enough that you think twice.</p>
                        <p style="margin-top: 12px;">
                            <a href="https://chromewebstore.google.com/detail/focused-room" class="cta-button">
                                Install Extension (2 minutes) →
                            </a>
                        </p>
                    </div>

                    <div class="pillar-box">
                        <h3><span class="pillar-number">3</span> Build Your Practice</h3>
                        <p><strong>"The Focus Formula"</strong> weekly newsletter delivers science-backed strategies for deep work. No information overload—one focused lesson every Sunday, personalized to YOUR personality type.</p>
                        <p style="margin-top: 15px; color: #38a169; font-weight: 600;">✅ You're already subscribed!</p>
                        <p style="margin-top: 12px; color: #4a5568;"><strong>First issue this Sunday:</strong> "The Science of Deep Work" — the neuroscience of attention and why most people fail at focus.</p>
                    </div>

                    <div class="welcome-badge" style="margin-top: 35px;">
                        <h2>💪 Remember This</h2>
                        <p>Every hour you invest in deep focus today <strong>compounds into a better future tomorrow</strong>. Your focused self is your future self.</p>
                        <p style="margin-top: 15px;">You're not lazy. You're not broken. <strong>You're fighting a rigged game.</strong></p>
                        <p style="margin-top: 10px;"><strong>Now you have the tools to win.</strong></p>
                    </div>

                    <div class="signature">
                        <p>With deep respect for your potential,</p>
                        <p><strong>Souvik Ganguly</strong><br>
                        Founder, Focused Room<br>
                        <a href="mailto:founder@focusedroom.com" style="color: #7A9E9F; text-decoration: none;">founder@focusedroom.com</a></p>

                        <p style="font-size: 14px; color: #718096; margin-top: 25px;">
                            P.S. Reply to this email anytime. I read every message personally. I'd love to hear what brought you to Focused Room—and what you're building with your reclaimed attention.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p style="font-weight: 600; color: #2d3748;">Focused Room</p>
                    <p>Backed by cognitive behavioral psychology | Privacy-first | Community-driven</p>
                    <p style="font-size: 12px; color: #9aa6b2; margin-top: 15px;">
                        You received this because you subscribed to The Focus Formula Newsletter<br>
                        <a href="https://focusedroom.com/unsubscribe" style="color: #7A9E9F;">Unsubscribe</a> |
                        <a href="https://focusedroom.com/privacy" style="color: #7A9E9F;">Privacy</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_welcome_vision_email_text(self, user_name: str = "") -> str:
        """Generate plain text content for welcome + vision email."""
        greeting = f"{user_name}" if user_name else "friend"

        return f"""
==============================================================================
WELCOME TO FOCUSED ROOM, {greeting.upper()}!
You just took the first step toward reclaiming your attention
==============================================================================

THIS IS YOUR MOMENT

You're not here by accident. You're here because you know there's more to life
than endless scrolling. You're ready to build something extraordinary.

Hi {greeting},

I'm Souvik, and I built Focused Room because I was drowning in the same digital
chaos you're fighting.

Brilliant ideas, big dreams, genuine potential—but hemorrhaging my attention to
infinite scroll, notification pings, and the dopamine slot machine of social media.

------------------------------------------------------------------------------
THE ATTENTION WAR (And Why You're Losing)
------------------------------------------------------------------------------

Here's what you're up against:

• Social media companies employ teams of PhDs in psychology and neuroscience
• They invest hundreds of billions of dollars in behavioral manipulation
• Their goal: Keep you scrolling, clicking, watching—forever
• Your goal: Build a meaningful life

It's not a fair fight. Until now.

==============================================================================
THE FOCUSED ROOM ECOSYSTEM
==============================================================================

You didn't just sign up for a tool. You joined a complete system built to help
you develop focus, discipline, and deep work—one intentional step at a time.

PILLAR 1: UNDERSTAND YOURSELF

The Big Five Personality Test reveals how YOUR brain is wired for focus,
productivity, and growth. No generic advice—strategies customized to your unique
personality.

→ Take the test (8 minutes): https://focusedroom.com/big-five

PILLAR 2: PROTECT YOUR FOCUS

Our Chrome Extension + Mobile Apps (coming soon) block distractions across ALL
your devices. We maintain one of the largest blocklists—social media, news,
entertainment, shopping, adult content—protecting you from the attention hijackers.

→ Install Chrome Extension (Free):
  https://chromewebstore.google.com/detail/focused-room

PILLAR 3: GROW ONE STEP AT A TIME

"The Focus Formula" weekly newsletter delivers science-backed strategies for
building deep work habits. No information overload—one focused lesson per week,
personalized to YOUR personality.

✅ You're already subscribed!

------------------------------------------------------------------------------
YOUR NEXT STEPS (Start Today)
------------------------------------------------------------------------------

1. Take the Big Five Test (8 minutes)
   Discover how your personality shapes your productivity. Get your personalized
   report with strategies that actually work for YOU.

2. Install the Chrome Extension (2 minutes)
   Start blocking distractions on your laptop/desktop today. We've curated
   blocklists for the most addictive sites—you just click "Enable."

3. Read Your First Article
   Check your inbox this Sunday for "The Science of Deep Work" — the foundation
   of everything we do.

==============================================================================
REMEMBER THIS
==============================================================================

Every hour you invest in deep focus today compounds into a better future tomorrow.
Your focused self is your future self.

You're not lazy. You're not broken. You're fighting a rigged game.

Now you have the tools to win.

------------------------------------------------------------------------------

With deep respect for your potential,

Souvik Ganguly
Founder, Focused Room
founder@focusedroom.com

P.S. Reply to this email anytime. I read every message personally. I'd love to
hear what brought you to Focused Room—and what you're building with your reclaimed
attention.

==============================================================================
Focused Room
Backed by cognitive behavioral psychology | Privacy-first | Community-driven

You received this because you subscribed to The Focus Formula Newsletter
Unsubscribe: https://focusedroom.com/unsubscribe
Privacy: https://focusedroom.com/privacy
==============================================================================
        """

    def _get_big_five_report_email_html(
        self, user_name: str, markdown_report: str, scores: dict[str, float]
    ) -> str:
        """Generate HTML content for Big Five report email."""
        # Extract just the quote from the markdown report (if exists)
        quote = ""
        if "## QUOTE" in markdown_report:
            quote_section = markdown_report.split("## QUOTE")[1].split("##")[0].strip()
            quote = quote_section.replace('"', "").strip()

        # Convert markdown to HTML (clean version without ##)
        clean_markdown = markdown_report.replace("## QUOTE", "").strip()
        report_html = self._convert_markdown_to_html(clean_markdown)

        # Create score bars with brand colors
        trait_colors = {
            "openness": "#7A9E9F",
            "conscientiousness": "#38a169",
            "extraversion": "#667eea",
            "agreeableness": "#4facfe",
            "neuroticism": "#e53e3e",
        }

        trait_emoji = {
            "openness": "🎨",
            "conscientiousness": "✅",
            "extraversion": "⚡",
            "agreeableness": "🤝",
            "neuroticism": "🧘",
        }

        score_bars = ""
        for trait, score in scores.items():
            color = trait_colors.get(trait.lower(), "#7A9E9F")
            emoji = trait_emoji.get(trait.lower(), "📊")
            trait_name = trait.replace("_", " ").title()
            score_bars += f"""
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; font-size: 16px; color: #2d3748;">
                        {emoji} {trait_name}
                    </span>
                    <span style="font-weight: 700; color: {color}; font-size: 20px;">{score:.0f}/100</span>
                </div>
                <div style="background: #E2E8F0; height: 16px; border-radius: 8px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
                    <div style="background: linear-gradient(90deg, {color} 0%, {color} 100%); width: {score}%; height: 100%; border-radius: 8px; transition: width 0.3s ease;"></div>
                </div>
            </div>
            """

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Big Five Personality Report</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #2d3748;
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #FAF9F5;
                }}
                .container {{
                    background: white;
                    margin: 20px auto;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(15, 23, 36, 0.08);
                }}
                .header {{
                    background: linear-gradient(135deg, #7A9E9F 0%, #6B8B8C 100%);
                    color: white;
                    padding: 45px 35px;
                    text-align: center;
                    position: relative;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }}
                .header p {{
                    margin: 15px 0 0 0;
                    font-size: 18px;
                    opacity: 0.95;
                    font-weight: 500;
                }}
                .content {{
                    padding: 40px 35px;
                }}
                .scores-box {{
                    background: linear-gradient(135deg, rgba(122, 158, 159, 0.08) 0%, rgba(56, 161, 105, 0.08) 100%);
                    border-radius: 12px;
                    border: 2px solid #7A9E9F;
                    padding: 30px;
                    margin: 30px 0;
                }}
                .scores-box h2 {{
                    margin: 0 0 25px 0;
                    color: #7A9E9F;
                    font-size: 24px;
                    text-align: center;
                }}
                .celebration-box {{
                    background: linear-gradient(135deg, rgba(122, 158, 159, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%);
                    border: 2px solid #7A9E9F;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                    text-align: center;
                }}
                .celebration-box h2 {{
                    margin: 0 0 10px 0;
                    color: #7A9E9F;
                    font-size: 24px;
                }}
                .celebration-box p {{
                    margin: 0;
                    font-size: 17px;
                    color: #2d3748;
                    line-height: 1.7;
                }}
                .report-content {{
                    margin-top: 30px;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #4a5568;
                }}
                .report-content h2 {{
                    color: #7A9E9F;
                    font-size: 22px;
                    margin-top: 35px;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #7A9E9F;
                    padding-bottom: 8px;
                }}
                .report-content h3 {{
                    color: #38a169;
                    font-size: 18px;
                    margin-top: 25px;
                    margin-bottom: 12px;
                }}
                .report-content p {{
                    margin-bottom: 15px;
                }}
                .report-content ul {{
                    margin: 15px 0;
                    padding-left: 25px;
                }}
                .report-content li {{
                    margin-bottom: 8px;
                }}
                .report-content strong {{
                    color: #2d3748;
                    font-weight: 600;
                }}
                .quote-box {{
                    background: linear-gradient(135deg, rgba(122, 158, 159, 0.05) 0%, rgba(56, 161, 105, 0.05) 100%);
                    border-left: 4px solid #7A9E9F;
                    padding: 20px 25px;
                    margin: 25px 0;
                    font-style: italic;
                    color: #4a5568;
                    font-size: 16px;
                    line-height: 1.7;
                }}
                .cta-button {{
                    display: inline-block;
                    padding: 16px 32px;
                    background: #7A9E9F;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 15px 0;
                    text-align: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(122, 158, 159, 0.25);
                }}
                .cta-button:hover {{
                    background: #6B8B8C;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(122, 158, 159, 0.3);
                }}
                .footer {{
                    text-align: center;
                    padding: 30px;
                    background: #FAF9F5;
                    font-size: 14px;
                    color: #718096;
                }}
                .signature {{
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid #E2E8F0;
                    color: #4a5568;
                }}
                .signature strong {{
                    color: #2d3748;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧠 Your Personality Blueprint</h1>
                    <p>{user_name}, this is your unique roadmap to peak productivity</p>
                </div>

                <div class="content">
                    <div class="celebration-box">
                        <h2>🎉 You Did It!</h2>
                        <p>Most people never understand WHY they struggle with focus. <strong>You just unlocked your personalized operating manual.</strong></p>
                    </div>

                    {f'<div class="quote-box">"{quote}"</div>' if quote else ''}

                    <div class="scores-box">
                        <h2>📊 Your Big Five Personality Traits</h2>
                        <p style="text-align: center; margin: 0 0 20px 0; color: #4a5568;">These scores reveal how YOUR brain works best</p>
                        {score_bars}
                    </div>

                    <p style="font-size: 17px; font-weight: 600; color: #2d3748; margin-top: 35px;">Hey {user_name},</p>

                    <p style="font-size: 16px; color: #4a5568;">Below is your complete personality analysis—generated by AI and customized to YOUR unique traits. This isn't generic advice. <strong>This is your personal blueprint for building unshakeable focus.</strong></p>

                    <div class="report-content">
                        {report_html}
                    </div>

                    <div style="margin-top: 40px; padding: 30px; background: linear-gradient(135deg, rgba(122, 158, 159, 0.08) 0%, rgba(56, 161, 105, 0.08) 100%); border-radius: 12px; border-left: 4px solid #7A9E9F;">
                        <h3 style="margin-top: 0; color: #7A9E9F; font-size: 22px;">🚀 Ready to Apply These Insights?</h3>
                        <p style="margin-bottom: 20px; color: #4a5568;">Your personality analysis is most powerful when combined with the right tools. Install the Focused Room Chrome extension to start building focus sessions designed for <strong>YOUR unique brain</strong>:</p>
                        <div style="text-align: center;">
                            <a href="https://chromewebstore.google.com/detail/focused-room" class="cta-button">
                                Install Chrome Extension (Free) →
                            </a>
                        </div>
                        <p style="margin-top: 20px; margin-bottom: 0; color: #4a5568; font-size: 14px; text-align: center;">✨ Personalized blocking · Deep work timer · Progress tracking ✨</p>
                    </div>

                    <div style="background: #FAF9F5; border-radius: 12px; padding: 25px; margin-top: 35px; text-align: center;">
                        <p style="margin: 0; font-size: 16px; color: #4a5568; line-height: 1.7;">
                            <strong style="color: #7A9E9F;">What's Next?</strong><br>
                            Every Sunday, you'll receive <strong>"The Focus Formula"</strong> newsletter with strategies personalized to YOUR personality type. Watch for it in your inbox!
                        </p>
                    </div>

                    <div class="signature">
                        <p style="margin: 0 0 10px 0;">Questions about your report? Hit reply—I read every message personally.</p>
                        <p style="margin: 10px 0;"><strong>Souvik Ganguly</strong><br>
                        Founder, Focused Room<br>
                        <a href="mailto:founder@focusedroom.com" style="color: #7A9E9F; text-decoration: none;">founder@focusedroom.com</a></p>

                        <p style="font-size: 14px; color: #718096; margin-top: 25px;">
                            P.S. Save this email! You'll want to reference your personality insights as you build your focus habits. Consider it your personal operating manual.
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p style="font-weight: 600; color: #2d3748;">Focused Room</p>
                    <p>Backed by cognitive behavioral psychology | Privacy-first | Community-driven</p>
                    <p style="font-size: 12px; color: #9aa6b2; margin-top: 15px;">
                        <a href="https://focusedroom.com" style="color: #7A9E9F;">Visit Focused Room</a> |
                        <a href="https://focusedroom.com/unsubscribe" style="color: #7A9E9F;">Unsubscribe</a> |
                        <a href="https://focusedroom.com/privacy" style="color: #7A9E9F;">Privacy</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_big_five_report_email_text(self, user_name: str, markdown_report: str) -> str:
        """Generate plain text content for Big Five report email."""
        return f"""
YOUR BIG FIVE PERSONALITY REPORT
{user_name}, here's your personalized blueprint for success

{markdown_report}

---

READY TO APPLY THESE INSIGHTS?

Install the Focused Room Chrome extension to start building focus sessions designed for YOUR personality:
→ https://chromewebstore.google.com/detail/focused-room

Questions about your report? Reply to this email – I read every message personally.

Souvik Ganguly
Founder, Focused Room
founder@focusedroom.com

---
© 2025 Focused Room | Privacy-first productivity tools
Visit: https://focusedroom.com | Unsubscribe: https://focusedroom.com/unsubscribe
        """


# Global email service instance
email_service = EmailService()


def send_subscription_confirmation(email: str) -> dict[str, Any]:
    """
    Send subscription confirmation email.

    Args:
        email: Recipient email address

    Returns:
        Dict with success status and details
    """
    return email_service.send_subscription_confirmation(email)


def send_big_five_results(email: str, results: dict[str, Any]) -> dict[str, Any]:
    """
    Send Big Five personality test results via email.

    Args:
        email: Recipient email address
        results: Dictionary containing test results

    Returns:
        Dict with success status and details
    """
    return email_service.send_big_five_results(email, results)
