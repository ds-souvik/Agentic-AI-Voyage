"""
SEO utilities for Focused Room website.
Provides functions for generating sitemaps, JSON-LD structured data, and meta tags.
"""

from datetime import datetime
from typing import List, Dict, Any
from flask import url_for, request


def generate_sitemap_xml(base_url: str) -> str:
    """
    Generate XML sitemap for search engines.
    
    Args:
        base_url: Base URL of the website (e.g., 'https://focusedroom.com')
    
    Returns:
        str: XML sitemap content
    """
    # Define all routes with their priorities and change frequencies
    routes = [
        {
            'loc': '/',
            'priority': '1.0',
            'changefreq': 'weekly',
            'lastmod': datetime.now().strftime('%Y-%m-%d')
        },
        {
            'loc': '/big-five',
            'priority': '0.8',
            'changefreq': 'monthly',
            'lastmod': datetime.now().strftime('%Y-%m-%d')
        },
        {
            'loc': '/features',
            'priority': '0.7',
            'changefreq': 'monthly',
            'lastmod': datetime.now().strftime('%Y-%m-%d')
        },
        {
            'loc': '/blog',
            'priority': '0.6',
            'changefreq': 'weekly',
            'lastmod': datetime.now().strftime('%Y-%m-%d')
        },
        {
            'loc': '/privacy',
            'priority': '0.3',
            'changefreq': 'yearly',
            'lastmod': datetime.now().strftime('%Y-%m-%d')
        }
    ]
    
    # Build XML sitemap
    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for route in routes:
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{base_url}{route["loc"]}</loc>')
        xml_lines.append(f'    <lastmod>{route["lastmod"]}</lastmod>')
        xml_lines.append(f'    <changefreq>{route["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{route["priority"]}</priority>')
        xml_lines.append('  </url>')
    
    xml_lines.append('</urlset>')
    
    return '\n'.join(xml_lines)


def generate_json_ld_website() -> Dict[str, Any]:
    """
    Generate JSON-LD structured data for the website (Organization schema).
    
    Returns:
        dict: JSON-LD structured data
    """
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Focused Room",
        "url": "https://focusedroom.com",
        "description": "Block distractions, protect your deep work, and gamify productivity with Focused Room Chrome extension.",
        "publisher": {
            "@type": "Organization",
            "name": "Focused Room",
            "logo": {
                "@type": "ImageObject",
                "url": "https://focusedroom.com/static/assets/logo.png"
            }
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://focusedroom.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }


def generate_json_ld_software_application() -> Dict[str, Any]:
    """
    Generate JSON-LD structured data for the Chrome extension (SoftwareApplication schema).
    
    Returns:
        dict: JSON-LD structured data
    """
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Focused Room",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Chrome",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        },
        "description": "Turn Chrome into a calm workspace — block distractions, use friction override, and track progress with gamified reports.",
        "screenshot": "https://focusedroom.com/static/assets/hero-screenshot.png",
        "softwareVersion": "1.0",
        "applicationSubCategory": "Browser Extension"
    }


def generate_json_ld_breadcrumb(items: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Generate JSON-LD breadcrumb navigation.
    
    Args:
        items: List of breadcrumb items with 'name' and 'url' keys
        
    Returns:
        dict: JSON-LD breadcrumb list
    """
    item_list = []
    for index, item in enumerate(items, start=1):
        item_list.append({
            "@type": "ListItem",
            "position": index,
            "name": item['name'],
            "item": item['url']
        })
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": item_list
    }


def generate_json_ld_article(title: str, description: str, author: str, 
                            date_published: str, date_modified: str = None,
                            image_url: str = None) -> Dict[str, Any]:
    """
    Generate JSON-LD structured data for blog articles.
    
    Args:
        title: Article title
        description: Article description
        author: Author name
        date_published: Publication date (ISO format)
        date_modified: Last modification date (ISO format)
        image_url: Article featured image URL
        
    Returns:
        dict: JSON-LD article data
    """
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Person",
            "name": author
        },
        "datePublished": date_published,
        "publisher": {
            "@type": "Organization",
            "name": "Focused Room",
            "logo": {
                "@type": "ImageObject",
                "url": "https://focusedroom.com/static/assets/logo.png"
            }
        }
    }
    
    if date_modified:
        article["dateModified"] = date_modified
    
    if image_url:
        article["image"] = image_url
    
    return article


def get_meta_tags(page_type: str = 'home') -> Dict[str, str]:
    """
    Get optimized meta tags for different page types.
    
    Args:
        page_type: Type of page ('home', 'big-five', 'features', 'blog', 'privacy')
        
    Returns:
        dict: Meta tags dictionary
    """
    base_url = request.url_root.rstrip('/')
    
    meta_tags = {
        'home': {
            'title': 'Focused Room - Block Distractions, Build Your Future',
            'description': 'Turn Chrome into a calm workspace. Block distractions, use friction override, and track progress with gamified reports. Free Chrome extension.',
            'og_title': 'Focused Room - Protect Your Focus. Build Your Future.',
            'og_description': 'Block distractions, protect your deep work, and gamify productivity with Focused Room Chrome extension.',
            'og_image': f'{base_url}/static/assets/og-image-home.png',
            'og_type': 'website',
            'twitter_card': 'summary_large_image',
            'keywords': 'productivity, focus, chrome extension, distraction blocker, deep work, time management'
        },
        'big-five': {
            'title': 'Big Five Personality Test - Focused Room',
            'description': 'Take the scientifically-validated Big Five personality test and discover your unique personality profile. Get personalized productivity recommendations.',
            'og_title': 'Big Five Personality Test - Free & Science-Based',
            'og_description': 'Discover your personality profile with the Big Five test. Get personalized insights and productivity recommendations.',
            'og_image': f'{base_url}/static/assets/og-image-bigfive.png',
            'og_type': 'website',
            'twitter_card': 'summary_large_image',
            'keywords': 'big five, personality test, psychology, personality traits, self-assessment'
        },
        'features': {
            'title': 'Features - Focused Room Chrome Extension',
            'description': 'Explore Focused Room features: distraction blocking, friction override, gamified progress tracking, and privacy-first design.',
            'og_title': 'Focused Room Features - Productivity Redefined',
            'og_description': 'Distraction blocking, friction override, gamified tracking. All the features you need for deep work.',
            'og_image': f'{base_url}/static/assets/og-image-features.png',
            'og_type': 'website',
            'twitter_card': 'summary_large_image',
            'keywords': 'chrome extension features, productivity tools, distraction blocking, focus tools'
        },
        'blog': {
            'title': 'Blog - Focused Room',
            'description': 'Read articles about productivity, deep work, focus techniques, and building better work habits.',
            'og_title': 'Focused Room Blog - Productivity & Deep Work',
            'og_description': 'Articles about productivity, focus, and building better work habits.',
            'og_image': f'{base_url}/static/assets/og-image-blog.png',
            'og_type': 'website',
            'twitter_card': 'summary_large_image',
            'keywords': 'productivity blog, deep work, focus techniques, work habits'
        },
        'privacy': {
            'title': 'Privacy Policy - Focused Room',
            'description': 'Learn how Focused Room protects your privacy. Your data stays on your device. No trackers, no third-party analytics.',
            'og_title': 'Privacy Policy - Focused Room',
            'og_description': 'Privacy-first design. Your data stays on your device.',
            'og_image': f'{base_url}/static/assets/og-image.png',
            'og_type': 'website',
            'twitter_card': 'summary',
            'keywords': 'privacy policy, data protection, user privacy'
        }
    }
    
    return meta_tags.get(page_type, meta_tags['home'])


def generate_canonical_url(path: str = None) -> str:
    """
    Generate canonical URL for the current page.
    
    Args:
        path: Optional path override
        
    Returns:
        str: Canonical URL
    """
    base_url = request.url_root.rstrip('/')
    if path:
        return f"{base_url}{path}"
    return request.url.split('?')[0]  # Remove query parameters