#!/usr/bin/env python3
"""
This module defines a server class for paginating a database
of popular baby names.
It also includes a function for calculating the start and end indices
of a page in a paginated dataset.
"""
import csv
import math
from typing import List, Tuple, Dict


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end indices for a specific page
    in a paginated data set.

    Args:
        page (int): The page number for which to calculate the indices.
        page_size (int): The number of items per page.

    Returns:
        Tuple[int, int]: A tuple containing the start and end indices.
        The start index is inclusive, and the end index is exclusive.

    Example:
        If page = 2 and page_size = 10, the function will return (10, 20)
        for the second page.

    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieve a specific page of baby names from the dataset.

        Args:
            page (int): The page number (1-based) for which to retrieve data.
            page_size (int): The number of baby names per page.

        Returns:
            List[List]: A list of lists representing the baby names
            on the specified page.

        """
        assert type(page) == int and type(page_size) == int and\
            page > 0 and page_size > 0

        data = self.dataset()
        try:
            index = index_range(page, page_size)
            return data[index[0]: index[1]]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """
        Retrieve data for a specific page in a paginated dataset
        and return it as a dictionary with pagination metadata.

        Args:
            page (int, optional): The page number (1-based) to retrieve
            data for. Defaults to 1.
            page_size (int, optional): The number of items per page.
            Defaults to 10.

        Returns:
            Dict: A dictionary containing the following pagination metadata:
                - "page_size": The number of items on the current page.
                - "page": The current page number.
                - "data": A list of items on the current page.
                - "next_page": The page number of the next page,
                or None if there is no next page.
            - "prev_page": The page number of the previous page,
            or None if the current page is the first page.
            - "total_pages": The total number of pages in the dataset.
        """
        total_records = self.dataset()
        page_data = self.get_page(page, page_size)
        total_pages = math.ceil(len(total_records) / page_size)
        if page_data == []:
            page_size = 0
        next_page = page + 1 if page + 1 <= total_pages else None
        prev_page = page - 1 if page > 1 else None

        new_dict = {
            "page_size": len(page_data),
            "page": page,
            "data": page_data,
            "next_page": next_page,
            "prev_page": prev_page,
            "total_pages": total_pages
        }
        return new_dict
