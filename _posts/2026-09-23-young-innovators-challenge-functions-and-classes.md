---
layout: post
title: YOUNG INNOVATORS CHALLENGE WEEK 4 - FUNCTIONS AND CLASSES
date: 2026-09-23 16:00:00+0400
description: Refactor the game with functions, then bring the ship's data and behaviour together in a class.
tags: young-innovators-challenge functions classes python refactoring object-oriented-programming
categories: documentation
---

Our game now has a loop we wrote ourselves and a galaxy full of detailed planets. It works, but `game.py` has become busy. There are long blocks for processing a destination, checking whether the ship has been defeated and displaying information to the player.

This week is about cleaning that up without changing what the game does. First, we'll use functions to give repeated or complicated jobs useful names. Then, we'll use a class to bring the ship's information and its behaviour together.

The game should still play the same way at the end. The difference is that the code will be much easier to read, change and build on.

## FUNCTIONS GIVE A JOB A NAME

A function is a named block of code that we can run whenever we need it. We've already used functions such as `print()`, `input()` and `len()`. This week, we start defining our own.

Here's the basic anatomy of a function:

```python
def scan(destination):
    danger = destination["danger_level"]
    print(f"SCANNER: {destination['name']} — threat level {danger}")
```

`def` tells Python we're defining a function. `scan` is the name we've chosen for its job. `destination` is a parameter: a variable that receives information when we call the function. Just like with loops and conditionals, the colon starts an indented code block.

We can then call it wherever we need it:

```python
scan(destination)
```

Rather than keeping all the scanner code inside our game loop, the loop can now simply say what happens: scan the destination. The details live behind that useful name.

That is the main reason functions are so useful. They help us make an abstraction: we can use a piece of code without having to look at every detail of how it works each time. They also give us a natural way to reuse code when the same job happens more than once.

## RETURNING AN ANSWER

Some functions do something visible, like printing text. Others calculate an answer and give that answer back to the code that called them. The `return` statement is how a function sends a value back.

For example, we can move the defeat checks into a function:

```python
def check_defeat(oxygen, hull):
    if oxygen <= 0:
        return "Oxygen depleted"
    if hull <= 0:
        return "Hull destroyed"
    return None
```

This function doesn't print a defeat screen or end the game. Its one job is to check the two resource values and return either a reason for defeat or `None` when the ship is fine.

We can save the returned value in a variable and decide what to do next:

```python
cause = check_defeat(oxygen, hull)

if cause:
    print(cause)
```

That separation is really handy. The function checks; the caller responds.

It also helps to know that not every function returns a useful value. Try this in Python:

```python
message = print("Hello from the ship")

print(message)
print(type(message))
```

The first line prints the greeting, but `print()` doesn't hand a value back for us to save. `message` is therefore `None`, and its type is `NoneType`.

This is worth experimenting with whenever you're unsure what a function gives back. Call it, save the result, print that variable and check its type. Some functions are designed to return a value; others are designed to perform an action. Neither is better. They just let us use functions in different ways.

## LET THE EDITOR HELP

You don't have to memorise every parameter or return value. When you're working in VS Code, hover over a function name or type its name followed by an opening bracket. The editor will often show the parameter names, a short description or part of the function's documentation.

This is a brilliant first place to look when you're trying to understand an unfamiliar function. It won't always answer every question, but it can tell you what information the function expects and point you towards the next step: reading the proper documentation.

## REFACTORING A WORKING GAME

So far, we've been adding behaviour to the game. This week, we're doing something slightly different: refactoring. That means reorganising code so it is cleaner or easier to work with, while keeping its behaviour the same.

We start with working code. Then we look through the game loop for a chunk that has a clear job and turn it into a function. `should_stop()` is one example we already have. `scan(destination)`, `check_defeat(oxygen, hull)` and `process_destination(destination, oxygen, hull)` are more.

The result is a loop that tells the story of the game:

```python
for destination in galaxy:
    scan(destination)
    oxygen, hull = process_destination(destination, oxygen, hull)

    cause = check_defeat(oxygen, hull)
    if cause:
        print(cause)
        return
```

You can read that without opening the functions: scan, process, check. If we need to understand the details, we can open the matching function instead of trying to hold the whole game in our head at once.

This is also a reminder that a program is not one enormous file. It's a collection of files in a project folder, which lives inside a repository on your computer. We've been working in `.py` files precisely because they can share Python code with one another.

As the game grows, we can create a file such as `functions.py` and move our own helper functions there. Then `game.py` can import the functions it needs. The engine has already been doing this for us: we import code from its files, and now we're beginning to organise our own code the same way.

## NAME FUNCTIONS FOR FUTURE YOU

There is no single perfect way to name a function, but I prefer names that tell me exactly what they do. A longer name can be much more useful than a short, mysterious one when you come back to a project after a few weeks.

`check_defeat()` tells us more than `check()`. `process_destination()` tells us more than `run()`. The name should help a reader understand the job without opening the function body.

That's a personal preference, not a law of programming. But it's a useful question to ask yourself: if I saw this function name in six months, would I know what it does?

Sometimes you know a function belongs in your design before you're ready to write it. Python's `pass` keyword lets you create a temporary, empty block:

```python
def calculate_trade_offer():
    pass
```

`pass` does nothing. It is just a placeholder that keeps Python happy while reminding you that there is work to come back to. I find it useful when sketching out a function or method, but it is simply one way to plan code. You don't have to use it.

## WHEN LOOSE VARIABLES BELONG TO ONE THING

Functions make our game loop much tidier, but we still have a small design problem. Our ship's name, crew, oxygen and hull are separate variables that have to travel together through several function calls:

```python
ship_name = "The Horizon"
crew = "A band of explorers"
oxygen = 100
hull = 100
```

They are all facts about one ship, yet Python doesn't know that connection. A class lets us describe a new kind of thing and keep related data and behaviour in one place.

```python
class Ship:
    def __init__(self, name, crew, oxygen, hull):
        self.name = name
        self.crew = crew
        self.oxygen = oxygen
        self.hull = hull
```

`Ship` is the class: a reusable description of what every ship should have. When we create a particular ship from that description, we get an object:

```python
ship = Ship(
    "The Horizon",
    "A band of explorers",
    100,
    100,
)
```

The special `__init__` method runs when we create the object. It receives the starting information and stores it on that particular ship. `self` means the object currently being set up or used. So `self.oxygen` is the oxygen belonging to this ship.

We can use dot notation to read or change an attribute:

```python
print(ship.name)

ship.oxygen = ship.oxygen - 8
print(ship.oxygen)
```

## BEHAVIOUR BELONGS WITH THE SHIP TOO

A class can hold functions as well as data. Functions inside a class are called methods. Since a method receives `self`, it can work directly with the attributes belonging to its object.

```python
class Ship:
    def __init__(self, name, crew, oxygen, hull):
        self.name = name
        self.crew = crew
        self.oxygen = oxygen
        self.hull = hull

    def is_defeated(self):
        if self.oxygen <= 0:
            return "Oxygen depleted"
        if self.hull <= 0:
            return "Hull destroyed"
        return None

    def show_status(self):
        print(f">> Oxygen: {self.oxygen} | Hull: {self.hull}")
```

Now, instead of passing `oxygen` and `hull` into a separate function, we can ask the object about itself:

```python
ship.show_status()
cause = ship.is_defeated()
```

We don't pass `ship` into those calls because Python supplies `self` automatically. The code matches the idea behind it: these are things the ship knows about itself and jobs the ship can do.

You might also see a custom object printed as something unhelpful, such as a class name followed by a memory address. We can define `__repr__` to tell Python how we want an object to be represented:

```python
class Ship:
    def __init__(self, name, crew, oxygen, hull):
        self.name = name
        self.crew = crew
        self.oxygen = oxygen
        self.hull = hull

    def __repr__(self):
        return f"Ship(name={self.name!r}, oxygen={self.oxygen}, hull={self.hull})"
```

With that method in place, `print(ship)` gives us a useful summary instead of an opaque memory address. It is a small quality-of-life improvement, but it becomes very helpful when you are checking what objects your code has created.

## A SMALLER GAME.PY, WITH MORE ROOM TO GROW

Once we extracted reusable chunks into functions and moved ship state and behaviour into `Ship`, we roughly halved the amount of code sitting in `game.py`. Nothing magical happened: we moved the same responsibilities into clearer homes.

That leaves us with a game loop that is easier to follow and a project that is ready for the next step. Our ship can gain new attributes, and the different encounters can become their own interacting classes: asteroids, traders, raiders and empty space.

We'll explore those encounter classes next, along with ways to balance the game by making damage depend on a planet's danger level. For now, the important win is simpler: we've learned how to group repeated jobs into functions and how to bring a thing's data and behaviour together in one object.

## THIS WEEK'S SLIDES AND DOCUMENTATION

You can find the [Young Innovators Challenge slides](https://github.com/ocean-ai-seychelles/slides-for-young-innovators-challenge) if you'd like to revisit anything from class. When you're ready to dig deeper, the official Python documentation has more on [defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions), [`pass`](https://docs.python.org/3/tutorial/controlflow.html#pass-statements) and [classes](https://docs.python.org/3/tutorial/classes.html).
