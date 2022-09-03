from db.entities import User

def create_dummy_users(num_users):
    return [User(
        name="Some Body #{i}",
        email="s{i}@b.com",
        password_hash="abcdef"
    ) for i in range(1, num_users + 1)]
