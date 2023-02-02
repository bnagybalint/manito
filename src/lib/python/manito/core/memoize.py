import functools

def memoize(f: callable):
    @functools.wraps(f)
    @functools.lru_cache(maxsize=None)
    def impl(*args, **kwargs):
        return f(*args, **kwargs)
    return impl