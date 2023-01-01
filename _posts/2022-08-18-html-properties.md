---
title: "Turns out HTML is cooler than I remembered"
categories: intermediate
---

I am taking a break from my Master's Thesis. I seem to have developed the bad
habit of studying even during these "breaks". This evening I forced myself to
do something simple and relaxing, instead of browsing papers.

<!-- more -->

## Today's waste of time

With my last post I made a tiny web page that allows generating a random array
of stats for Pathfinder. Some time later, I decided to try my hand at D&D 5e,
and I happen to like its simplicity quite a lot. The problem is that the point
buy system has different costs compared to the Pathfinder one. Oh no! What is
Mike going to do?

The naive solution is to make another page and change few numbers. Sure, that
can work, but I like overengineering simple things. It's still easy enough to
just modify my script to handle multiple game systems.

```python
def old_main(n_points: int):
    # Hardcoded game system information
    stats = get_random_for(n_points)
    # Show stats to user

def new_main(costs: dict, offset: int, n_points: int):
    # We need more info:
    # - costs: map of score to point cost
    # - offset: minimum ability score
    stats = get_random_for(costs, offset, n_points)
    # Show stats to user
```

And then we just bind the two sets of informations to two buttons.

```python
def reload_pathfinder():
    # Set variables and start.
    selected_costs = PATHFINDER_COSTS
    selected_min_score = MIN_PATHFINDER_SCORE
    selected_def_points = DEFAULT_PATHFINDER_POINTS
    document["n-points"].value = str(selected_def_points)
    delay_main(selected_costs, selected_min_score, selected_def_points)


def reload_dnd():
    # Set variables and start.
    selected_costs = DND_COSTS
    selected_min_score = MIN_DND_SCORE
    selected_def_points = DEFAULT_DND_POINTS
    document["n-points"].value = str(selected_def_points)
    delay_main(selected_costs, selected_min_score, selected_def_points)
```

Sure enough, this works. But again, I like to overengineer, so I'd like each
game system to have a different color scheme. For some reason I associated dark
blue tones to Pathfinder in my head, so why not make everything red for D&D?

## Quick palette change

I quickly realized that setting the style of every page element, one at a time,
would have been insane, and definitely not reusable.

I studied very few HTML and CSS back in high school, and I deemed related
college courses a waste of credits. Something still clicked inside my small
head, and I remembered two not so known features:
[custom HTML attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) and [CSS attribute selectors](https://www.w3schools.com/css/css_attribute_selectors.asp).

Basically, you can add any attribute to an HTML tag, even if such attribute does
not really exist.

```html
<!-- Custom (and for now empty) "palette" attribute -->
<div class="child stats" palette="">
            
</div>
```

> **WARNING**: In theory you should call your attribute something that starts with `data-`.

And in CSS, you can query for attribute values.

```css
img[src=image.jpg] {
    /* Only applies to <img tags>
       with "image.jpg" value for src */
}
```

If we combine these, I can define what an element of the page should look like
based on the value of `palette`.

```css
body[palette=dnd] {
    background-color: rgb(117, 11, 11);
}

body[palette=pathfinder] {
    background-color: rgb(40, 44, 52);
}

.child[palette=dnd] {
    color: rgb(255, 223, 207);
}

.child[palette=pathfinder] {
    color: rgb(203, 212, 227);
}

/* And so on... */
```

Then, in your Javascript (well, in this odd case, Python) code you can just set
the `palette` value of all items that have the attribute in the first place.

```python
def reload_pathfinder():
    # Apply aestethic changes to the page.
    for elem in document.select("[palette]"):
        elem.attrs["palette"] = "pathfinder"

    # Set variables and start.
    ...


def reload_dnd():
    # Apply aesthetic changes to the page.
    for elem in document.select("[palette]"):
        elem.attrs["palette"] = "dnd"

    # Set variables and start.
    ...
```

Simple, quick, reusable. There is probably some more interesting and contrived
solution, but that's enough for today's waste of time.

### Note

Pseudo elements such as `::before` and `::after` do not seem to support
attribute selectors. If, like in my case, you need the same color values as
the main element, you can set it to `inherit`.

```css
.dot-elastic[palette=dnd] {
    color: rgb(255, 223, 207);
    background-color: rgb(255, 223, 207);
}

.dot-elastic[palette=pathfinder] {
    color: rgb(203, 212, 227);
    background-color: rgb(203, 212, 227);
}

.dot-elastic::before,
.dot-elastic::after {
    color: inherit;
    background-color: inherit;
    /* ... */
}
```