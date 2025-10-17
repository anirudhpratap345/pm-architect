import json
import os
import threading
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

# Minimal, file-based decision persistence for Phase 5-Lite
# - No DB, no Redis
# - Stores data in backend/app/data/decisions.json

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DATA_FILE = os.path.join(DATA_DIR, 'decisions.json')

_file_lock = threading.Lock()


def _ensure_store_initialized() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False)


def _read_all() -> List[Dict[str, Any]]:
    _ensure_store_initialized()
    with _file_lock:
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
                return []
        except json.JSONDecodeError:
            # Corrupted file: reset to empty list
            return []
        except FileNotFoundError:
            return []


def _write_all(items: List[Dict[str, Any]]) -> None:
    _ensure_store_initialized()
    with _file_lock:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, separators=(',', ':'), indent=0)


def _normalize_decision(decision: Dict[str, Any]) -> Dict[str, Any]:
    # Guarantee required fields
    normalized = dict(decision or {})
    if 'id' not in normalized or not normalized['id']:
        normalized['id'] = str(uuid.uuid4())
    if 'timestamp' not in normalized or not isinstance(normalized['timestamp'], (int, float)):
        normalized['timestamp'] = int(time.time())
    # Common top-level fields expected by UI
    normalized['left'] = normalized.get('left') or normalized.get('optionA') or normalized.get('titleLeft') or 'Option A'
    normalized['right'] = normalized.get('right') or normalized.get('optionB') or normalized.get('titleRight') or 'Option B'
    # Ensure types
    if 'metrics' not in normalized or not isinstance(normalized['metrics'], dict):
        normalized['metrics'] = {}
    if 'evidence' not in normalized or not isinstance(normalized['evidence'], list):
        normalized['evidence'] = []
    if 'confidence' not in normalized:
        normalized['confidence'] = 'medium'
    return normalized


def save_decision(decision: Dict[str, Any]) -> Dict[str, Any]:
    """Append a decision to the store, generating id/timestamp if missing."""
    item = _normalize_decision(decision)
    items = _read_all()
    items.append(item)
    _write_all(items)
    return item


def get_all_decisions() -> List[Dict[str, Any]]:
    """Return all decisions sorted by timestamp desc."""
    items = _read_all()
    try:
        return sorted(items, key=lambda x: x.get('timestamp', 0), reverse=True)
    except Exception:
        return items


def get_decision_by_id(decision_id: str) -> Optional[Dict[str, Any]]:
    if not decision_id:
        return None
    for item in _read_all():
        if str(item.get('id')) == str(decision_id):
            return item
    return None


def delete_decision(decision_id: str) -> bool:
    items = _read_all()
    new_items = [it for it in items if str(it.get('id')) != str(decision_id)]
    if len(new_items) == len(items):
        return False
    _write_all(new_items)
    return True


