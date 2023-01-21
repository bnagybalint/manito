import pytest

from manito.core import URL

def test_all():
    assert str(URL(scheme="a", username="b", password="c", host="d", port=3, path="f/g/h", query={"i":"j", "k":"l"})) == "a://b:c@d:3/f/g/h?i=j&k=l"

def test_scheme():
    assert str(URL(scheme="a", host="d")) == "a://d"

    with pytest.raises(Exception):
        str(URL(host="d")), "Missing scheme is an error"
    with pytest.raises(Exception):
        str(URL(scheme=None, host="d")), "Missing scheme is an error"
    with pytest.raises(Exception):
        str(URL(scheme="", host="d")), "Empty scheme is an error"
    with pytest.raises(Exception):
        str(URL(scheme="a://", host="d")), "Scheme can not contain the separator"

    # TODO check URL unsafe

def test_host():
    assert str(URL(scheme="a", host="d")) == "a://d"

    with pytest.raises(Exception):
        str(URL(scheme="a")), "Missing host is an error"
    with pytest.raises(Exception):
        str(URL(scheme="a", host=None)), "Missing host is an error"
    with pytest.raises(Exception):
        str(URL(scheme="a", host="")), "Empty host is an error"
    with pytest.raises(Exception):
        str(URL(scheme="a", host="b/")), "Host can not contain the separator"

    # TODO check URL unsafe

def test_auth():
    assert str(URL(scheme="a", host="d")) == "a://d", "Missing auth is not an error"
    assert str(URL(scheme="a", username="b", password="c", host="d")) == "a://b:c@d"

    assert str(URL(scheme="a", username="b", password=None, host="d")) == "a://b@d", "Unspecified password should not be present"
    assert str(URL(scheme="a", username="b", password="", host="d")) == "a://b@d", "Unspecified password should not be present"

    with pytest.raises(Exception):
        str(URL(scheme="a", username=None, password="c", host="d")), "Username must be defined if password was given"
    with pytest.raises(Exception):
        str(URL(scheme="a", username="", password="c", host="d")), "Username must be defined if password was given"

    # TODO check URL unsafe

def test_port():
    assert str(URL(scheme="a", host="d")) == "a://d", "Missing port is not an error"
    assert str(URL(scheme="a", host="d", port=None)) == "a://d", "Missing port is not an error"

    assert str(URL(scheme="a", host="d", port=3)) == "a://d:3"
    assert str(URL(scheme="a", host="d", port=123456789)) == "a://d:123456789", "We do not check if port ranges are obeyed."

def test_path():
    assert str(URL(scheme="a", host="d", port=80)) == "a://d:80", "Missing path is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", port=80, path=None)) == "a://d:80", "Missing path is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", port=80, path="")) == "a://d:80", "Missing path is not an error and is not included in the URL"

    assert str(URL(scheme="a", host="d", port=80, path="fff")) == "a://d:80/fff"
    assert str(URL(scheme="a", host="d", port=80, path="fff/ggg/hhh")) == "a://d:80/fff/ggg/hhh"

    # TODO check URL unsafe

def test_query():
    assert str(URL(scheme="a", host="d")) == "a://d", "Missing query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", port=80)) == "a://d:80", "Missing query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", path="fff")) == "a://d/fff", "Missing query is not an error and is not included in the URL"

    assert str(URL(scheme="a", host="d", query=None)) == "a://d", "Missing query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", port=80, query=None)) == "a://d:80", "Missing query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", path="fff", query=None)) == "a://d/fff", "Missing query is not an error and is not included in the URL"

    assert str(URL(scheme="a", host="d", query={})) == "a://d", "Empty query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", port=80, query={})) == "a://d:80", "Empty query is not an error and is not included in the URL"
    assert str(URL(scheme="a", host="d", path="fff", query={})) == "a://d/fff", "Empty query is not an error and is not included in the URL"

    assert str(URL(scheme="a", host="d", query={"i":"j"})) == "a://d?i=j"
    assert str(URL(scheme="a", host="d", port=80, query={"i":"j"})) == "a://d:80?i=j"
    assert str(URL(scheme="a", host="d", path="fff", query={"i":"j"})) == "a://d/fff?i=j"

    assert str(URL(scheme="a", host="d", query={"i":"j", "k":"l"})) == "a://d?i=j&k=l"
    assert str(URL(scheme="a", host="d", port=80, query={"i":"j", "k":"l"})) == "a://d:80?i=j&k=l"
    assert str(URL(scheme="a", host="d", path="fff", query={"i":"j", "k":"l"})) == "a://d/fff?i=j&k=l"
    
    # TODO check URL unsafe

