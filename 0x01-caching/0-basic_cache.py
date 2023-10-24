#!/usr/bin/env python3
"""
This module defines a basic caching class, `BasicCache`, that is derived
from the `BaseCaching` class. It provides basic caching functionality
for storing and retrieving key-value pairs.
"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """BasicCache class"""
    def put(self, key, item):
        """Store an item in the cache associated with a given key."""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """Retrieve an item from the cache associated with a given key."""
        if key in self.cache_data:
            return self.cache_data[key]
        else:
            return None
