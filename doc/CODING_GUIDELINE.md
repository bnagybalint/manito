# General rules

## Data formats

1. Datetime values in databases should be defined in UTC time standard.
1. Datetime values in exchange formats (API response, file data, etc.) should be defined in UTC time standard.

# Language-specific rules

## Python

### Packages

1. Packages should use `__init__.py` files to explicitly publish functionality.
    
    **Motivation**: This makes the public interface of the package clear.

### Imports

1. Always use absolute imports.
1. Only import symbols from an other package's public interface (`__init__.py`).
    ```Python
    # foo/baz/something.py
    from foo.bar import FooBar # good
    from foo.bar.foobar import FooBar # BAD
    ```

    **Motivation**: Using individual modules of a different package might circumvent the paskage's public interface and access implementation details.

1. Use common abbreviations for thirdparty packages:
    ``` Python
    import datetime as dt
    import numpy as np
    import pandas as pd
    ```

1. Sort import statements to standard/thirdparty libraries before other imports. It is also recommended to put an empty line between these groups.
1. Sort `import X` style statements before `from X import Y` style statements.

### Style

1. Use `PascalCase` for class names and other type names.
1. Use `snake_case` for method and function names.
1. Use `snake_case` for function-local and class member variable names.
1. Use `CONSTANT_CASE` for global variables and enum values.
1. Use `snake_case` for package and module names.


## Javascript/Typescript

### Style

1. Use `PascalCase` for class names and other type names. 
1. Use `camelCase` for method names.
1. Use `camelCase` for function-local and class member variable names.
1. Use `CONSTANT_CASE` for global variables and enum values.

## JSON

### Style

1. Use `camelCase` for path elements.
1. Use `camelCase` for operation identifiers (e.g. last path element in POST requests).
1. Use `camelCase` for query elements.
1. Use `camelCase` for JSON attributes.

## Databases

### Style

1. Use singular case for database table names.
1. Use `snake_case` for database table names.
1. Use `snake_case` for database column names.

### Naming

1. Foreign key columns should use the suffix `_id`.

# API design

### Endpoints

#### Returning details for a specific item

* Use the style: `GET /resouce/{id}`.
* For items with multiple unique key, use subpaths for the different keys:
    - `GET /resouce/byId/{id}`
    - `GET /resouce/byName/{name}`

#### Listing all items

* Use the style: `GET /resources`. Note the plural.
* For querying items associated with a specific other item, use sub-paths: `GET /resource/{id}/subResources`.

#### Searching items

* Use search operation with a request body encoding the search parameters: `POST /resouce/search`.

    **Motivation**: Certain types (e.g. lists) can be difficult to encode neatly in query parameters.
    
    **Exception**: For endpoints where URL-sharing makes sense, search parameters should be passed as query parameters instead: `GET /resources?type=something`
    
#### Creating objects

* Use a create POST operation: `POST /resouce/create`.
    
#### Creating objects

* Use the DELETE HTTP method: `DELETE /resouce/{id}`.
