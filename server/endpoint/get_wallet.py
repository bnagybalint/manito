from db.connection import ConnectionManager
from db.entities import Wallet
from model.wallet import WalletApiModel
from model.basic_error import BasicErrorApiModel


def get_wallet(wallet_id: int):
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(Wallet).get(wallet_id)

    if user is None:
        return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}.").to_json(), 404

    return WalletApiModel.from_entity(user).to_json(), 200