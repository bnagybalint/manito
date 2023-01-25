class Singleton(type):
    """Base metaclass that implements the singleton pattern.

    Usage:
    ```
        class MySingleton(metaclass=Singleton):
            pass
        ...
        instance = MySingleton()
    ```

    Use with care.
    """

    _instance_by_class = {}

    def __call__(cls, *args, **kwargs):
        # TODO check if this is thread-safe
        if cls not in cls._instance_by_class:
            cls._instance_by_class[cls] = super(Singleton,
                                                cls).__call__(*args, **kwargs)

        return cls._instance_by_class[cls]
