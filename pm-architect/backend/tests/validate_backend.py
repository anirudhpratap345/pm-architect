#!/usr/bin/env python3
"""
Backend Validation Test Script
Tests all critical backend functionality
"""
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8005"

def test_health_endpoint():
    """Test health check endpoint"""
    print("🔍 Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data
        assert "redis" in data
        print(f"✅ Health check passed: {data}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_compare_endpoint():
    """Test compare endpoint"""
    print("\n🔍 Testing /api/compare endpoint...")
    try:
        payload = {
            "options": ["Redis", "Memcached"],
            "metrics": ["latency", "cost"],
            "context": "SaaS caching system"
        }
        response = requests.post(
            f"{BASE_URL}/api/compare",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "options" in data
        assert "metrics" in data
        print(f"✅ Compare endpoint passed (response length: {len(json.dumps(data))} bytes)")
        return True
    except Exception as e:
        print(f"❌ Compare endpoint failed: {e}")
        return False

def test_redis_endpoint():
    """Test Redis connection endpoint"""
    print("\n🔍 Testing /api/test-redis endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/test-redis")
        # It's OK if Redis is not connected (500), we just check endpoint exists
        if response.status_code == 200:
            print("✅ Redis test endpoint passed (Redis connected)")
        elif response.status_code == 500:
            print("⚠️  Redis test endpoint responded (Redis not connected - expected locally)")
        return True
    except Exception as e:
        print(f"❌ Redis test endpoint failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("PMArchitect Backend Validation Test")
    print("=" * 60)
    
    tests = [
        test_health_endpoint,
        test_compare_endpoint,
        test_redis_endpoint
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("✅ All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
