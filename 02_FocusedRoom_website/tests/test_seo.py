"""
Unit tests for SEO utilities and functionality.
Tests sitemap generation, meta tags, JSON-LD, and robots.txt.
"""

import json
from datetime import datetime

import pytest
from flask import Flask

from app import create_app
from app.utils.seo import (
    generate_canonical_url,
    generate_json_ld_article,
    generate_json_ld_breadcrumb,
    generate_json_ld_software_application,
    generate_json_ld_website,
    generate_sitemap_xml,
    get_meta_tags,
)


class TestSitemapGeneration:
    """Test sitemap XML generation."""

    def test_sitemap_xml_structure(self):
        """Test that sitemap XML is valid and well-formed."""
        base_url = "https://focusedroom.com"
        sitemap = generate_sitemap_xml(base_url)

        # Check XML declaration
        assert '<?xml version="1.0" encoding="UTF-8"?>' in sitemap
        assert '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' in sitemap
        assert "</urlset>" in sitemap

    def test_sitemap_contains_all_routes(self):
        """Test that sitemap contains all important routes."""
        base_url = "https://focusedroom.com"
        sitemap = generate_sitemap_xml(base_url)

        # Check essential routes
        assert "<loc>https://focusedroom.com/</loc>" in sitemap
        assert "<loc>https://focusedroom.com/big-five</loc>" in sitemap
        assert "<loc>https://focusedroom.com/features</loc>" in sitemap
        assert "<loc>https://focusedroom.com/blog</loc>" in sitemap
        assert "<loc>https://focusedroom.com/privacy</loc>" in sitemap

    def test_sitemap_has_required_fields(self):
        """Test that each URL has required fields."""
        base_url = "https://focusedroom.com"
        sitemap = generate_sitemap_xml(base_url)

        # Check for required fields
        assert "<loc>" in sitemap
        assert "<lastmod>" in sitemap
        assert "<changefreq>" in sitemap
        assert "<priority>" in sitemap

    def test_sitemap_priorities_correct(self):
        """Test that sitemap priorities are correct."""
        base_url = "https://focusedroom.com"
        sitemap = generate_sitemap_xml(base_url)

        # Home should have highest priority
        assert "<priority>1.0</priority>" in sitemap


class TestJSONLDGeneration:
    """Test JSON-LD structured data generation."""

    def test_json_ld_website_structure(self):
        """Test website JSON-LD structure."""
        json_ld = generate_json_ld_website()

        assert json_ld["@context"] == "https://schema.org"
        assert json_ld["@type"] == "WebSite"
        assert "name" in json_ld
        assert "url" in json_ld
        assert "description" in json_ld
        assert "publisher" in json_ld

    def test_json_ld_software_application(self):
        """Test software application JSON-LD structure."""
        json_ld = generate_json_ld_software_application()

        assert json_ld["@context"] == "https://schema.org"
        assert json_ld["@type"] == "SoftwareApplication"
        assert json_ld["name"] == "Focused Room"
        assert json_ld["applicationCategory"] == "ProductivityApplication"
        assert "offers" in json_ld
        assert json_ld["offers"]["price"] == "0"

    def test_json_ld_breadcrumb(self):
        """Test breadcrumb JSON-LD generation."""
        items = [
            {"name": "Home", "url": "https://focusedroom.com/"},
            {"name": "Blog", "url": "https://focusedroom.com/blog"},
            {"name": "Article", "url": "https://focusedroom.com/blog/article-1"},
        ]
        json_ld = generate_json_ld_breadcrumb(items)

        assert json_ld["@type"] == "BreadcrumbList"
        assert len(json_ld["itemListElement"]) == 3
        assert json_ld["itemListElement"][0]["position"] == 1
        assert json_ld["itemListElement"][0]["name"] == "Home"

    def test_json_ld_article(self):
        """Test article JSON-LD generation."""
        json_ld = generate_json_ld_article(
            title="Test Article",
            description="Test description",
            author="John Doe",
            date_published="2025-01-01",
            date_modified="2025-01-15",
            image_url="https://example.com/image.png",
        )

        assert json_ld["@type"] == "Article"
        assert json_ld["headline"] == "Test Article"
        assert json_ld["author"]["name"] == "John Doe"
        assert json_ld["datePublished"] == "2025-01-01"
        assert json_ld["dateModified"] == "2025-01-15"


class TestMetaTags:
    """Test meta tags generation."""

    def setup_method(self):
        """Set up test Flask app context."""
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def test_home_page_meta_tags(self):
        """Test home page meta tags."""
        with self.app.test_request_context("/"):
            meta = get_meta_tags("home")

            assert "title" in meta
            assert "description" in meta
            assert "Focused Room" in meta["title"]
            assert "productivity" in meta["keywords"].lower()

    def test_big_five_meta_tags(self):
        """Test Big Five page meta tags."""
        with self.app.test_request_context("/big-five"):
            meta = get_meta_tags("big-five")

            assert "Big Five" in meta["title"]
            assert "personality" in meta["description"].lower()
            assert "personality test" in meta["keywords"].lower()

    def test_all_page_types_have_required_fields(self):
        """Test that all page types have required meta tag fields."""
        page_types = ["home", "big-five", "features", "blog", "privacy"]

        with self.app.test_request_context("/"):
            for page_type in page_types:
                meta = get_meta_tags(page_type)

                # Check required fields
                assert "title" in meta
                assert "description" in meta
                assert "og_title" in meta
                assert "og_description" in meta
                assert "og_image" in meta
                assert "og_type" in meta
                assert "twitter_card" in meta
                assert "keywords" in meta


class TestCanonicalURL:
    """Test canonical URL generation."""

    def setup_method(self):
        """Set up test Flask app context."""
        self.app = create_app()
        self.app.config["TESTING"] = True

    def test_canonical_url_without_query_params(self):
        """Test canonical URL generation without query parameters."""
        with self.app.test_request_context("http://focusedroom.com/"):
            canonical = generate_canonical_url()
            assert "http://focusedroom.com/" in canonical
            assert "?" not in canonical

    def test_canonical_url_with_query_params(self):
        """Test that canonical URL removes query parameters."""
        with self.app.test_request_context("http://focusedroom.com/blog?page=2&sort=date"):
            canonical = generate_canonical_url()
            assert "?" not in canonical
            assert "page" not in canonical

    def test_canonical_url_with_path_override(self):
        """Test canonical URL with custom path."""
        with self.app.test_request_context("http://focusedroom.com/"):
            canonical = generate_canonical_url("/custom-path")
            assert "/custom-path" in canonical


class TestSEOEndpoints:
    """Test SEO-related endpoints."""

    def setup_method(self):
        """Set up test Flask app and client."""
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def test_sitemap_endpoint_exists(self):
        """Test that /sitemap.xml endpoint exists and returns XML."""
        response = self.client.get("/sitemap.xml")

        assert response.status_code == 200
        assert response.mimetype == "application/xml"
        assert b'<?xml version="1.0" encoding="UTF-8"?>' in response.data

    def test_robots_txt_endpoint_exists(self):
        """Test that /robots.txt endpoint exists."""
        response = self.client.get("/robots.txt")

        assert response.status_code == 200
        assert response.mimetype == "text/plain"
        assert b"User-agent:" in response.data

    def test_robots_txt_contains_sitemap(self):
        """Test that robots.txt references sitemap."""
        response = self.client.get("/robots.txt")

        assert b"Sitemap:" in response.data
        assert b"sitemap.xml" in response.data

    def test_robots_txt_disallows_api(self):
        """Test that robots.txt disallows /api/ paths."""
        response = self.client.get("/robots.txt")

        assert b"Disallow: /api/" in response.data


class TestMetaTagsInTemplates:
    """Test that meta tags are properly rendered in templates."""

    def setup_method(self):
        """Set up test Flask app and client."""
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def test_home_page_has_meta_tags(self):
        """Test that home page renders meta tags."""
        response = self.client.get("/")

        assert response.status_code == 200
        assert b'<meta name="description"' in response.data
        assert b'<meta property="og:title"' in response.data
        assert b'<meta name="twitter:card"' in response.data

    def test_home_page_has_json_ld(self):
        """Test that home page includes JSON-LD structured data."""
        response = self.client.get("/")

        assert response.status_code == 200
        assert b"application/ld+json" in response.data
        assert b"@context" in response.data
        assert b"schema.org" in response.data
