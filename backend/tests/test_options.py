from fastapi.testclient import TestClient
from backend.app.main import app


client = TestClient(app)


def test_get_categories():
    r = client.get("/api/options/categories")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert "frontend" in data


def test_get_presets():
    r = client.get("/api/options/presets")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert "frontend" in data


def test_get_techs_all():
    r = client.get("/api/options/techs")
    assert r.status_code == 200
    techs = r.json()
    assert isinstance(techs, list)
    assert any(t["id"] == "react" for t in techs)


def test_get_techs_category_filter():
    r = client.get("/api/options/techs", params={"category": "frontend"})
    assert r.status_code == 200
    techs = r.json()
    assert all("frontend" in t["categories"] for t in techs)


def test_get_techs_search_filter():
    r = client.get("/api/options/techs", params={"search": "react"})
    assert r.status_code == 200
    techs = r.json()
    assert any("react" in t["slug"] or "react" in t["name"].lower() for t in techs)


def test_debug_endpoint():
    r = client.get("/api/options/debug")
    assert r.status_code == 200
    data = r.json()
    assert "categories" in data and isinstance(data["categories"], list)
    assert "presets" in data and isinstance(data["presets"], list)
    assert "tech_count" in data and isinstance(data["tech_count"], int)

