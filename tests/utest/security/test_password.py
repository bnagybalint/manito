import pytest

from manito.security import (
    generate_password_salt,
    generate_salted_password_hash,
    verify_password,
)

@pytest.mark.parametrize("pw", [
    "",
    "abcde",
    "abc def",
    "aBcDe",
    "a1b2c3",
    "a1b2c3",
    "$%@.,:_",
    "Nan"*33,
])
def test_password_hashing(pw: str):
    for i in range(10):
        salt = generate_password_salt()

        hash = generate_salted_password_hash(pw, salt)
        assert verify_password(pw, salt, hash), f"Verification is broken with pw={pw}, salt={salt}"
