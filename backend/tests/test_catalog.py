from fastapi.testclient import TestClient
from backend.app.main import app


client = TestClient(app)


def test_categories():
    r = client.get("/api/categories")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and any(c["id"] == "frontend" for c in data)


def test_techs_basic_and_sorting():
    r = client.get("/api/techs")
    assert r.status_code == 200
    techs = r.json()
    assert isinstance(techs, list)
    # Popularity sorted desc
    pops = [t.get("popularity", 0) for t in techs]
    assert pops == sorted(pops, reverse=True)


def test_techs_category_filter_and_search():
    r = client.get("/api/techs", params={"category": "frontend", "search": "react"})
    assert r.status_code == 200
    techs = r.json()
    assert any(t["id"] == "react" for t in techs)
    assert all("frontend" in t["categories"] for t in techs)


def test_get_tech_by_id():
    r = client.get("/api/tech/react")
    assert r.status_code == 200
    assert r.json()["slug"] == "react"


def test_metric_templates():
    r = client.get("/api/metrics/templates")
    assert r.status_code == 200
    mts = r.json()
    assert any(m["metric_id"] == "maturity" for m in mts)


def test_tech_metrics_lazy():
    r = client.get("/api/tech/react/metrics")
    assert r.status_code == 200
    data = r.json()
    assert data["tech_id"] == "react"
    assert isinstance(data.get("metrics"), list)

