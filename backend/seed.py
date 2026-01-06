from app import app, db, Location, Package, News

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
        ),
        Package(
            id="custom",
            name="Пользовательский выбор",
            tree_count=0,  # Will be overridden by actual tree count
            price=0,      # Will be calculated based on tree count
            description="Пользователь выбрал количество деревьев самостоятельно",
            popular=False
        )
    ]

    for package in packages:
        db.session.add(package)
    
    # Seed News
    news = [
        News(
            id="news_001",
            title="Открыт новый лесной участок в Карагандинской области",
            content="Мы рады сообщить о начале проекта по восстановлению лесов в Карагандинской области. Участок площадью 25 000 гектаров будет восстановлен за 5 лет с использованием современных методов посадки и ухода за деревьями.",
            image_url="/images/news-forest-planting.jpg",
            author="Администрация проекта",
            category="general",
            published=True
        ),
        News(
            id="news_002",
            title="Более 1000 деревьев посажено за месяц",
            content="Благодаря щедрой поддержке наших доноров, мы смогли посадить более 1000 деревьев в рамках текущего сезона. Это важный шаг на пути к восстановлению экосистемы региона.",
            image_url="/images/news-thousand-trees.jpg",
            author="Администрация проекта",
            category="success",
            published=True
        ),
        News(
            id="news_003",
            title="Новый партнер присоединился к проекту",
            content="Мы рады приветствовать нового корпоративного партнера, который поддержит наш проект по лесовосстановлению на сумму 500 000 тенге в этом году.",
            image_url="/images/news-partner-join.jpg",
            author="Администрация проекта",
            category="partnership",
            published=True
        )
    ]
    
    for news_item in news:
        db.session.add(news_item)
    
    db.session.commit()

print("Database seeded successfully!")
