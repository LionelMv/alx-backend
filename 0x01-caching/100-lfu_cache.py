#!/usr/bin/env python3
"""
This module defines a caching class, `LFUCache`, that is derived
from the `BaseCaching` class. It provides LFU caching functionality
for storing, retrieving and deleting key-value pairs.
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFUCache Class"""
    def __init__(self):
        """Initialize class instance"""
        super().__init__()
        self.cache_data_list = []  # List to store keys
        self.frequency_counter = {}  # Dict to store the frequency of each key

    def put(self, key, item):
        """Store an item in the cache using LFU algorithm"""

        # Check if key or item is missing, and return early if either is None
        if not key or not item:
            return

        if key in self.cache_data:
            # Key exists in the cache, remove it from the list
            # and increment its frequency
            self.cache_data_list.remove(key)
            self.frequency_counter[key] += 1
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                # The cache is full, discard the least frequently used item
                self.discard_lfu()
            # Initialize the frequency for a new key
            self.frequency_counter[key] = 1

        # Store the item in the cache data and add the key to the list
        self.cache_data[key] = item
        self.cache_data_list.append(key)
        # Uncomment these lines for debugging:
        # print(self.cache_data_list)
        # print(self.frequency_counter)

    def discard_lfu(self):
        """Discard the least frequently used item (LFU algorithm)"""

        if self.cache_data_list:
            # Find the key with the minimum frequency using the min function
            min_freq_key = min(self.cache_data_list,
                               key=lambda key: self.frequency_counter[key])
            # Uncomment these lines for debugging:
            # print(min_freq_key)
            # print(self.frequency_counter)

            # Remove the least frequently used key from the list
            # and delete it from the cache
            self.cache_data_list.remove(min_freq_key)
            self.cache_data.pop(min_freq_key)
            self.frequency_counter.pop(min_freq_key)
            print(f"DISCARD: {min_freq_key}")

    def get(self, key):
        """Retrieve an item from the cache by key"""
        if key:
            if key in self.cache_data:
                # Increase the frequency count for the key when retrieved
                self.frequency_counter[key] += 1

                # Move the key to the end of the list (most recently used)
                self.cache_data_list.remove(key)
                self.cache_data_list.append(key)

                return self.cache_data[key]
        return None
