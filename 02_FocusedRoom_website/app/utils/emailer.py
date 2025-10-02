"""
Email Service Module for Focused Room Website

This module provides email functionality for newsletter subscriptions,
confirmations, and other automated emails using SendGrid with fallback options.
"""

import logging
import os
from typing import Any, Dict, Optional

from flask import current_app

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

    def send_subscription_confirmation(self, email: str) -> Dict[str, Any]:
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

    def send_big_five_results(self, email: str, results: Dict[str, Any]) -> Dict[str, Any]:
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

    def _send_email(
        self, to_email: str, subject: str, html_content: str, text_content: str
    ) -> Dict[str, Any]:
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
    ) -> Dict[str, Any]:
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
    ) -> Dict[str, Any]:
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
    ) -> Dict[str, Any]:
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

    def _get_big_five_email_html(self, results: Dict[str, Any]) -> str:
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

    def _get_big_five_email_text(self, results: Dict[str, Any]) -> str:
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


# Global email service instance
email_service = EmailService()


def send_subscription_confirmation(email: str) -> Dict[str, Any]:
    """
    Send subscription confirmation email.

    Args:
        email: Recipient email address

    Returns:
        Dict with success status and details
    """
    return email_service.send_subscription_confirmation(email)


def send_big_five_results(email: str, results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send Big Five personality test results via email.

    Args:
        email: Recipient email address
        results: Dictionary containing test results

    Returns:
        Dict with success status and details
    """
    return email_service.send_big_five_results(email, results)
