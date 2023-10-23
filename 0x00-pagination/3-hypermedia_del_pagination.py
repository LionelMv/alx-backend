#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Retrieve a range of data from an indexed dataset based on
        the provided index and return it as a dictionary
        with pagination metadata.

        Args:
            index (int, optional): The starting index from which to retrieve
            data. Defaults to None.
            page_size (int, optional): The number of items to retrieve.
            Defaults to 10.

        Returns:
            Dict: A dictionary containing the following pagination metadata:
            - "index": The starting index from which data was retrieved.
            - "page_size": The number of items retrieved.
            - "data": A list of items retrieved based on the index
            and page size.
            - "next_index": The index of the next page of data,
            or None if there is no next page.
        """
        dataset = self.indexed_dataset()
        dataset_length = len(dataset)
        assert type(index) == int and type(page_size) == int and\
            index >= 0 and index < dataset_length

        data = []
        next_index = index + page_size
        for i in range(index, min(next_index, dataset_length)):
            if i in dataset:
                data.append(dataset[i])

        new_dict = {
            "index": index,
            "page_size": page_size,
            "data": data,
            "next_index": next_index
        }
        return new_dict
