"""
Professional PDF Report Generator for Big Five Personality Test

Generates world-class, visually appealing PDF reports using ReportLab.
Inspired by professional personality assessment reports, with:
- Clean typography and layout
- Data visualizations
- Structured sections
- Brand consistency
- Professional presentation quality

Architecture:
- Production-grade error handling
- Fallback to text reports if PDF fails
- Modular design for easy maintenance
- Type-safe with comprehensive documentation
"""

import io
from datetime import datetime
from typing import Optional

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def generate_bigfive_report_pdf(
    user_email: str,
    scores: dict[str, float],
    percentiles: dict[str, float],
    suggestions: str,
    result_id: Optional[int] = None,
) -> bytes:
    """
    Generate a professional, comprehensive Big Five personality report PDF.

    This creates a multi-page PDF with:
    - Professional cover page
    - Detailed trait scores with visual table
    - AI-generated insights (parsed from markdown)
    - Call-to-action for Focused Room extension
    - Brand-consistent styling

    Args:
        user_email: User's email address for personalization
        scores: Dictionary of Big Five trait scores (0-100 scale)
                Keys: openness, conscientiousness, extraversion, agreeableness, neuroticism
        percentiles: Dictionary of Big Five trait percentiles (0-100 scale)
        suggestions: AI-generated personality insights (markdown formatted)
        result_id: Optional database ID for tracking/support

    Returns:
        PDF file as bytes (can be written to file or emailed as attachment)

    Example:
        >>> pdf_bytes = generate_bigfive_report_pdf(
        ...     user_email="user@example.com",
        ...     scores={"openness": 65.0, "conscientiousness": 80.0, ...},
        ...     percentiles={"openness": 70, "conscientiousness": 85, ...},
        ...     suggestions="## Your Profile\n\nYou are...",
        ...     result_id=123
        ... )
        >>> with open("report.pdf", "wb") as f:
        ...     f.write(pdf_bytes)
    """
    buffer = io.BytesIO()

    # Document setup with custom margins
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="Big Five Personality Report - Focused Room",
        author="Focused Room",
    )

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # DESIGN SYSTEM COLORS (From main.css)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PRIMARY_TEAL = HexColor("#7A9E9F")
    PRIMARY_DARK = HexColor("#6B8B8C")
    HexColor("#38a169")
    TEXT_PRIMARY = HexColor("#2d3748")
    TEXT_SECONDARY = HexColor("#4a5568")
    TEXT_MUTED = HexColor("#718096")
    BG_LIGHT = HexColor("#F7FAFC")
    BORDER_COLOR = HexColor("#E2E8F0")

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # CUSTOM TYPOGRAPHY STYLES
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    styles = getSampleStyleSheet()

    # Cover page styles
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            fontSize=32,
            leading=38,
            alignment=TA_CENTER,
            spaceAfter=12,
            fontName="Helvetica-Bold",
            textColor=TEXT_PRIMARY,
        )
    )

    styles.add(
        ParagraphStyle(
            name="CoverSubtitle",
            fontSize=16,
            leading=20,
            alignment=TA_CENTER,
            spaceAfter=8,
            fontName="Helvetica-Oblique",
            textColor=PRIMARY_TEAL,
        )
    )

    styles.add(
        ParagraphStyle(
            name="CoverMeta",
            fontSize=11,
            leading=14,
            alignment=TA_CENTER,
            spaceAfter=4,
            fontName="Helvetica",
            textColor=TEXT_MUTED,
        )
    )

    # Content styles
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            fontSize=20,
            leading=24,
            spaceBefore=24,
            spaceAfter=12,
            fontName="Helvetica-Bold",
            textColor=PRIMARY_TEAL,
        )
    )

    styles.add(
        ParagraphStyle(
            name="SubsectionHeading",
            fontSize=16,
            leading=20,
            spaceBefore=16,
            spaceAfter=8,
            fontName="Helvetica-Bold",
            textColor=TEXT_PRIMARY,
        )
    )

    styles.add(
        ParagraphStyle(
            name="BodyTextCustom",
            fontSize=11,
            leading=16,
            spaceAfter=10,
            fontName="Helvetica",
            textColor=TEXT_SECONDARY,
            alignment=TA_JUSTIFY,
        )
    )

    styles.add(
        ParagraphStyle(
            name="ListItem",
            fontSize=11,
            leading=16,
            spaceAfter=8,
            fontName="Helvetica",
            textColor=TEXT_SECONDARY,
            leftIndent=20,
            bulletIndent=10,
        )
    )

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # BUILD PDF CONTENT
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story = []

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 1: COVER PAGE
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("Your Big Five<br/>Personality Report", styles["CoverTitle"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("AI-Powered Insights for Peak Productivity", styles["CoverSubtitle"]))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph(f"Prepared for: {user_email}", styles["CoverMeta"]))
    story.append(
        Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles["CoverMeta"])
    )
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Powered by Focused Room | focusedroom.com", styles["CoverMeta"]))

    story.append(PageBreak())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 2: PERSONALITY PROFILE SCORES
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(Paragraph("Your Personality Profile", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "The Big Five model measures personality across five core dimensions. "
            "Your scores reveal your unique psychological blueprint, benchmarked against "
            "a large population sample.",
            styles["BodyTextCustom"],
        )
    )
    story.append(Spacer(1, 0.3 * inch))

    # Build scores table
    trait_data = [["Trait", "Your Score", "Percentile", "Level"]]

    trait_info = {
        "openness": ("Openness to Experience", "🎨"),
        "conscientiousness": ("Conscientiousness", "✅"),
        "extraversion": ("Extraversion", "⚡"),
        "agreeableness": ("Agreeableness", "🤝"),
        "neuroticism": ("Emotional Stability", "🧘"),
    }

    def get_level(score: float) -> str:
        """Convert numeric score to verbal level."""
        if score >= 70:
            return "Very High"
        elif score >= 55:
            return "High"
        elif score >= 45:
            return "Moderate"
        elif score >= 30:
            return "Low"
        else:
            return "Very Low"

    for trait, (name, emoji) in trait_info.items():
        score = scores.get(trait, 0)
        pct = percentiles.get(trait, 0)

        # Invert neuroticism for display as emotional stability
        if trait == "neuroticism":
            display_score = 100 - score
            display_pct = 100 - pct
        else:
            display_score = score
            display_pct = pct

        level = get_level(display_score)
        trait_data.append(
            [f"{emoji} {name}", f"{display_score:.0f}/100", f"{display_pct:.0f}th", level]
        )

    # Create professional table
    scores_table = Table(trait_data, colWidths=[2.5 * inch, 1.2 * inch, 1 * inch, 1.2 * inch])
    scores_table.setStyle(
        TableStyle(
            [
                # Header row styling
                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY_TEAL),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 12),
                ("ALIGN", (0, 0), (-1, 0), "CENTER"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("TOPPADDING", (0, 0), (-1, 0), 12),
                # Data rows styling
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 1), (-1, -1), 11),
                ("ALIGN", (1, 1), (-1, -1), "CENTER"),
                ("ALIGN", (0, 1), (0, -1), "LEFT"),
                ("LEFTPADDING", (0, 0), (0, -1), 12),
                ("RIGHTPADDING", (-1, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 1), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 10),
                # Alternating row colors (professional)
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
                # Borders
                ("GRID", (0, 0), (-1, -1), 1, BORDER_COLOR),
                ("LINEABOVE", (0, 0), (-1, 0), 2, PRIMARY_DARK),
                ("LINEBELOW", (0, -1), (-1, -1), 2, BORDER_COLOR),
            ]
        )
    )

    story.append(scores_table)
    story.append(Spacer(1, 0.4 * inch))

    # Trait interpretations
    story.append(Paragraph("What These Scores Mean", styles["SubsectionHeading"]))

    trait_descriptions = {
        "openness": "Reflects your curiosity, imagination, and willingness to try new experiences. Higher scores indicate creativity and open-mindedness.",
        "conscientiousness": "Measures your organization, self-discipline, and reliability. Higher scores suggest strong goal-orientation and planning.",
        "extraversion": "Indicates your energy level, sociability, and preference for social interaction. Higher scores reflect outgoing and energetic tendencies.",
        "agreeableness": "Shows your compassion, cooperation, and concern for others. Higher scores indicate warmth and empathy in relationships.",
        "neuroticism": "Inverted to show Emotional Stability. Higher stability scores reflect calmness, resilience, and ability to handle stress effectively.",
    }

    for trait, desc in trait_descriptions.items():
        story.append(
            Paragraph(
                f"<b>{trait_info[trait][0]}:</b> {desc}",
                styles["BodyTextCustom"],
            )
        )
        story.append(Spacer(1, 0.1 * inch))

    story.append(PageBreak())

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PAGE 3+: AI-POWERED INSIGHTS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(Paragraph("Your AI-Powered Insights", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "These personalized insights were generated by analyzing your unique personality profile. "
            "Each recommendation is tailored specifically to YOUR score combination.",
            styles["BodyTextCustom"],
        )
    )
    story.append(Spacer(1, 0.2 * inch))

    # Parse markdown-style suggestions into formatted paragraphs
    lines = suggestions.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Major section headers (##)
        if line.startswith("## "):
            title = line[3:].strip()
            story.append(Spacer(1, 0.2 * inch))
            story.append(Paragraph(title, styles["SubsectionHeading"]))

        # Minor section headers (###)
        elif line.startswith("### "):
            title = line[4:].strip()
            story.append(Spacer(1, 0.15 * inch))
            story.append(
                Paragraph(
                    f"<b>{title}</b>",
                    ParagraphStyle(
                        name="MinorHeading",
                        parent=styles["BodyTextCustom"],
                        fontSize=12,
                        fontName="Helvetica-Bold",
                        spaceAfter=6,
                        textColor=PRIMARY_DARK,
                    ),
                )
            )

        # List items (- or *)
        elif line.startswith("- ") or line.startswith("* "):
            item = line[2:].strip()
            # Handle bold formatting (**text**)
            while "**" in item:
                item = item.replace("**", "<b>", 1)
                item = item.replace("**", "</b>", 1)
            story.append(Paragraph(f"• {item}", styles["ListItem"]))

        # Regular paragraphs
        else:
            text = line
            # Handle bold formatting
            while "**" in text:
                text = text.replace("**", "<b>", 1)
                text = text.replace("**", "</b>", 1)
            story.append(Paragraph(text, styles["BodyTextCustom"]))

    story.append(Spacer(1, 0.4 * inch))

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FINAL PAGE: CALL TO ACTION
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    story.append(PageBreak())
    story.append(Paragraph("Ready to Transform Your Productivity?", styles["SectionHeading"]))
    story.append(
        Paragraph(
            "This report is just the beginning. The Focused Room Chrome extension helps you "
            "apply these insights every day with personalized tools designed for YOUR brain:",
            styles["BodyTextCustom"],
        )
    )
    story.append(Spacer(1, 0.2 * inch))

    features = [
        "🎯 <b>Personalized Deep Work Sessions</b> — Tailored session lengths based on your focus style",
        "🛡️ <b>Smart Website Blocking</b> — Eliminate the specific distractions that drain YOUR energy",
        "⏸️ <b>Friction Override</b> — Build mindful browsing habits with intentional pauses",
        "📊 <b>Gamified Progress Tracking</b> — Stay motivated with streaks, insights, and achievements",
    ]

    for feature in features:
        story.append(Paragraph(feature, styles["ListItem"]))

    story.append(Spacer(1, 0.3 * inch))
    story.append(
        Paragraph(
            '<b>Install Focused Room today</b> → <link href="https://chrome.google.com/webstore" color="#7A9E9F">chrome.google.com/webstore</link>',
            ParagraphStyle(
                name="CTA",
                parent=styles["BodyTextCustom"],
                fontSize=13,
                alignment=TA_CENTER,
                textColor=PRIMARY_DARK,
                fontName="Helvetica-Bold",
            ),
        )
    )

    # Footer with metadata
    story.append(Spacer(1, 1 * inch))
    story.append(
        Paragraph(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            ParagraphStyle(name="Line", alignment=TA_CENTER, textColor=BORDER_COLOR, fontSize=8),
        )
    )
    story.append(
        Paragraph(
            f"Report ID: {result_id if result_id else 'N/A'} | Generated by Focused Room<br/>"
            "Questions? Email support@focusedroom.com",
            ParagraphStyle(
                name="Footer",
                fontSize=9,
                alignment=TA_CENTER,
                textColor=TEXT_MUTED,
                spaceAfter=0,
            ),
        )
    )

    # Build and finalize PDF
    doc.build(story)

    # Return bytes
    buffer.seek(0)
    return buffer.getvalue()


def generate_simple_text_report(
    email: str, scores: dict[str, float], percentiles: dict[str, float], suggestions: str
) -> str:
    """
    Generate a simple text report as fallback if PDF generation fails.

    Args:
        email: User's email address
        scores: Dictionary of personality scores (0-100 scale)
        percentiles: Dictionary of personality percentiles
        suggestions: AI-generated personality insights

    Returns:
        str: Plain text report suitable for email body
    """
    trait_names = {
        "openness": "Openness to Experience",
        "conscientiousness": "Conscientiousness",
        "extraversion": "Extraversion",
        "agreeableness": "Agreeableness",
        "neuroticism": "Emotional Stability",
    }

    report = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BIG FIVE PERSONALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: {email}
Date: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR PERSONALITY SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""

    for trait, name in trait_names.items():
        score = scores.get(trait, 0)
        pct = percentiles.get(trait, 0)

        # Invert neuroticism to emotional stability
        if trait == "neuroticism":
            score = 100 - score
            pct = 100 - pct

        report += f"{name}: {score:.0f}/100 ({pct:.0f}th percentile)\n"

    report += f"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI-POWERED INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{suggestions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
READY TO TRANSFORM YOUR PRODUCTIVITY?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Install the Focused Room Chrome extension and build a productivity
system that works with your unique personality, not against it.

Visit: https://focusedroom.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report generated by Focused Room | support@focusedroom.com
"""

    return report
