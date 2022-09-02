from core import Singleton


class MySingleton(metaclass=Singleton):
    def __init__(self) -> None:
        self.value = 666

def test_same_object():
    a = MySingleton()
    assert a.value == 666

    b = MySingleton()
    assert b.value == 666

    b.value = 42
    assert a.value == 42
    assert b.value == 42
    
