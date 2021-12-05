---
title: "Naive sorting: Selection sort"
categories: easy
---
From my experience, many high school students seem to struggle with sorting algorithms. Some of them are easy, some of them not so much.
I would like to try and make them simple for students. First: Selection Sort.

<!-- more -->

The situation of some high schoolers is unbelievable to me sometimes. This algorithm is as simple as it can get. Multiple times I have found students unable to comprehend it.

I have to be honest. If you are supposed to know C/C++ or Python, you meet the theoretical prerequisites, and this is not clear to you by the end of this page, I cannot help you in any way, and neither can luck. If you are not in high school you may just be too young to grasp the logic: taking a few steps back and reviewing some other concepts could prove useful. If you are in high school (and above) you may just be unsuited for logic itself.

## What you need to know

Sorting is a problem that can be solved in many ways. Some can be used all the time, while others have some requirements.

Most sorting algorithms are studied to be used when sorting numbers, but they can easily be generalized to work with anything, from strings to more complex objects. The general idea is that you need to pick a **key**, a function that determines the ordering of two items.

A few examples:
- **Numbers**: increasing or decreasing order.
- **Strings**: alphabetical order (i.e. "Air" comes before "Broccoli").
- A **Student** object: alphabetical order on their full name.

For the sake of simplicity we will work primarily on numerical values, sorted in increasing order.

Finally, you just need to know what a for loop and an array/list are. You don't? Why are you even here?

## Selection sort

**Selection sort** has to be the easiest sorting algorithm there is. Writing code is one thing, understanding the concept behind something is another deal. Even an elementary student can understand what selection sort is about.

It works as follows:
1. Given array $A$, of length $n$, find the minimum element.
2. When the array will be sorted, this minimum will have to be the first element, so switch the minimum with the first. You have already sorted one element.
3. Now find the second-to-smallest element. Since we said that the smallest is already at its rightful place, you can just find the minimum among the remaining $n-1$ elements, which means starting from position $1$.
4. Switch this second-to-smallest element with the second element of $A$, for the same reason as in point (2).
5. Continue like this until you have sorted $A$ completely.

We can generalize this by saying that we are iterating trough the array. At the i-th iteration we try to find the minimum value among the ones from positions $i$ to $n-1$. We then switch this minimum value with the one at position $i$.

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
            # Update minimum if we found a lower value.
            if a[j] < minimum_value:
                minimum_value = a[j]
                minimum_index = j

        # Switch minimum with i-th element.
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
            // Update minimum if we found a lower value.
            if (a[j] < minimum_value) {
                minimum_value = a[j];
                minimum_index = j;
            }
        }

        // Switch minimum with i-th element.
        temp = a[i];
        a[i] = a[minimum_index];
        a[minimum_index] = temp;
    }
}
```

## Computational complexity

We consider **comparisons** between items as the unit of measurement.

Our external `for` loop performs $n$ iterations. Since we ignore the sorted portion of the list at each iteration, our internal `for` loop performs a decreasing number of iterations, each containing a single comparison. The inner loop begins by performing $n - 1$ iterations, then $n - 2$ and so on, until it only performs $1$, when the last two items are left. From this we get that the comparisons are:

$$c = (n - 1) + (n - 2) + ... + 1$$

$$c = 1 + ... + (n - 2) + (n - 1)$$

Which corresponds to a [famous series](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF):

$$\sum^{m}_{k=1}{k} = \frac{m(m+1)}{2}$$

With $m = n - 1$, leading us to a total number of comparisons of:

$$\frac{(n-1)n}{2} = \frac{n^2}{2} - \frac{n}{2}$$

Which means $O(n^2)$ running time.

Unless, for some reason, you want to take years to sort a few million entries, this is not good at all. There are way better algorithms for sorting, and I will talk about them another time.