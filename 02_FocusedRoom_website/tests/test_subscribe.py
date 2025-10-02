"""
Unit tests for newsletter subscription functionality.

Tests cover:
- Email validation and sanitization
- Rate limiting functionality
- Database idempotency
- Email service integration
- Error handling and edge cases
"""

import pytest
import time
from unittest.mock import patch, MagicMock
from flask import Flask, json
from app import create_app, db
from app.models import Subscriber
from app.utils.validators import validate_email, validate_subscription_request
from app.utils.rate_limiter import RateLimiter
from app.utils.emailer import EmailService


class TestEmailValidation:
    """Test suite for email validation functionality."""
    
    def test_valid_email_addresses(self):
        """Test various valid email addresses."""
        valid_emails = [
            "user@example.com",
            "test.email@domain.co.uk",
            "user+tag@example.org",
            "firstname.lastname@company.com",
            "user123@test-domain.net"
        ]
        
        for email in valid_emails:
            is_valid, error = validate_email(email)
            assert is_valid, f"Email {email} should be valid: {error}"
    
    def test_invalid_email_addresses(self):
        """Test various invalid email addresses."""
        invalid_emails = [
            ("", "Email is required"),
            ("invalid", "Invalid email format"),
            ("@domain.com", "Invalid email format"),
            ("user@", "Invalid email format"),
            ("user..double@domain.com", "Email cannot contain consecutive dots"),
            ("user@localhost", "Invalid email"),
            ("a" * 260 + "@domain.com", "Email is too long"),
            (None, "Email is required")
        ]
        
        for email, expected_error in invalid_emails:
            is_valid, error = validate_email(email)
            assert not is_valid, f"Email {email} should be invalid"
            assert expected_error in str(error), f"Expected error '{expected_error}' not found in '{error}'"
    
    def test_email_edge_cases(self):
        """Test edge cases for email validation."""
        # Very long local part
        long_local = "a" * 65 + "@domain.com"
        is_valid, error = validate_email(long_local)
        assert not is_valid
        assert "local part is too long" in error
        
        # Very long domain
        long_domain = "user@" + "a" * 255 + ".com"
        is_valid, error = validate_email(long_domain)
        assert not is_valid
        assert "Email is too long" in error


class TestSubscriptionValidation:
    """Test suite for subscription request validation."""
    
    def test_valid_subscription_request(self):
        """Test valid subscription requests."""
        valid_requests = [
            {"email": "user@example.com"},
            {"email": "test.email@domain.co.uk"},
            {"email": "user+tag@example.org"}
        ]
        
        for data in valid_requests:
            is_valid, error = validate_subscription_request(data)
            assert is_valid, f"Request {data} should be valid: {error}"
    
    def test_invalid_subscription_request(self):
        """Test invalid subscription requests."""
        invalid_requests = [
            ({}, "Email is required"),
            ({"email": ""}, "Email is required"),
            ({"email": "invalid"}, "Invalid email"),
            ({"email": "user@test.com", "website": "spam.com"}, "Suspicious field"), 
            ({"email": "user@test.com", "phone": "1234567890"}, "Suspicious field")
        ]
        
        for data, expected_error in invalid_requests:
            is_valid, error = validate_subscription_request(data)
            assert not is_valid, f"Request {data} should be invalid"
            assert expected_error in str(error), f"Expected error '{expected_error}' not found in '{error}'"


class TestRateLimiter:
    """Test suite for rate limiting functionality."""
    
    def setup_method(self):
        """Set up fresh rate limiter for each test."""
        self.rate_limiter = RateLimiter()
    
    def test_rate_limit_allows_requests_within_limit(self):
        """Test that requests within limit are allowed."""
        ip = "192.168.1.1"
        
        # First 10 requests should be allowed
        for i in range(10):
            assert self.rate_limiter.is_allowed(ip), f"Request {i+1} should be allowed"
    
    def test_rate_limit_blocks_requests_over_limit(self):
        """Test that requests over limit are blocked."""
        ip = "192.168.1.2"
        
        # Fill up the rate limit
        for i in range(10):
            assert self.rate_limiter.is_allowed(ip), f"Request {i+1} should be allowed"
        
        # 11th request should be blocked
        assert not self.rate_limiter.is_allowed(ip), "Request 11 should be blocked"
    
    def test_rate_limit_resets_after_window(self):
        """Test that rate limit resets after time window."""
        ip = "192.168.1.3"
        
        # Fill up the rate limit
        for i in range(10):
            self.rate_limiter.is_allowed(ip)
        
        # Should be blocked
        assert not self.rate_limiter.is_allowed(ip)
        
        # Manually clear old requests to simulate time passing
        self.rate_limiter.requests[ip].clear()
        
        # Should be allowed again
        assert self.rate_limiter.is_allowed(ip)
    
    def test_different_ips_have_separate_limits(self):
        """Test that different IP addresses have separate rate limits."""
        ip1 = "192.168.1.4"
        ip2 = "192.168.1.5"
        
        # Fill up limit for ip1
        for i in range(10):
            self.rate_limiter.is_allowed(ip1)
        
        # ip1 should be blocked
        assert not self.rate_limiter.is_allowed(ip1)
        
        # ip2 should still be allowed
        assert self.rate_limiter.is_allowed(ip2)
    
    def test_remaining_requests_calculation(self):
        """Test remaining requests calculation."""
        ip = "192.168.1.6"
        
        # Initially should have full limit
        remaining = self.rate_limiter.get_remaining_requests(ip)
        assert remaining == 10
        
        # Make some requests
        for i in range(3):
            self.rate_limiter.is_allowed(ip)
        
        # Should have 7 remaining
        remaining = self.rate_limiter.get_remaining_requests(ip)
        assert remaining == 7


class TestEmailService:
    """Test suite for email service functionality."""
    
    def setup_method(self):
        """Set up email service for testing."""
        self.email_service = EmailService()
    
    @patch.dict('os.environ', {}, clear=True)
    def test_email_service_falls_back_to_console(self):
        """Test that email service falls back to console when no credentials."""
        result = self.email_service.send_subscription_confirmation("test@example.com")
        
        assert result["success"] is True
        assert result["provider"] == "console"
    
    @patch.dict('os.environ', {'SENDGRID_API_KEY': 'test-key'})
    def test_email_service_uses_sendgrid_when_available(self):
        """Test that email service uses SendGrid when API key is available."""
        email_service = EmailService()
        assert email_service.provider == "sendgrid"
    
    def test_subscription_email_content(self):
        """Test subscription email content generation."""
        html_content = self.email_service._get_subscription_email_html()
        text_content = self.email_service._get_subscription_email_text()
        
        assert "Welcome to Focused Room" in html_content
        assert "Welcome to Focused Room" in text_content
        assert "Chrome Extension" in html_content
        assert "Chrome Extension" in text_content
    
    def test_big_five_email_content(self):
        """Test Big Five results email content generation."""
        results = {
            "scores": {
                "openness": 75.0,
                "conscientiousness": 65.0,
                "extraversion": 55.0,
                "agreeableness": 80.0,
                "neuroticism": 45.0
            }
        }
        
        html_content = self.email_service._get_big_five_email_html(results)
        text_content = self.email_service._get_big_five_email_text(results)
        
        assert "Big Five Results" in html_content
        assert "Your Big Five Personality Results" in text_content
        assert "75.0" in html_content
        assert "75.0" in text_content


class TestSubscriptionEndpoint:
    """Test suite for subscription API endpoint."""
    
    def setup_method(self):
        """Set up Flask app and database for testing."""
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        # Clear rate limiter for each test
        from app.utils.rate_limiter import rate_limiter
        rate_limiter.requests.clear()
        
        with self.app.app_context():
            db.create_all()
    
    def teardown_method(self):
        """Clean up after each test."""
        with self.app.app_context():
            db.drop_all()
    
    def test_subscription_success(self):
        """Test successful subscription."""
        with self.app.app_context():
            response = self.client.post('/api/subscribe', 
                                      json={'email': 'success@example.com'},
                                      content_type='application/json')
            
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['success'] is True
            assert 'Successfully subscribed' in data['message']
            
            # Check database
            subscriber = Subscriber.query.filter_by(email='success@example.com').first()
            assert subscriber is not None
            assert subscriber.opt_in is True
    
    def test_subscription_idempotent(self):
        """Test that subscription is idempotent."""
        with self.app.app_context():
            # First subscription
            response1 = self.client.post('/api/subscribe',
                                       json={'email': 'test@example.com'},
                                       content_type='application/json')
            assert response1.status_code == 200
            
            # Second subscription (should be idempotent)
            response2 = self.client.post('/api/subscribe',
                                       json={'email': 'test@example.com'},
                                       content_type='application/json')
            assert response2.status_code == 200
            
            data = json.loads(response2.data)
            assert data['success'] is True
            assert 'Already subscribed' in data['message']
            
            # Should only have one subscriber in database
            subscribers = Subscriber.query.filter_by(email='test@example.com').all()
            assert len(subscribers) == 1
    
    def test_subscription_invalid_email(self):
        """Test subscription with invalid email."""
        with self.app.app_context():
            response = self.client.post('/api/subscribe',
                                      json={'email': 'invalid-email'},
                                      content_type='application/json')
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'Invalid email' in data['error']
    
    def test_subscription_missing_email(self):
        """Test subscription without email."""
        with self.app.app_context():
            response = self.client.post('/api/subscribe',
                                      json={},
                                      content_type='application/json')
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'Email is required' in data['error']
    
    def test_subscription_no_data(self):
        """Test subscription without any data."""
        with self.app.app_context():
            response = self.client.post('/api/subscribe',
                                      content_type='application/json')
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'Email is required' in data['error']
    
    def test_subscription_suspicious_fields(self):
        """Test subscription with suspicious fields (spam detection)."""
        with self.app.app_context():
            response = self.client.post('/api/subscribe',
                                      json={
                                          'email': 'test@test.com',
                                          'website': 'spam.com'
                                      },
                                      content_type='application/json')
            
            assert response.status_code == 400
            data = json.loads(response.data)
            assert data['success'] is False
            assert 'Suspicious field' in data['error']


class TestSubscriptionIntegration:
    """Integration tests for subscription functionality."""
    
    def test_full_subscription_flow(self):
        """Test complete subscription flow from request to email."""
        app = create_app()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        client = app.test_client()
        
        with app.app_context():
            db.create_all()
            
            # Mock email service to avoid sending real emails
            with patch('app.routes.send_subscription_confirmation') as mock_email:
                mock_email.return_value = {
                    'success': True,
                    'provider': 'console'
                }
                
                # Make subscription request
                response = client.post('/api/subscribe',
                                     json={'email': 'integration@test.com'},
                                     content_type='application/json')
                
                assert response.status_code == 200
                data = json.loads(response.data)
                assert data['success'] is True
                
                # Verify email was called
                mock_email.assert_called_once_with('integration@test.com')
                
                # Verify database record
                subscriber = Subscriber.query.filter_by(email='integration@test.com').first()
                assert subscriber is not None
                assert subscriber.opt_in is True