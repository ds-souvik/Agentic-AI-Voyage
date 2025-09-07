#!/usr/bin/env python3
"""
Simple icon generator for DistractionKiller Chrome Extension
Creates basic PNG icons using Python's built-in libraries
"""

import base64
import os

def create_simple_icon(size):
    """Create a simple icon as a base64-encoded PNG"""
    # This is a minimal 1x1 pixel PNG with the target color
    # In a real implementation, you'd use PIL or another image library
    
    # For now, let's create a simple colored square
    # This is a basic approach - for production, use proper image libraries
    
    # Create a simple SVG and convert to PNG would be better
    # But for now, let's create a minimal PNG
    
    # Minimal PNG header for a 1x1 red pixel
    png_data = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    )
    
    return png_data

def main():
    """Generate all required icon files"""
    print("Creating DistractionKiller icons...")
    
    # Ensure icons directory exists
    os.makedirs('icons', exist_ok=True)
    
    # Create icon files
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        filename = f'icons/icon{size}.png'
        
        # For now, create a simple file
        # In production, you'd generate proper PNG files
        with open(filename, 'wb') as f:
            # Write a minimal PNG
            f.write(create_simple_icon(size))
        
        print(f"Created {filename}")
    
    print("\nIcons created! You can now load the extension.")
    print("\nNote: These are placeholder icons. For production, use proper image generation tools.")
    print("You can also use the generate_icons.html file to create better icons.")

if __name__ == "__main__":
    main()
