from __future__ import annotations

import os
import base64

from dataclasses import dataclass
from hashlib import sha256
from typing import Callable


@dataclass
class PasswordToken:
    hash: str
    salt: str

    @staticmethod
    def from_string(token_str: str) -> PasswordToken:
        hash, salt = token_str.split(':')
        return PasswordToken(hash=hash, salt=salt)

    def to_string(self) -> PasswordToken:
        return f"{self.hash}:{self.salt}"

def get_algorithm(name: str) -> Callable[[str], str]:
    if name == "sha256":
        return lambda x: sha256(x).hexdigest()

    raise RuntimeError(f"Unrecognized hashing algorithm: {name}")

def generate_password_salt(length: int = 32 ) -> str:
    """Generates a new random cryptographic salt for passwords.

    Parameters
    ----------
    length : int, optional
        Length of the salt in bytes.

    Returns
    -------
    str
        Salt, in text form.
    """
    return base64.b64encode(os.urandom(length)).decode()

def generate_salted_password_hash(password: str, salt: str, algorithm: str = "sha256") -> str:
    """Generates a salted password hash

    Parameters
    ----------
    password : str
        Raw password string
    salt : str
        Cryptographic salt used in the token
    algorithm : str, optional
        Hash algorithm to use. Accepted values are: 'sha256'

    Returns
    -------
    str
        The salted has of the password
    """

    hasher_fn = get_algorithm(algorithm)
    return hasher_fn(base64.b64decode(salt) + password.encode())

def verify_password(password: str, salt: str, expected_hash: str, algorithm: str = "sha256") -> bool:
    """Verify a password against a salted password token

    Parameters
    ----------
    password : str
        Password to verify
    salt : str
        Cryptographic salt used in hash
    expected_hash : PasswordToken
        Salted password hash to check against
    algorithm : str, optional
        Hash algorithm to use. Accepted values are: 'sha256'

    Returns
    -------
    bool
        True, if the password matches, false otherwise.
    """

    hasher_fn = get_algorithm(algorithm)
    hash = hasher_fn(base64.b64decode(salt) + password.encode())

    return hash == expected_hash
