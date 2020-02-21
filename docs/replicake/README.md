# Replicake
Replicake is a javascript library for the creation and manipulation of Recipes.

Traditional recipes are written and stored as plain text. This has numerous disadvantages:
1. Difficult to compare recipes.
1. Difficult to modify recipes/make substitutions.
1. Recipe quality is limited by both writing ability of author and how well reader understands what is written.
1. Recipes often make assumptions about what equipment is needed or available, forcing reader to manually make adjustments or find a different recipe.
1. Time consuming to translate recipes to other languages.

Replicake provides a framework to work around these issues. It primarily achieves this by decoupling the physical action being performed from the plain text description of that action. A recipe in Replicake is represented by 4 main components: ingredients, equipment, techniques, and instructions.

## Ingredient

Ingredients are items thats are consumed during the creation of a recipe. Generally, they should include a quantity value when included in a Recipe.

## Equipment

Equipment are items that are used during the creation of a recipe.

## Technique

A technique describes a sequence of Actions that should be performed as well as a template for the generation of a plain text description of those actions. Techniques also define conditionals, required ingredients/equipment, and additional parameters than can be specified in a Recipe when using the Technique. It may be helpful to think of a technique as a function that is 'executed' during a recipe using certain ingredients and equipment provided as parameters.

## Instruction

A Recipe will contain a list of Instructions that must be executed in sequence to produce the desire result. Instructions are complex objects that consist of a Technique, a list of input Ingredients, a list of Equipment, any parameters (specified in the Technique data), and optionally a Product that is produced. 
