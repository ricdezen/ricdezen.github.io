from browser import document, timer
import random

# Pathfinder stuff.
MIN_PATHFINDER_SCORE = 7
DEFAULT_PATHFINDER_POINTS = 20

# POINTS[x] = how many points a score of x is worth.
PATHFINDER_COSTS = {
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

# DnD 5e stuff.
MIN_DND_SCORE = 8
DEFAULT_DND_POINTS = 27

DND_COSTS = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9
}

# Selected stuff. Default page is Pathfinder.
selected_min_score = MIN_PATHFINDER_SCORE
selected_def_points = DEFAULT_PATHFINDER_POINTS
selected_costs = PATHFINDER_COSTS


def alloc_to_stats(offset: int, alloc: list) -> list:
    stats = []
    for i, x in enumerate(alloc):
        for _ in range(x):
            stats.append(i + offset)
    return stats


def eval_alloc(costs: dict, offset: int, alloc: list) -> int:
    # Return how many points an allocation is worth.
    # An allocation is, instead of the list of stats, a vector in which
    # alloc[i] is how many stats have value i + 7.
    return sum(costs[i + offset] * x for i, x in enumerate(alloc))


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


def enumerate_stats(n_values: int) -> list:
    # Returns a list of all possible stats allocations (unique)
    # So, how many 7, 8, 9 scores etc.
    return enumerate_rec(n_values, 0)


def get_random_for(costs: dict, offset: int, n_points: int) -> list:
    # All possible ways to distribute stats.
    possible_allocations = enumerate_stats(len(costs.keys()))

    # Filter for the ones that make n_points points.
    valid_allocations = [
        x for x in possible_allocations
        if eval_alloc(costs, offset, x) == n_points
    ]

    # Choose one and convert it to stats.
    return alloc_to_stats(offset, random.choice(valid_allocations))


def main(costs: dict, offset: int, n_points: int):
    stats = get_random_for(costs, offset, n_points)

    stat_divs = list(document.select(".stats"))
    for i, stat in enumerate(stats):
        stat_divs[i].text = stat

    # Let stats appear.
    document.select(".dot-container")[0].style.opacity = "0"
    document.select(".flex-container")[0].style.opacity = "1"


def delay_main(costs: dict, offset: int, n_points: int):
    # Let dots appear.
    document.select(".flex-container")[0].style.opacity = "0"
    document.select(".dot-container")[0].style.opacity = "1"
    timer.set_timeout(lambda: main(costs, offset, n_points), 1000)


def reload_pathfinder():
    # Apply aestethic changes to the page.
    for elem in document.select("[palette]"):
        elem.attrs["palette"] = "pathfinder"

    # Set variables and start.
    selected_costs = PATHFINDER_COSTS
    selected_min_score = MIN_PATHFINDER_SCORE
    selected_def_points = DEFAULT_PATHFINDER_POINTS
    document["n-points"].value = str(selected_def_points)
    delay_main(selected_costs, selected_min_score, selected_def_points)


def reload_dnd():
    # Apply aesthetic changes to the page.
    # Apply aestethic changes to the page.
    for elem in document.select("[palette]"):
        elem.attrs["palette"] = "dnd"

    # Set variables and start.
    selected_costs = DND_COSTS
    selected_min_score = MIN_DND_SCORE
    selected_def_points = DEFAULT_DND_POINTS
    document["n-points"].value = str(selected_def_points)
    delay_main(selected_costs, selected_min_score, selected_def_points)


# Loads Pathfinder by default.
reload_pathfinder()
document["n-points"].bind(
    "change",
    lambda e: delay_main(selected_costs, selected_min_score,
                         int(document["n-points"].value))
)

# Bind tabs to functions.
document["tab-dnd"].bind(
    "click",
    lambda e: reload_dnd()
)
document["tab-pathfinder"].bind(
    "click",
    lambda e: reload_pathfinder()
)
