from browser import document, timer
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


def enumerate_rec(depth: int, already: int) -> list:
    """
    :param depth: How many values are left to set.
    :param already: Sum of previous values.
                    Equivalently, how many stats have been set.
    """
    # Already have 6 stats. The last `depth` values are 0.
    if already > 5:
        return [[0] * depth]

    # Last value in the sequence. Return the only value that makes 6.
    if depth == 1:
        return [[6 - already]]

    # Enumerate remaining feasible values.
    result = []
    for n in range(7 - already):
        # Get all values compatible with this value being `n`.
        for s in enumerate_rec(depth - 1, n + already):
            result.append([n] + s)

    return result


def enumerate_stats() -> list:
    # Returns a list of all possible stats allocations (unique)
    # So, how many 7, 8, 9 scores etc.
    return enumerate_rec(12, 0)


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
