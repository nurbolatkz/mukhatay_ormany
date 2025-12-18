#!/usr/bin/env python
"""
Script to initialize locations in the database
"""

import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Location

def init_locations():
    """Initialize locations in the database"""
    with app.app_context():
        # Check if locations already exist
        existing_locations = Location.query.all()
        if existing_locations:
            print(f"Found {len(existing_locations)} existing locations:")
            for loc in existing_locations:
                print(f"  - {loc.id}: {loc.name}")
            return

        # Create locations
        locations = [
            Location(
                id='loc_nursery_001',
                name='Forest of Central Asia',
                description='Питомник в Шортандинском районе для выращивания и посадки саженцев с возможностью участия онлайн',
                area_hectares=83.0,
                coordinates='50.1234, 70.5678',
                image_url='/placeholder.svg',
                status='active',
                capacity_trees=10000,
                planted_trees=5000
            ),
            Location(
                id='loc_karaganda_001',
                name='Mukhatay Ormany',
                description='Масштабный проект лесовосстановления деградированных территорий в Карагандинской области',
                area_hectares=25000.0,
                coordinates='49.8333, 73.0833',
                image_url='/placeholder.svg',
                status='active',
                capacity_trees=500000,
                planted_trees=150000
            )
        ]

        print("Creating locations...")
        for location in locations:
            # Check if location already exists
            existing = Location.query.filter_by(id=location.id).first()
            if not existing:
                db.session.add(location)
                print(f"  Added: {location.id} - {location.name}")
            else:
                print(f"  Already exists: {location.id} - {location.name}")

        db.session.commit()
        print("Locations created successfully!")

        # List all locations
        all_locations = Location.query.all()
        print(f"\nTotal locations in database: {len(all_locations)}")
        for loc in all_locations:
            print(f"  - {loc.id}: {loc.name}")

if __name__ == '__main__':
    init_locations()