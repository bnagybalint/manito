import os
import datetime as dt
import jwt

from manito.db import Connection
from manito.db.entities import (
    Category,
    Icon,
    Transaction,
    User,
    Wallet,
)
from manito.security import (
    generate_password_salt,
    generate_salted_password_hash,
    PasswordToken,
)


class DummyFactory:
    def __init__(self, db_connection: Connection) -> None:
        self.db_connection = db_connection
        self.current_user_id: int = None

    def set_current_user(self, user_id: int) -> None:
        """ Set current identity that will be used as creator user for entities

        Parameters
        ----------
        user_id : int
            User ID to use as creator for subsequent factory operations.
        """
        self.current_user_id = user_id

    def create_user(self, name: str = "dummy", email: str = "dummy@dummy.com", password: str = "dummy", **kwargs) -> int:
        """ Creates a user in the database. To simplify tests, it also sets this user as current identity (see DummyFactory.set_current_user)
        """
        with self.db_connection.create_session() as db:
            salt = generate_password_salt()
            hash = generate_salted_password_hash(password, salt)
            pw_token = PasswordToken(hash=hash, salt=salt)

            user = User(
                name=name,
                password_hash=pw_token.to_string(),
                email=email,
                **kwargs,
            )

            db.add(user)
            db.commit()

            if self.current_user_id is None:
                self.current_user_id = user.id

            return user.id

    def get_user_jwt(self, id: int) -> str:
        with self.db_connection.create_session() as db:
            user = db.query(User).get(id)

            jwt_signing_key = os.environ["JWT_SIGNING_KEY"]

            jwt_token =  jwt.encode(
                payload={
                    "userId": user.id,
                    "exp": dt.datetime.utcnow() + dt.timedelta(minutes=24*60)
                },
                key=jwt_signing_key,
                algorithm="HS256",
            )

            return jwt_token

    def create_dummy_icon(self, name: str = "TestIcon", image_url: str = "www.dummy.hu/dummy.png", **kwargs) -> int:
        with self.db_connection.create_session() as db:
            icon = Icon(
                name=name,
                image_url=image_url,
                **kwargs,
            )
            db.add(icon)
            db.commit()
            return icon.id

    def create_dummy_category(self, owner_id: int, icon_id: int, icon_color: str = "ffffff", name: str = "TestCategory", **kwargs) -> int:
        with self.db_connection.create_session() as db:
            category = Category(
                name=name,
                owner_id=owner_id,
                icon_id=icon_id,
                icon_color=icon_color,
                creator_id=self.current_user_id,
                **kwargs,
            )
            db.add(category)
            db.commit()
            return category.id

    def create_dummy_wallet(self, owner_id: int, name: str = "TestWallet", **kwargs) -> int:
        with self.db_connection.create_session() as db:
            wallet = Wallet(
                name=name,
                owner_id=owner_id,
                creator_id=self.current_user_id,
                **kwargs,
            )
            db.add(wallet)
            db.commit()
            return wallet.id

    def create_dummy_transaction(self, category_id: int, amount: float = 1234.0, time: dt.datetime = dt.datetime.now(), src_wallet_id: int = None, dst_wallet_id: int = None, **kwargs) -> int:
        with self.db_connection.create_session() as db:
            transaction = Transaction(
                amount=amount,
                time=time,
                category_id=category_id,
                src_wallet_id=src_wallet_id,
                dst_wallet_id=dst_wallet_id,
                creator_id=self.current_user_id,
                **kwargs,
            )
            db.add(transaction)
            db.commit()
            return transaction.id
