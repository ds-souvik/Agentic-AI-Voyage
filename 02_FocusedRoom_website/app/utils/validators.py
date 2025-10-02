"""
Validation Utilities for Focused Room Website

This module provides validation functions for various input types
including email addresses, form data, and API requests.
"""

import re
from typing import List, Tuple, Optional, Dict, Any


def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """
    Validate email address format and basic rules.
    
    Args:
        email: Email address to validate
        
    Returns:
        Tuple of (is_valid: bool, error_message: Optional[str])
    """
    if not email:
        return False, "Email is required"
    
    if not isinstance(email, str):
        return False, "Email must be a string"
    
    # Basic length check
    if len(email) < 5:
        return False, "Email is too short"
    
    if len(email) > 254:  # RFC 5321 limit
        return False, "Email is too long"
    
    # RFC 5322 compliant regex (simplified)
    email_pattern = re.compile(
        r'^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$'
    )
    
    if not email_pattern.match(email):
        return False, "Invalid email format"
    
    # Additional checks
    if email.count('@') != 1:
        return False, "Email must contain exactly one @ symbol"
    
    local_part, domain = email.split('@')
    
    if len(local_part) > 64:  # RFC 5321 limit
        return False, "Email local part is too long"
    
    if len(domain) > 253:  # RFC 5321 limit
        return False, "Email domain is too long"
    
    # Check for consecutive dots
    if '..' in email:
        return False, "Email cannot contain consecutive dots"
    
    # Check for reserved domains (basic check)
    reserved_domains = ['localhost', 'invalid']
    if domain.lower() in reserved_domains:
        return False, "Email domain is not allowed"
    
    return True, None


def validate_big_five_answers(answers: List) -> Tuple[bool, Optional[str]]:
    """
    Validate Big Five personality test answers.
    
    Args:
        answers: List of answers to validate
        
    Returns:
        Tuple of (is_valid: bool, error_message: Optional[str])
    """
    if not isinstance(answers, list):
        return False, "Answers must be a list"
    
    if len(answers) not in [44, 50]:
        return False, f"Expected 44 or 50 answers, got {len(answers)}"
    
    try:
        numeric_answers = [float(x) for x in answers]
    except (TypeError, ValueError):
        return False, "All answers must be numeric values"
    
    if any(x < 1 or x > 5 for x in numeric_answers):
        return False, "All answers must be in the range 1-5"
    
    return True, None


def validate_subscription_request(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validate newsletter subscription request.
    
    Args:
        data: Request data dictionary
        
    Returns:
        Tuple of (is_valid: bool, error_message: Optional[str])
    """
    if not isinstance(data, dict):
        return False, "Request data must be a dictionary"
    
    email = data.get('email')
    if not email:
        return False, "Email is required"
    
    # Validate email format
    is_valid, error = validate_email(email)
    if not is_valid:
        return False, f"Invalid email: {error}"
    
    # Check for additional fields that might be spam
    suspicious_fields = ['website', 'url', 'phone', 'company', 'subject', 'message']
    for field in suspicious_fields:
        if field in data and data[field]:
            return False, f"Suspicious field '{field}' detected"
    
    return True, None


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input to prevent XSS and other attacks.
    
    Args:
        text: Input text to sanitize
        max_length: Maximum allowed length
        
    Returns:
        Sanitized text
    """
    if not isinstance(text, str):
        return ""
    
    # Limit length
    text = text[:max_length]
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '\x00', '\r', '\n']
    for char in dangerous_chars:
        text = text.replace(char, '')
    
    # Strip whitespace
    text = text.strip()
    
    return text


def validate_rate_limit_headers(headers: Dict[str, str]) -> Dict[str, Any]:
    """
    Extract and validate rate limiting information from headers.
    
    Args:
        headers: Request headers dictionary
        
    Returns:
        Dictionary with rate limit information
    """
    rate_limit_info = {
        'limit': None,
        'remaining': None,
        'reset': None,
        'retry_after': None
    }
    
    # Check for standard rate limit headers
    if 'X-RateLimit-Limit' in headers:
        try:
            rate_limit_info['limit'] = int(headers['X-RateLimit-Limit'])
        except ValueError:
            pass
    
    if 'X-RateLimit-Remaining' in headers:
        try:
            rate_limit_info['remaining'] = int(headers['X-RateLimit-Remaining'])
        except ValueError:
            pass
    
    if 'X-RateLimit-Reset' in headers:
        try:
            rate_limit_info['reset'] = int(headers['X-RateLimit-Reset'])
        except ValueError:
            pass
    
    if 'Retry-After' in headers:
        try:
            rate_limit_info['retry_after'] = int(headers['Retry-After'])
        except ValueError:
            pass
    
    return rate_limit_info