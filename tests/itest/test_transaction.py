import urllib
import datetime as dt

from manito.core import objects_equal

from data_service.model.transaction import TransactionApiModel
from data_service.model.transaction_search_params import TransactionSearchParamsApiModel

from itest.factory import DummyFactory
from itest.utils import (
    create_app_client,
    create_auto_auth_client,
    create_db_connection,
    purge_database,
)


SERVER_ASSIGNED_FIELDS = ["id", "creator", "created_at"]

class TestTransaction:
    @classmethod
    def setup_class(cls):
        cls.db_connection = create_db_connection()
        cls.original_app_client = create_app_client()

    def setup_method(self, method: str):
        purge_database(self.db_connection)
        self.dummy_factory = DummyFactory(self.db_connection)
        self.user_id = self.dummy_factory.create_user()
        self.jwt = self.dummy_factory.get_user_jwt(self.user_id)
        self.app_client = create_auto_auth_client(self.original_app_client, jwt=self.jwt)

        self.icon_id = self.dummy_factory.create_dummy_icon()
        self.category_id = self.dummy_factory.create_dummy_category(owner_id=self.user_id, icon_id=self.icon_id)
        self.bank_wallet_id = self.dummy_factory.create_dummy_wallet(
            owner_id=self.user_id,
            name="Main Wallet",
        )
        self.savings_wallet_id = self.dummy_factory.create_dummy_wallet(
            owner_id=self.user_id,
            name="Savings Wallet",
        )
        
        transactions = [
            {
                "time": dt.datetime.fromisoformat("2022-08-08T13:20:00"),
                "notes": "Salary",
                "amount": 5432,
                "dst_wallet_id": self.bank_wallet_id,
            },
            {
                "time": dt.datetime.fromisoformat("2022-08-12T19:45:15"),
                "notes": "Groceries",
                "amount": 13.51,
                "src_wallet_id": self.bank_wallet_id,
            },
            {
                "time": dt.datetime.fromisoformat("2022-08-31T12:30:00"),
                "notes": "Transfer savings",
                "amount": 1500,
                "src_wallet_id": self.bank_wallet_id,
                "dst_wallet_id": self.savings_wallet_id,
            },
        ]
        for t in transactions:
            self.dummy_factory.create_dummy_transaction(category_id=self.category_id, **t)

    def test_can_create_income_transaction(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [200]
        new_transaction = TransactionApiModel.from_json(r.json)
        assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
        assert new_transaction.id is not None
        assert new_transaction.created_at is not None

    def test_can_create_expense_transaction(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            dst_wallet_id=self.bank_wallet_id,
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [200]
        new_transaction = TransactionApiModel.from_json(r.json)
        assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
        assert new_transaction.id is not None
        assert new_transaction.created_at is not None

    def test_can_create_transfer_transaction(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            dst_wallet_id=self.savings_wallet_id,
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [200]
        new_transaction = TransactionApiModel.from_json(r.json)
        assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
        assert new_transaction.id is not None
        assert new_transaction.created_at is not None

    def test_can_create_transaction_with_notes(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            notes="Groceries",
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [200]
        new_transaction = TransactionApiModel.from_json(r.json)
        assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
        assert new_transaction.id is not None
        assert new_transaction.created_at is not None

    def test_create_transaction_should_fail_when_wallet_is_missing(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            # wallet intentionally omitted
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [400], "Request should be rejected if not wallet was defined"

    def test_create_transaction_should_fail_when_transferring_to_the_same_wallet(self) -> None:
        data = TransactionApiModel(
            amount=1000,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            dst_wallet_id=self.bank_wallet_id,
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [400], "Request should be rejected if the source and destination wallets are the same"

    def test_create_transaction_should_fail_on_invalid_amount(self) -> None:
        data = TransactionApiModel(
            amount=-666,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            category_id=self.category_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [400], "Request should be rejected if amount is invalid"

    def test_create_transaction_should_fail_on_missing_category(self) -> None:
        data = TransactionApiModel(
            amount=666,
            time=dt.datetime.now(),
            src_wallet_id=self.bank_wallet_id,
            category_id=None,
        )
        payload = data.to_json()
        r = self.app_client.post("/transaction/create", json=payload)

        assert r.status_code in [400], "Request should be rejected if category is missing"

    def test_cannot_delete_nonexisting_transaction(self) -> None:
        r = self.app_client.delete("/transaction/666")
        assert r.status_code in [404]

    def test_can_delete_existing_transaction(self) -> None:
        transaction_id = self.dummy_factory.create_dummy_transaction(
            category_id=self.category_id,
            src_wallet_id=self.bank_wallet_id,
        )

        r = self.app_client.delete(f"/transaction/{transaction_id}")
        assert r.status_code == 204

    def test_transaction_delete_is_idempotent(self) -> None:
        transaction_id = self.dummy_factory.create_dummy_transaction(
            category_id=self.category_id,
            src_wallet_id=self.bank_wallet_id,
        )

        r = self.app_client.delete(f"/transaction/{transaction_id}")
        assert r.status_code == 204

        r = self.app_client.delete(f"/transaction/{transaction_id}")
        assert r.status_code == 204

    def test_deleted_transaction_is_no_longer_accessible_via_get(self) -> None:
        transaction_id = self.dummy_factory.create_dummy_transaction(
            category_id=self.category_id,
            src_wallet_id=self.bank_wallet_id,
        )

        r = self.app_client.get(f"/transaction/{transaction_id}")
        assert r.status_code == 200

        r = self.app_client.delete(f"/transaction/{transaction_id}")
        assert r.status_code == 204

        r = self.app_client.get(f"/transaction/{transaction_id}")
        assert r.status_code == 404, "Deleted transaction should not be accessible anymore"

    def test_deleted_transaction_is_no_longer_returned_by_search(self) -> None:
        transaction_id = self.dummy_factory.create_dummy_transaction(
            category_id=self.category_id,
            src_wallet_id=self.bank_wallet_id,
        )

        r = self.app_client.post(f"/transaction/search", json={})
        assert r.status_code == 200
        assert transaction_id in [t["id"] for t in r.json]

        r = self.app_client.delete(f"/transaction/{transaction_id}")
        assert r.status_code == 204

        r = self.app_client.post(f"/transaction/search", json={})
        assert r.status_code == 200
        assert transaction_id not in [t["id"] for t in r.json], "Deleted transaction should not be returned"

    def test_cannot_get_wallet_details_for_nonexisting_wallet(self) -> None:
        r = self.app_client.get("/wallet/666")
        assert r.status_code in [404]

    def test_can_get_wallet_details(self) -> None:
        r = self.app_client.get(f"/wallet/{self.bank_wallet_id}")
        assert r.status_code in [200]

        wallet = r.json
        assert wallet["id"] == self.bank_wallet_id

    def test_cannot_list_transactions_for_nonexisting_wallet(self) -> None:
        r = self.app_client.get("/wallet/666/transactions")
        assert r.status_code in [404]

    def test_can_list_transactions_for_wallet(self) -> None:
        r = self.app_client.get(f"/wallet/{self.bank_wallet_id}/transactions")
        assert r.status_code in [200]
        transactions = r.json
        assert len(transactions) == 3, "One incoming, one outgoing transaction and one transfer between wallets"

        r = self.app_client.get(f"/wallet/{self.savings_wallet_id}/transactions")
        assert r.status_code in [200]
        transactions = r.json
        assert len(transactions) == 1, "One incoming transaction"

    def test_can_list_transactions_for_wallet_with_filtering(self) -> None:
        def check(from_date: str, to_date: str, expected_count: int):
            params = {}
            if from_date is not None:
                params["from_date"] = from_date
            if to_date is not None:
                params["to_date"] = to_date

            query = urllib.parse.urlencode(params)
            r = self.app_client.get(f"/wallet/{self.bank_wallet_id}/transactions?{query}")
            transactions = r.json
            assert len(transactions) == expected_count

        check(from_date="2022-08-01", to_date=None, expected_count=3)
        check(from_date="2022-08-08", to_date=None, expected_count=3)
        check(from_date="2022-08-09", to_date=None, expected_count=2)
        check(from_date="2022-08-31", to_date=None, expected_count=1)
        check(from_date="2022-09-01", to_date=None, expected_count=0)

        check(from_date=None, to_date="2022-08-01", expected_count=0)
        check(from_date=None, to_date="2022-08-08", expected_count=1)
        check(from_date=None, to_date="2022-08-09", expected_count=1)
        check(from_date=None, to_date="2022-08-31", expected_count=3)
        check(from_date=None, to_date="2022-09-01", expected_count=3)

        check(from_date="2022-08-01", to_date="2022-08-31", expected_count=3)
        check(from_date="2022-07-30", to_date="2022-09-01", expected_count=3)
        check(from_date="2022-08-11", to_date="2022-08-15", expected_count=1)

        check(from_date="2022-08-11", to_date="2022-10-01", expected_count=2)
        check(from_date="2022-01-01", to_date="2022-08-11", expected_count=1)

    def test_can_search_transactions_with_filters(self) -> None:
        def check(sp: TransactionSearchParamsApiModel, expected_count: int, message: str = ""):
            payload = sp.to_json()
            r = self.app_client.post("/transaction/search", json=payload)
            transactions = r.json
            assert len(transactions) == expected_count, message

        M = TransactionSearchParamsApiModel

        check(M(), expected_count=3, message="Empty search matches everything")

        check(M(start_date=dt.date.fromisoformat("2022-08-01")), expected_count=3)
        check(M(start_date=dt.date.fromisoformat("2022-08-08")), expected_count=3)
        check(M(start_date=dt.date.fromisoformat("2022-08-09")), expected_count=2)
        check(M(start_date=dt.date.fromisoformat("2022-08-31")), expected_count=1)
        check(M(start_date=dt.date.fromisoformat("2022-09-01")), expected_count=0)

        check(M(end_date=dt.date.fromisoformat("2022-08-01")), expected_count=0)
        check(M(end_date=dt.date.fromisoformat("2022-08-08")), expected_count=1)
        check(M(end_date=dt.date.fromisoformat("2022-08-09")), expected_count=1)
        check(M(end_date=dt.date.fromisoformat("2022-08-31")), expected_count=3)
        check(M(end_date=dt.date.fromisoformat("2022-09-01")), expected_count=3)

        check(M(start_date=dt.date.fromisoformat("2022-08-01"), end_date=dt.date.fromisoformat("2022-09-01")), expected_count=3)
        check(M(start_date=dt.date.fromisoformat("2022-08-11"), end_date=dt.date.fromisoformat("2022-08-15")), expected_count=1)
        check(M(start_date=dt.date.fromisoformat("2022-08-11"), end_date=dt.date.fromisoformat("2022-10-01")), expected_count=2)
        check(M(start_date=dt.date.fromisoformat("2022-01-01"), end_date=dt.date.fromisoformat("2022-08-11")), expected_count=1)

        check(M(wallet_id=self.bank_wallet_id), expected_count=3)
        check(M(wallet_id=self.savings_wallet_id), expected_count=1)

        check(M(min_amount=0), expected_count=3)
        check(M(min_amount=20), expected_count=2)
        check(M(min_amount=20_000), expected_count=0)

        check(M(max_amount=0), expected_count=0)
        check(M(max_amount=20), expected_count=1)
        check(M(max_amount=20_000), expected_count=3)

        check(M(min_amount=1000, max_amount=2000), expected_count=1)

        check(M(search_string=""), expected_count=3, message="Empty search matches everything, even transactions without a note")
        check(M(search_string="Groceries"), expected_count=1)
        check(M(search_string="groceries"), expected_count=1, message="Search is case-insensitive")
        check(M(search_string="er"), expected_count=2, message="Search can match parts")