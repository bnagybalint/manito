import functools

def memoize(f: callable):
    """ Decorator that caches function call results.

    Parameters
    ----------
    f : callable
        Function to decorate
    """

    @functools.wraps(f)
    @functools.lru_cache(maxsize=None)
    def impl(*args, **kwargs):
        return f(*args, **kwargs)
    return impl