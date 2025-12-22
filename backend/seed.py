from app import app, db, Location, Package

with app.app_context():
    db.create_all()

    # Seed Locations
    locations = [
        Location(
            id="loc_nursery_001",
            name="Forest of Central Asia",
            description="Питомник в Шортандинском районе",
            area_hectares=83,
            coordinates="51.2345, 70.1234",
            image_url="/images/forest-central-asia-aerial.jpg",
            status="active",
            capacity_trees=5000,
            planted_trees=3250
        ),
        Location(
            id="loc_karaganda_002",
            name="Mukhatay Ormany",
            description="Проект лесовосстановления в Карагандинской области",
            area_hectares=25000,
            coordinates="49.8012, 73.1089",
            image_url="/images/mukhatay-ormany-landscape.jpg",
            status="active",
            capacity_trees=150000,
            planted_trees=42500
        )
    ]

    for location in locations:
        db.session.add(location)

    # Seed Packages
    packages = [
        Package(
            id="pkg_single",
            name="1 дерево",
            tree_count=1,
            price=999,
            description="Идеально для начала",
            popular=False
        ),
        Package(
            id="pkg_small",
            name="10 деревьев",
            tree_count=10,
            price=9990,
            description="Небольшой пакет",
            popular=True
        ),
        Package(
            id="pkg_medium",
            name="50 деревьев",
            tree_count=50,
            price=49950,
            description="Средний пакет",
            popular=False
        ),
        Package(
            id="pkg_large",
            name="100 деревьев",
            tree_count=100,
            price=99900,
            description="Крупный пакет",
            popular=False
        )
    ]

    for package in packages:
        db.session.add(package)
    
    db.session.commit()

print("Database seeded successfully!")
