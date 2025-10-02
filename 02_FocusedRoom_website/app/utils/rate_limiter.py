"""
Rate Limiting Module for API Endpoints

This module provides IP-based rate limiting functionality to prevent abuse
and ensure fair usage of API endpoints.
"""

import time
from typing import Dict, Optional
from collections import defaultdict, deque
from flask import request, jsonify


class RateLimiter:
    """
    Simple in-memory rate limiter using sliding window approach.
    
    In production, consider using Redis for distributed rate limiting.
    """
    
    def __init__(self):
        # Store request timestamps per IP address
        self.requests: Dict[str, deque] = defaultdict(deque)
        # Default limits
        self.default_limit = 10  # requests
        self.default_window = 3600  # seconds (1 hour)
    
    def is_allowed(
        self, 
        ip_address: str, 
        limit: Optional[int] = None, 
        window: Optional[int] = None
    ) -> bool:
        """
        Check if request is allowed for given IP address.
        
        Args:
            ip_address: Client IP address
            limit: Maximum requests allowed (default: 10)
            window: Time window in seconds (default: 3600)
            
        Returns:
            True if request is allowed, False otherwise
        """
        limit = limit or self.default_limit
        window = window or self.default_window
        
        current_time = time.time()
        ip_requests = self.requests[ip_address]
        
        # Remove requests outside the time window
        while ip_requests and ip_requests[0] <= current_time - window:
            ip_requests.popleft()
        
        # Check if limit exceeded
        if len(ip_requests) >= limit:
            return False
        
        # Add current request
        ip_requests.append(current_time)
        return True
    
    def get_remaining_requests(
        self, 
        ip_address: str, 
        limit: Optional[int] = None, 
        window: Optional[int] = None
    ) -> int:
        """
        Get remaining requests for IP address.
        
        Args:
            ip_address: Client IP address
            limit: Maximum requests allowed
            window: Time window in seconds
            
        Returns:
            Number of remaining requests
        """
        limit = limit or self.default_limit
        window = window or self.default_window
        
        current_time = time.time()
        ip_requests = self.requests[ip_address]
        
        # Remove requests outside the time window
        while ip_requests and ip_requests[0] <= current_time - window:
            ip_requests.popleft()
        
        return max(0, limit - len(ip_requests))
    
    def get_reset_time(
        self, 
        ip_address: str, 
        window: Optional[int] = None
    ) -> int:
        """
        Get time when rate limit resets for IP address.
        
        Args:
            ip_address: Client IP address
            window: Time window in seconds
            
        Returns:
            Unix timestamp when limit resets
        """
        window = window or self.default_window
        
        if ip_address in self.requests and self.requests[ip_address]:
            oldest_request = self.requests[ip_address][0]
            return int(oldest_request + window)
        
        return int(time.time())


# Global rate limiter instance
rate_limiter = RateLimiter()


def rate_limit(
    limit: int = 10, 
    window: int = 3600, 
    per: str = 'ip'
):
    """
    Decorator for rate limiting Flask endpoints.
    
    Args:
        limit: Maximum requests allowed
        window: Time window in seconds
        per: Rate limiting key ('ip', 'user', etc.)
        
    Returns:
        Decorated function
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            if per == 'ip':
                client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
                if client_ip:
                    client_ip = client_ip.split(',')[0].strip()
            else:
                client_ip = 'default'
            
            if not rate_limiter.is_allowed(client_ip, limit, window):
                remaining = rate_limiter.get_remaining_requests(client_ip, limit, window)
                reset_time = rate_limiter.get_reset_time(client_ip, window)
                
                return jsonify({
                    "success": False,
                    "error": "Rate limit exceeded",
                    "details": {
                        "limit": limit,
                        "window": window,
                        "remaining": remaining,
                        "reset_time": reset_time
                    }
                }), 429
            
            return func(*args, **kwargs)
        
        wrapper.__name__ = func.__name__
        return wrapper
    
    return decorator


def get_client_ip() -> str:
    """
    Get client IP address from request.
    
    Returns:
        Client IP address string
    """
    # Check for forwarded IP first (behind proxy/load balancer)
    forwarded_for = request.environ.get('HTTP_X_FORWARDED_FOR')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    
    # Fallback to remote address
    return request.remote_addr or 'unknown'