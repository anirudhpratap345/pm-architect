import time
from collections import OrderedDict
from typing import Generic, Hashable, Optional, Tuple, TypeVar


K = TypeVar("K", bound=Hashable)
V = TypeVar("V")


class TTLCache(Generic[K, V]):
  def __init__(self, maxsize: int = 256, ttl_seconds: float = 3600.0):
    self.maxsize = maxsize
    self.ttl_seconds = ttl_seconds
    self._store: OrderedDict[K, Tuple[float, V]] = OrderedDict()

  def get(self, key: K) -> Optional[V]:
    now = time.time()
    item = self._store.get(key)
    if not item:
      return None
    expires_at, value = item
    if expires_at < now:
      # expired
      try:
        del self._store[key]
      except KeyError:
        pass
      return None
    # touch for LRU
    self._store.move_to_end(key)
    return value

  def set(self, key: K, value: V) -> None:
    now = time.time()
    expires_at = now + self.ttl_seconds
    self._store[key] = (expires_at, value)
    self._store.move_to_end(key)
    if len(self._store) > self.maxsize:
      # pop least recently used
      self._store.popitem(last=False)


