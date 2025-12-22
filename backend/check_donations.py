from app import app, db, Donation, User

with app.app_context():
    # Get all donations
    donations = Donation.query.all()
    print(f'Total donations: {len(donations)}')

    # Count guest donations
    guest_donations = [d for d in donations if d.user_id is None]
    print(f'Guest donations: {len(guest_donations)}')

    # Count donations with email
    donations_with_email = [d for d in donations if d.email]
    print(f'Donations with email: {len(donations_with_email)}')

    # Show details of guest donations
    print("\nGuest donations details:")
    for donation in guest_donations:
        print(f"  ID: {donation.id}")
        print(f"  Email: {donation.email}")
        print(f"  Donor info: {donation.donor_info}")
        print(f"  Amount: {donation.amount}")
        print(f"  Status: {donation.status}")
        print("  ---")

    # Show details of user donations
    user_donations = [d for d in donations if d.user_id is not None]
    print(f"\nUser donations: {len(user_donations)}")
    for donation in user_donations[:3]:  # Show first 3
        user = User.query.get(donation.user_id)
        print(f"  ID: {donation.id}")
        print(f"  User: {user.full_name if user else 'Unknown'}")
        print(f"  Email: {user.email if user else 'Unknown'}")
        print(f"  Amount: {donation.amount}")
        print(f"  Status: {donation.status}")
        print("  ---")