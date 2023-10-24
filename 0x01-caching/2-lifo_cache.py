#!/usr/bin/env python3
"""
This module defines a caching class, `LIFOCache`, that is derived
from the `BaseCaching` class. It provides LIFO caching functionality
for storing, retrieving and deleting key-value pairs.
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFOCache Class"""
    def __init__(self):
        "Initialize class instance"
        super().__init__()
        self.cache_data_list = []

    def put(self, key, item):
        """
        Store an item in the cache associated with a given key.
        Does a LIFO if the number of dictionary items is bigger than MAX_ITEMS.
        """
        if key and item:
            self.cache_data[key] = item
            self.cache_data_list.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                discard = self.cache_data_list.pop(-2)
                self.cache_data.pop(discard)
                print(f"DISCARD: {discard}")

    def get(self, key):
        """Retrieve an item from the cache associated with a given key."""
        if key in self.cache_data:
            return self.cache_data[key]
        else:
            return None
