---
layout: post
title: YOUNG INNOVATORS CHALLENGE WEEK 5 - ENCOUNTERS AND MORALE
date: 2026-10-02 12:00:00+0400
description: Bring the ship and encounter classes together, balance the adventure with crew morale, and finish with a cleaner game loop.
tags: young-innovators-challenge classes python refactoring game-development
categories: documentation
---

In [Week 4]({% post_url 2026-09-23-young-innovators-challenge-functions-and-classes %}), we learned how to give jobs names using functions and how to group related data and behaviour inside a class. We created a `Ship` class, ready to bring the ship's oxygen, hull, name and crew together.

For our final week, we put that class to work throughout the game. Then we apply the same idea to the things our ship encounters: asteroid fields, raiders, traders and empty space. Each gets its own class, with a method that acts directly on the ship.

We also introduce one new attribute: morale. The crew's mood changes how much damage they take and how much help they receive, giving the captain another reason to think carefully about each stop.

## PUTTING THE SHIP IN CHARGE OF ITS RESOURCES

At the end of Week 4, we had a ship class in `player.py`, but `game.py` was still using separate oxygen and hull variables. The next step was to connect those two pieces.

First, we create a ship using our starting values:

```python
ship = Ship(STARTING_OXYGEN, STARTING_HULL, SHIP_NAME, CREW_DESCRIPTION)
```

Now we can move jobs that belong to the ship into its methods. Travelling costs oxygen, so the ship can handle that deduction itself:

```python
def deduct_oxygen(self):
    self.oxygen -= 8
```

This method sits inside `Ship`. In the game loop, we call it with `ship.deduct_oxygen()`.

The same applies to displaying resources and checking for defeat. Instead of passing two loose values into `show_resources(oxygen, hull)` or `check_defeat_status(oxygen, hull)`, we use:

```python
ship.show_resources()
cause = ship.check_defeat_status()
```

Those methods already have access to the right values through `self`. We can also refactor our other functions to receive the ship object directly. That means fewer values to pass around and fewer assignments to keep track of in the main loop.

## THE NEXT JOB TO REFACTOR

That cleanup brought our attention to `process_destination()`. It was still handing separate resource values to the engine and collecting updated values afterwards:

```python
oxygen, hull, narration = process_encounter(destination, oxygen, hull)
```

Different encounters have different rules. An asteroid field damages the hull. Raiders damage the hull and use extra oxygen. A trader restores resources. All of that behaviour was hidden behind the engine's function.

This was a good opportunity to practise classes again. Each encounter has information of its own, such as a danger level or an amount of damage, and a job to perform when the ship arrives. We already had the ingredients to give those rules clearer homes.

## ONE CLASS FOR EACH ENCOUNTER

Let's start with an asteroid field. Before adding the morale modifier, its rule looks like this:

```python
class AsteroidField:
    def __init__(self, danger_level):
        self.danger_level = danger_level
        self.base_damage = 10

    def process(self, ship):
        damage = self.base_damage + (self.danger_level * 2)
        ship.hull = ship.hull - damage
        return f"  Asteroid debris slams into the hull! Hull takes {damage} damage."
```

The constructor stores the danger level and base damage on this encounter object. Its `process()` method receives a ship, calculates the damage, changes that ship's hull and returns some narration.

For a danger level of 3, the damage is `10 + (3 * 2)`, which gives us 16. A ship starting with 100 hull would have 84 afterwards.

Notice that we don't need to return the hull value. `ship` refers to the same object the game is using, so changing `ship.hull` updates that object's state directly. We still return the narration because the calling code needs to display it.

We then follow the same pattern for the other encounters:

| Class           | What happens to the ship?                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `AsteroidField` | Takes hull damage based on danger and morale; loses 5 morale.                                         |
| `Raider`        | Takes hull damage based on danger and morale, uses extra oxygen based on morale, and loses 10 morale. |
| `Trader`        | Restores oxygen and hull based on morale; gains 10 morale.                                            |
| `EmptySpace`    | Gives the crew a rest and restores 5 morale.                                                          |

Every class has a `process(ship)` method. The internal rules differ, but the code using an encounter can call each one in exactly the same way. We don't need [inheritance](https://www.codecademy.com/article/what-is-python-inheritance) to make that work: each class simply provides the method we expect.

## CHOOSING THE RIGHT ENCOUNTER OBJECT

Our planets already have dictionaries describing their features. We can use those to decide which encounter object to create:

```python
def create_encounter(destination):
    encounter_type = destination["encounter"]
    danger = destination["danger_level"]

    if encounter_type == "asteroid_field":
        return AsteroidField(danger)
    elif encounter_type == "raider":
        return Raider(danger)
    elif encounter_type == "trader":
        return Trader()
    else:
        return EmptySpace()
```

The encounter type selects the class. The danger level is passed into asteroid fields and raiders, where it affects damage. Traders and empty space don't need a danger argument in our current design.

The function returns an **object created from the class**. That distinction matters: `AsteroidField` names the class, while `AsteroidField(danger)` creates a particular asteroid field with its own danger level.

Inside `process_destination()`, the encounter handling becomes:

```python
encounter = create_encounter(destination)
narration = encounter.process(ship)
show_encounter(narration)
```

Create the encounter, let it act on the ship, then display what happened. `process_destination()` still handles the player's decision to stop and the water bonus, but the rules for each encounter now live in their classes.

## MORALE AS A MODIFIER

We introduce morale inside the ship's constructor:

```python
self.morale = 100
```

At 100 morale, rewards and damage have their normal values. Above 100, trader rewards grow and damage shrinks. Below 100, the crew receives less help and takes more damage.

There are two multipliers behind this:

```python
# Trader rewards
amount = int(base_amount * ship.morale / 100)

# Encounter damage and raider oxygen costs
amount = int(base_amount * (200 - ship.morale) / 100)
```

For rewards, morale of 80 gives us a multiplier of `0.8`. For damage, that same morale gives us `(200 - 80) / 100`, or `1.2`. One outcome becomes smaller while the other becomes larger.

Here's what that means for a trader's base oxygen refill of 15 and an asteroid field with danger level 3:

| Morale | Trader oxygen refill | Asteroid hull damage |
| ------ | -------------------- | -------------------- |
| 80     | `int(15 * 0.8)` = 12 | `int(16 * 1.2)` = 19 |
| 100    | `int(15 * 1.0)` = 15 | `int(16 * 1.0)` = 16 |
| 120    | `int(15 * 1.2)` = 18 | `int(16 * 0.8)` = 12 |

`int()` removes the fractional part so our resources change by whole numbers. For example, `19.2` becomes `19`.

In the final asteroid class, we calculate damage using the ship's current morale, then reduce morale for the next encounter:

```python
def process(self, ship):
    damage = self.base_damage + (self.danger_level * 2)
    damage = int(damage * (200 - ship.morale) / 100)
    ship.hull = ship.hull - damage
    ship.morale = ship.morale - 5
    return f"  Asteroid debris slams into the hull! Hull takes {damage} damage."
```

The order matters. The crew's morale coming into the encounter determines this encounter's damage. The morale loss then influences what happens later. Traders use the same ordering: calculate the reward first, then add 10 morale.

This creates a feedback loop. Repeated harmful encounters can demoralise the crew, making later attacks more expensive and trader visits less helpful. Rest and friendly encounters can help the crew recover. As captain, you have to weigh the danger of stopping against the opportunity to replenish resources and improve morale.

In our final code, travel still costs a fixed 8 oxygen and water restores a fixed 20 oxygen, along with 5 morale. Flying past leaves morale unchanged. The modifier applies to the encounter damage, raider oxygen cost and trader rewards.

This is a first balancing system we can experiment with. One useful next improvement would be to limit morale to a range such as 50 to 150. Our current code doesn't impose limits, so extreme morale values can eventually produce strange results from these formulas.

## GIVING EACH FILE A CLEAR JOB

Once the objects were working together, we organised the project into three main files:

- `classes.py` holds `Ship` and all four encounter classes. This grew out of `player.py`, so we renamed it to reflect its wider role.
- `functions.py` holds helpers such as `should_stop()`, `scan_destination()`, `create_encounter()` and `process_destination()`.
- `game.py` imports what it needs and directs the journey.

The game loop now reads like a sequence of actions:

```python
for i in range(len(galaxy)):
    destination = galaxy[i]
    show_destination(destination, i, len(galaxy))
    scan_destination(destination)
    ship.deduct_oxygen()
    process_destination(ship, destination)
    ship.show_resources()
    cause = ship.check_defeat_status()

    if cause:
        show_defeat(ship.name, cause)
        return

show_victory(ship.name)
```

We can follow the flow without reading every arithmetic rule. If we want to change asteroid damage, we open `AsteroidField`. If we want to change how a destination is processed, we open `process_destination()`. The loop can stay focused on the journey.

## BRINGING THE COURSE TOGETHER

The reorganisation is refactoring: moving existing responsibilities into clearer functions, methods and files while preserving what those parts of the game do. Adding morale is a separate change to the game's behaviour. Keeping that distinction in mind helps us check our work: first make sure the reorganised code still works, then check that the new mechanic changes outcomes as intended.

This is the kind of decision we wanted learners to practise. A working codebase gives us something concrete to inspect. We notice values that keep travelling together, functions with too many responsibilities, or rules that would be easier to change if they lived in one place. Then we use the tools we've learned to improve that design, running the game as we go.

Across the course, we've used input, conditionals, lists, loops, dictionaries, functions and classes to build a space adventure. In this final week, those pieces work together in a project we can read, explain and extend.

Try adding a new encounter with its own `process(ship)` method, changing the morale adjustments, or improving the scanner to explain how the crew's current morale might affect a stop. Run the game, read the resource values and see how your choices change the experience. There is plenty of room to make the adventure your own.

## THE FINAL CODE

You can compare the [end-of-Week-4 code](https://gist.github.com/lauval/769226f664efc890c244a2b37acac92c) with the [end-of-Week-5 code](https://gist.github.com/lauval/33d4b15f80eea8f4a50d81c07a14c6a7). The Week 5 gist contains `classes.py`, `functions.py` and `game.py`, to use alongside the existing engine and constants in your project.
