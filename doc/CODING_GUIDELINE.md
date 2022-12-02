# General rules

## Data formats

1. Datetime values should be stored in UTC time standard, UTC+00:00 time zone. This rule applies to:
    - program variables, functions
    - databases and other data sources
    - application logs
    - exchange formats: API responses, file data, etc.

    **Motivation**: Somewhat lessens the pain that is handling time in software.

    **Exception**: In some situations, this constraint does not make sense (e.g. when displaying local time to the user). In those cases, this rule does not apply. However, naming should always reflect that other standard/time zone was used. Example:
    ```Python
    time_in_local = convert_to_local_time(transaction.created_at)
    ```

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
