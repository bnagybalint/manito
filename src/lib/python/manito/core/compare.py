from typing import List, Tuple

def objects_equal(obj1: object, obj2: object, exclude: List[str] = None) -> bool:
    """Checks equality between two objects by fields/attrs.

    Two objects are considered equal iff:
    - they are of the same class/type
    - they have the exact same attributes
    - all their attributes are equal by type and value as well

    Parameters
    ----------
    obj1 : object
        Object to check
    obj2 : object
        Object to check against
    exclude : List[str], optional
        Exclude these attributes from the comparison.

    Returns
    -------
    True if the objects are equal, false otherwise.
    """
    if type(obj1) != type(obj2):
        return False

    attrs = set(vars(obj1)) | set(vars(obj2))
    equal = True
    missing = object()
    for key in attrs:
        a = getattr(obj1, key, missing)
        b = getattr(obj2, key, missing)

        if a is missing or b is missing or a != b:
            if key not in exclude:
                equal = False

    return equal
    
