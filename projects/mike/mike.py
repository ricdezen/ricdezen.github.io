from browser import document, timer
import itertools
import random

# POINTS[x] = how many points a score of x is worth.
POINTS = {
    7: -4,
    8: -2,
    9: -1,
    10: 0,
    11:	1,
    12:	2,
    13:	3,
    14:	5,
    15:	7,
    16:	10,
    17:	13,
    18:	17
}


def alloc_to_stats(alloc: list) -> list:
    stats = []
    for i, x in enumerate(alloc):
        for _ in range(x):
            stats.append(i + 7)
    return stats


def eval_alloc(alloc: list) -> int:
    # Return how many points an allocation is worth.
    # An allocation is, instead of the list of stats, a vector in which
    # alloc[i] is how many stats have value i + 7.
    return sum(POINTS[i + 7] * x for i, x in enumerate(alloc))


def enumerate_sub(depth: int, already: int):
    # Already have 6 stats.
    if already > 5:
        # print(f"More than 5 stats at depth: {depth}")
        return [[0] * depth]
    # Last value in the sequence (12 possible values).
    if depth == 1:
        # print(f"Bottom, already={already}: {[[x] for x in range(7-already)]}")
        return [[x] for x in range(7-already)]
    # Enumerate remaining stats.
    result = []
    for how_many in range(7 - already):
        sub_enum = enumerate_sub(depth - 1, how_many + already)
        for s in sub_enum:
            result.append([how_many]+s)
    # print(f"depth={depth}, already={already}: {result}")
    return result


def enumerate_stats() -> list:
    # Returns a list of all possible stats allocations (unique)
    # So, how many 7, 8, 9 scores etc.
    return [x for x in enumerate_sub(12, 0) if sum(x) == 6]


def main():
    # All possible ways to distribute stats.
    possible_allocations = enumerate_stats()
    # Filter for the ones that make 20 points.
    valid_allocations = list(filter(
        lambda x: eval_alloc(x) == 20, possible_allocations
    ))
    # Choose one and convert it to stats.
    stats = alloc_to_stats(random.choice(valid_allocations))

    stat_divs = list(document.select(".stats"))
    for i, stat in enumerate(stats):
        stat_divs[i].text = stat

    document.select(".dot-container")[0].style.opacity = "0"
    document.select(".flex-container")[0].style.opacity = "1"


timer.set_timeout(main, 1000)
