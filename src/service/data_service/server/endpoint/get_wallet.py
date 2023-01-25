from manito.db import ConnectionManager
from manito.db.entities import Wallet
from data_service.api_utils import serialize_response
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    WalletApiModel,
)


@serialize_response()
def get_wallet(wallet_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        wallet = db.query(Wallet).get(wallet_id)

    if wallet is None or wallet.deleted_at is not None:
        return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}."), 404

    return WalletApiModel.from_entity(wallet), 200