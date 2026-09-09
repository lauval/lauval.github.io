---
layout: post
title: YOUNG INNOVATORS CHALLENGE WEEK 2 - INPUT, CONDITIONALS AND LISTS
date: 2026-09-09 16:00:00+0400
description: Give players a choice with Python's input function and conditionals, then use lists to personalise the planets in your galaxy.
tags: young-innovators-challenge input conditionals lists python built-in-functions
categories: documentation
---

In the first session, we set up our development environment using uv to manage our Python installation, VS Code to edit our code, git to save our changes and GitHub to host our code as an online portfolio. At the end, we ran the game using `uv run game.py`.

You may have noticed that the game essentially played itself. Our ship visited each planet automatically, without giving the player a choice about whether to stop, replenish resources or trade. This week, we'll give the player that choice and personalise the planets in our galaxy.

Since our game runs in the terminal, we need a way for the player to type a response. Python provides a built-in function called `input()` to do just that.

## ASKING THE PLAYER A QUESTION

The `input()` function displays a prompt, then waits for the player to type a response and press Enter. The prompt is the text inside the parentheses, surrounded by quotation marks:

```python
input("Hello. What is your name? ")
```

To use the response elsewhere in our code, we assign the value returned by `input()` to a variable:

```python
response = input("Hello. What is your name? ")
```

Now we can use `response` to customise what happens next. Whatever the player types, `input()` returns a string: even if they type a number, Python treats it as text at this point.

But we're more interested in whether the player wants to stop at a planet than in their name. Remember, the idea is for them to make a choice based on their remaining resources and the planet's danger level. So we'll ask this instead:

```python
response = input("Do you want to stop here? (y/n) ")
```

The `y/n` tells the player which responses we expect. It doesn't prevent them from typing something else; we'll decide how to handle their answer in our code. Keeping the choices simple makes that easier.

Okay, great! We've prompted the player, and they've provided a response. Now what?

Now we process it!

## MAKING DECISIONS WITH CONDITIONALS

Conditionals let us run different blocks of code depending on whether a condition is true or false. We write them using the keywords `if`, `elif` (short for "else if") and `else`.

A condition can be a comparison between two values. The result of that comparison is a Boolean value: either `True` or `False`. For example:

```python
a = 1
b = 2

if a > b:
    print("a is bigger than b!")
```

Here, `a > b` asks whether `a` is greater than `b`. Since 1 is not greater than 2, the comparison evaluates to `False`, and nothing is printed. If we changed `a` to 3, the condition would be `True`, and we'd see the message.

We can make other comparisons too:

```python
a == b             # Is a equal to b?
a < b              # Is a smaller than b?
a <= b             # Is a smaller than or equal to b?
a >= b             # Is a greater than or equal to b?
type(a) == type(b)  # Do a and b have the same Python type?
```

Each of these expressions produces `True` or `False`, and we can use any of them as the condition after `if`. Notice that `==` compares values, while a single `=` assigns a value to a variable.

The syntax matters: first comes `if`, then the condition, then a colon (`:`). The lines that should run when the condition is true form an **indented block** beneath it.

Use four spaces for each level of indentation, as in the example above. You can use the Tab key if your editor is configured to insert four spaces. Keep indentation consistent, and don't mix tab characters with spaces.

## ADDING THE CHOICE TO OUR GAME

In our game, we want to return `True` when the player types `"y"` and `False` for anything else, including `"n"`. It's the comparison `response == "y"` that produces the Boolean value; the response itself remains a string.

We'll put this logic in a function called `should_stop()` so the game can reuse it at every destination. Open `game.py` and add this above `main()`:

```python
def should_stop():
    response = input("Do you want to stop here? (y/n) ")

    if response == "y":
        return True
    else:
        return False
```

The `return` keyword sends a value back to the code that called the function. Here, that value tells the game whether to stop at the planet.

Notice that `else` doesn't need a condition. It handles anything that didn't match the `if` condition. For now, that means only a lowercase `y` makes us stop. An uppercase `Y`, a typo or an empty response will make us fly past.

If we wanted to check another response separately, we'd use `elif`. For example, we could replace the conditional block inside `should_stop()` with this:

```python
    if response == "y":
        return True
    elif response == "maybe":
        print("That's not a yes, so we'll fly past this time.")
        return False
    else:
        return False
```

Python checks the conditions in order and runs the first matching branch. If none match, it runs the `else` block. We don't need this extra branch for our game, so you can keep the simpler `if`/`else` version.

Next, find the `travel()` call inside `main()` and add `should_stop` as its final argument:

```python
    travel(
        galaxy,
        constants.STARTING_OXYGEN,
        constants.STARTING_HULL,
        constants.SHIP_NAME,
        should_stop,
    )
```

Keep the indentation shown here, since this call is inside `main()`. Make sure there's a comma after `constants.SHIP_NAME` before adding the new argument.

We pass the function's name, `should_stop`, **without parentheses**. This gives `travel()` the function so it can call it at each planet. Writing `should_stop()` here would call it immediately and pass its result instead.

Save `game.py` and run `uv run game.py` again. You should now be asked whether to stop at each planet. Try both `y` and `n` to see the difference. Now the player can play the game!

## STORING PLANET NAMES IN A LIST

The second part of this week's material covers lists. A list is an ordered collection of Python objects. It lets us keep multiple values together in a specific order.

The easiest way to create a list is with square brackets, separating the elements with commas:

```python
my_list = [1, 2, 3, 4]
```

Lists can contain objects of different types, including other lists:

```python
mixed_list = [True, 0.0, "abcd", [1, 2, 3, 4]]
```

That's right! A list can hold another list as one of its elements.

For our game, we want to replace the default planet names with our own. A list is a useful place to store those names in the order we want the player to encounter them.

Open `constants.py` and find the empty list:

```python
PLANETS = []
```

Lists have **methods**: functions we call on a particular object. The `.append()` method adds one element to the end of a list. Add these lines directly below `PLANETS = []`:

```python
PLANETS.append("Awesome Planet")
PLANETS.append("Cool Planet")
```

Our list now contains two names, in the order we added them. You can keep adding names until you've run out of imagination!

Finally, in the same file, change `USE_CUSTOM_PLANETS` from `False` to `True`:

```python
USE_CUSTOM_PLANETS = True
```

With that setting enabled and at least one name in `PLANETS`, the game will use our custom list. `GALAXY_SIZE` still controls the number of destinations: if the list is shorter than the galaxy, the game repeats it; if it's longer, the game uses only as many entries as it needs.

Save `constants.py` and run the game again to see your planets appear.

You've now given the player a choice using `input()`, used conditionals to decide what happens next, and created a list of planet names to personalise the galaxy. Our game is starting to feel like something we can actually play and make our own!
