---
title: "Naive sorting: Selection sort"
categories: easy
---
From my experience, many high school students seem to struggle with sorting algorithms. Some of them are easy, some of them not so much. I'd like to try and make them simple for students. I want to start from the simplest algorithm: Selection sort.

## What you need to know

First of all, kids always tend to wonder "*why would I ever need to know this?*". Let us say you are playing some game, and need to *sort* your inventory. That's it, that's the answer.

Sorting is a problem that can be solved in many ways. Some can be used all the time, while others have some requirements.

Most sorting algorithms are studied to be used when sorting numbers, but they can easily be generalized to work with anything, from strings to more complex objects. The general idea is that you need to pick a **key**, a function that determines the ordering of two items.

A few examples:
- **Numbers**: increasing or decreasing order.
- **Strings**: alphabetical order (i.e. "Air" comes before "Broccoli").
- A **Student** object: alphabetical order on their full name.

For the sake of simplicity we will work primarily on numerical values, sorted in increasing order.

Finally, you just need to have basic `for` loop and `array` knowledge. We will be assuming array indexes to start from 0.

## Selection sort

**Selection sort** really has to be the easiest sorting algorithm there is. While writing code is one thing, I'm pretty sure the idea behind it should be understandable from any elementary schooler.

It works as follows:
1. Given array $A$, of length $n$, find the minimum element.
2. Switch the minimum element with the first. This means you have put the minimum element to its final, sorted position.
3. Now find the second-to-smallest element. Since you know that the smallest is in the first position, you can just find the minimum among the remaining $n-1$ elements, starting from position $1$.
4. Switch this second-to-smallest element with the second element of $A$.
5. Continue like this until you have sorted $A$ completely.

We can generalize this by saying that we are iterating trough the array. At the i-th iteration we try to find the minimum value among the ones at positions $i$ up to $n-1$. We then switch this minimum value with the one at position $i$.

<img src="/assets/charts/selectionsort.svg" alt="Explanatory chart" width="100%"/>

Let us see some simple Python code to implement this.
```python
def selection_sort(a: list):
    '''
    Sort list `a` in increasing order.
    '''
    n = len(a)
    for i in range(n):
        # Assume the first is the minimum.
        minimum_value = a[i]
        # We use the index to switch the elements.
        minimum_index = i

        for j in range(i + 1, n):
            if a[j] < minimum_value:
                minimum_value = a[j]
                minimum_index = j

        # Put minimum element at the i-th position.
        temp = a[i]
        a[i] = a[minimum_index]
        a[minimum_index] = temp
```

An alternative, using some more Python built-ins is:
```python
def selection_sort(a: list):
    '''
    Sort list `a` in increasing order.
    '''
    b = list()
    while a:
        m = min(a)
        b.append(m)
        a.remove(m)
    a.extend(b)
```
But this performs many useless operations, and creates another list, wasting memory.

While I personally like Python, we used to learn C++ when I went to high school, so let us now see a C/C++ implementation.
```c
/**
 * Sort array `a` of size `n` in increasing order.
 * The example shows sorting for int numbers, generalizing 
 * to other types should be trivial.
 */
void selection_sort(int *a, int n) {
    // Variables.
    int minimum_value, minimum_index, temp;

    for (int i = 0; i < n; i++) {
        // Assume the first is the minimum.
        minimum_value = a[i];
        // We use the index to switch the elements.
        minimum_index = i;

        for (int j = i + 1; j < n; j++) {
            if (a[j] < minimum_value) {
                minimum_value = a[j];
                minimum_index = j;
            }
        }

        // Put minimum element at the i-th position.
        temp = a[i];
        a[i] = a[minimum_index];
        a[minimum_index] = temp;
    }
}
```

## Computational complexity

Now for computational complexity. We consider **comparisons** between items as the unit of measurement.

Our external `for` loop does $n$ iterations. For each of these, our internal `for` loop does a decreasing number of iterations, each containing a single comparison. The inner loop begins by performing $n - 1$ iterations, then it does $n - 2$ and so on, until it only performs $1$, when the last two items are left. From this we get that the comparisons are:

$$c = (n - 1) + (n - 2) + ... + 1$$

$$c = 1 + ... + (n - 2) + (n - 1)$$

Which corresponds to a [famous geometric series](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF):

$$\sum^{m}_{k=1}{k} = \frac{m(m+1)}{2}$$

With $m = n - 1$, leading us to a total number of comparisons of:

$$\frac{(n-1)n}{2} = \frac{n^2}{2} - \frac{n}{2}$$

Which means $O(n^2)$ running time.

Unless, for some reason, you want to take years to sort a few million entries, this is not good at all. There are way better algorithms for sorting, and I will talk about them another time.