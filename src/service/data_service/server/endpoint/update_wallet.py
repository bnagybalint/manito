from manito.db import ConnectionManager
from manito.db.entities import Wallet
from data_service.decorators import (
    jwt_authenticate,
    deserialize_body,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    WalletApiModel,
)


@jwt_authenticate()
@deserialize_body(WalletApiModel)
@serialize_response()
def update_wallet(wallet_id: int, body: WalletApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        if body.id is not None and wallet_id != body.id:
            return BasicErrorApiModel(message=f"ID in body ({body.id}) and in path ({wallet_id}) does not match."), 400

        wallet: Wallet = db.query(Wallet).get(wallet_id)
        if wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}."), 404

        wallet.name = body.name
        wallet.owner_id = body.owner_id

        db.add(wallet)
        db.commit()

        return WalletApiModel.from_entity(wallet), 200
