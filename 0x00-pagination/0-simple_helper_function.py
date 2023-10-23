#!/usr/bin/env python3
"""
This module defines a function for calculating the start and end indices
of a page in a paginated data set.
"""
from typing import Tuple


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
