---
layout: post
title: YOUNG INNOVATORS CHALLENGE WEEK 3 - LOOPS AND DICTIONARIES
date: 2026-09-18 16:00:00+0400
description: Take control of the game journey with for loops, then give every planet a story with dictionaries.
tags: young-innovators-challenge loops dictionaries python lists game-development
categories: documentation
---

Last time, we gave the player a choice and made a list of planet names. This week, we take a much bigger step: we start taking control of the game's logic ourselves.

Until now, the engine has been doing most of the travelling for us. Our list tells it where to go, but the `travel()` function is still responsible for moving through the galaxy, asking the player what to do and checking whether the ship survives.

We're going to replace that default behaviour with our own code in `game.py`. The outcome stays the same: the ship visits every world, the player chooses whether to stop and the game can end in victory or defeat. The difference is that we'll be deliberately telling the game when each thing should happen.

To do that, we need loops. And once we can visit one planet at a time, we need richer information for each planet than a name alone. That's where dictionaries come in.

## REPEATING WORK WITH A FOR LOOP

A loop is a way to repeat a block of code. In our game, the repeated job is straightforward: visit each destination in the galaxy.

The loop we use looks like this:

```python
for i in range(len(galaxy)):
    destination = galaxy[i]
    show_destination(destination, i, len(galaxy))
```

Let's take the first line apart.

`for` is the keyword that tells Python we're starting a loop. `range(len(galaxy))` supplies a sequence of numbers: one valid index for every item in `galaxy`. If there are three planets, the numbers are `0`, `1` and `2`.

The `range(len(galaxy))` part might look like one thing, but it's actually two function calls nested inside each other. Read it from the inside out:

```python
galaxy = ["Verdantis", "Kragnor", "Aquifera"]

len(galaxy)          # returns 3
range(3)              # gives us 0, 1, 2
for i in range(3):    # repeats once for each of those numbers
```

So, in the original line, <mark><code>len(galaxy)</code></mark> runs first and returns the number of planets. That value is passed into <mark><code>range(...)</code></mark>, which gives the loop the valid indexes. Python then puts each index into `i`, one at a time.

This pattern comes up all over programming: an inner function call returns a value, and the outer function uses that value. We could write the same work across two lines:

```python
number_of_planets = len(galaxy)

for i in range(number_of_planets):
    print(i)
```

Writing it separately can make the flow easier to see at first. Nesting the calls is just the shorter version once you're comfortable with what each one returns.

The `i` between them is a variable we create for this loop. On the first pass, `i` is `0`; on the second pass, it is `1`; then it becomes `2`. We use it to retrieve the current planet with `galaxy[i]`.

`i` is a common convention when we're using an index. It's short for index, but it isn't magic. We could write this instead:

```python
for planet_index in range(len(galaxy)):
    destination = galaxy[planet_index]
```

Or, in another situation, a name like `frame`, `attempt` or `iteration` might explain the code better. The important thing is that it is a temporary variable whose value changes each time the loop repeats.

Finally, notice the colon (`:`) at the end of the `for` line. It tells Python that we're ready to define the block that belongs to the loop. Everything indented beneath it runs once for each value supplied by `range()`.

## CODE BLOCKS ARE A RECURRING IDEA

You've already seen indented blocks with conditionals:

```python
if response == "y":
    print("You stop at the planet.")
```

Loops work the same way in that respect. The indentation groups lines together, but the purpose is different. An `if` block runs only when its condition is true. A `for` block runs repeatedly: once for every value it receives.

This idea will keep coming back. Functions, loops, conditionals and eventually classes all use blocks of code. Getting comfortable with where a block starts, where it ends and why it's indented is one of the most useful early programming habits you can build.

In our game loop, each pass has a series of jobs: spend oxygen, show the destination, ask the player whether to stop, process what happens there, show the ship's status and check whether the ship has been defeated. When all of those lines sit inside the loop, they happen for every destination. The victory message sits _after_ the loop, so it appears only once the journey is complete.

That's us taking control of the game loop.

## WHAT ABOUT WHILE?

Python has another kind of loop: `while`. It repeats as long as a condition remains true.

```python
count = 0

while count < 3:
    print(count)
    count = count + 1
```

This prints `0`, `1` and `2`. The final line is essential because it changes `count`. Without it, `count < 3` would always be true and the loop would continue forever.

`while` loops are useful when we genuinely don't know how many times something needs to repeat. For example, a game might keep asking whether a player wants another round until they choose to quit. But they're easy to get wrong, especially when you're starting out. An endless loop can keep demanding work from your computer until the program has to be stopped, and heavier programs can cause more serious problems.

For our galaxy, we already know the collection we want to visit: `galaxy`. A `for` loop makes that intention obvious and gives us exactly one pass per destination, so it is the safer and clearer choice.

## A PLANET NEEDS MORE THAN A NAME

Our list of strings was a great start:

```python
PLANETS = ["Verdantis", "Kragnor", "Aquifera"]
```

But a name alone can't tell the game whether a planet has water, how dangerous it is or what encounter should happen there. We need to keep several related facts together. A dictionary is built for exactly that.

A dictionary uses curly braces (`{}`) and stores key-value pairs. The key is a descriptive label; the value is the information connected to that label. Each pair uses a colon, and commas separate the pairs:

```python
planet = {
    "name": "Verdantis",
    "description": "Bioluminescent forests cover the surface",
    "danger_level": 1,
    "has_water": True,
    "encounter": "empty",
}
```

Here, `"name"` is a key and `"Verdantis"` is its value. You can read the colon as "maps to": the key `"name"` maps to the value `"Verdantis"`.

Keys in our planet dictionaries are strings because they describe the facts we want to store. The values can be different types of Python object. A name or description is a string, a danger level is an integer and `has_water` is a Boolean value: either `True` or `False`.

A value doesn't have to be one simple thing, either. A dictionary can store a list, a tuple or even another dictionary as the value attached to one of its keys. We don't need that complexity for our planets yet, but it's useful to know that dictionaries can grow with the information we need to model.

## LOOKING UP A FACT

We retrieve a dictionary value by putting the exact key in square brackets:

```python
print(planet["name"])
print(planet["danger_level"])
```

This prints the planet's name and danger level. The spelling, quotation marks and underscores matter: if Python cannot find the exact key you ask for, it raises a `KeyError`.

For now, we're keeping this simple. We're not reaching for dictionary methods such as `.get()` yet. Square-bracket lookup is enough to show the essential relationship: use a descriptive key to retrieve the fact you need.

## A LIST OF DICTIONARIES

The galaxy is still a list. The upgrade is that each item in the list is now a dictionary instead of a string.

```python
PLANETS = []

PLANETS.append({
    "name": "Verdantis",
    "description": "Bioluminescent forests cover the surface",
    "danger_level": 1,
    "has_water": True,
    "encounter": "empty",
})

PLANETS.append({
    "name": "Kragnor",
    "description": "A barren world inside an asteroid belt",
    "danger_level": 3,
    "has_water": False,
    "encounter": "asteroid_field",
})
```

Now the loop can still visit one destination at a time, but every `destination` carries all the facts the game needs:

```python
for destination in PLANETS:
    print(destination["name"], destination["danger_level"])
```

This is the connection between this week's two themes. The loop gives us control over the sequence of the game, and the dictionaries give each stop on that journey personality, risk and consequences.

## THE GAME IS THE CONTEXT, NOT THE LIMIT

One useful conversation from this week was about transferability. Games are a fun way to make the ideas visible: a spaceship crosses a galaxy, resources change and worlds have stories. But the underlying skills aren't only for games.

The same loop could go through a folder of files. The same dictionary could store information about an invoice, a customer, an email attachment or a row of prepared data. A program that fetches documents from an email client, saves them to disk and prepares them for the next step is also repeatedly processing structured information.

That's why we're learning these building blocks before functions and classes. We're not just changing the behaviour of one small game. We're learning how to describe information, repeat a task deliberately and make software do a series of useful jobs.

For now, build your galaxy. Give each world a name, a description, a danger level, a water value and an encounter. Run `uv run game.py`, play through it and see your own data drive the journey.

Next, we'll use functions to give the individual jobs in our now much larger loop clear names.

## THIS WEEK'S CODE AND SLIDES

From this point onwards, I'll share a link to the state of the codebase at the end of every week. It will include the files we've changed together, so you can compare your own project with a working version if you get stuck.

This week's code is available in [this GitHub Gist](https://gist.github.com/lauval/60cb8a2a4a3dc606242a386ff4f52304). It includes a few more changes involving the `for` loop than this post has covered. That's intentional: the blog is here to focus on the main ideas, while the code is there when you're ready to see how all the pieces fit together.

You can also find the [Young Innovators Challenge slides](https://github.com/ocean-ai-seychelles/slides-for-young-innovators-challenge) if you'd like to revisit anything from class. And if you'd like to go a little deeper, the official Python documentation has more on [`for` statements and `range()`](https://docs.python.org/3/tutorial/controlflow.html#for-statements) and [dictionaries](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict).
