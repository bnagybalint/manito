from db.connection import ConnectionManager
from db.entities import Wallet
from model.wallet import WalletApiModel
from model.basic_error import BasicErrorApiModel
from model.utils import serialize_response
from model.api_response import ApiResponse


@serialize_response()
def get_wallet(wallet_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(Wallet).get(wallet_id)

    if user is None:
        return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}."), 404

    return WalletApiModel.from_entity(user), 200