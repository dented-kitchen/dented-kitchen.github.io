# Getting Started

Replicake is an open-source Javascript library for the creation and manipulation of cooking and baking recipes. Pantry is an open-source set of JSON data that encodes ingredient and cooking knowledge. These two work together to create a seamless experience. You are welcome to use or modify Pantry data to fit you needs or you can use Repicake to create your own data as well.

## Creating a recipe

Let's get started by creating your first recipe:

``` js
import Pantry from 'pantry';
import Replicake from 'replicake';

// Use our open-source ingredient and recipe method library
Replicake.use(Pantry);

let muffins = Replicake.Create({
  ingredients: {
    flour: '500g',
    bakingsoda: '7g',
    salt: '7g',
    butter: '1 stick',
    sugar: '200g'
    eggs: '3',
  },
  method: 'muffin',
});
```

This will create a `Recipe` object that contains instructions for making muffins from the provided ingredients. This object allows you to retrieve these instructions and render them as natural language strings, simply by calling `toString()`.

``` js
muffins.instructions.forEach(i => console.log(i.toString()));

// This is what gets logged
// When you do this function
// Obviously this needs to be the actual instructions
// So that they get the idea
```

This conversion from keyed ingredient list to fully-fledged recipe is done by the Replicake library by applying the Pantry data as seen in the example above. Without this data, you would need to provide the `method` yourself (as `muffin` is a method provided in the Pantry data). Methods contain the instructions that must be executed to complete the recipe. A method is intended to decouple the ingredients from the process, allowing for recipes that can dynamically adjust for changes in ingredients, equipment available to the baker and other factors.

You can see this in action by adding some flavor to our muffins:

``` js
// We can add certain ingredients directly
muffins.addIngredients({
  vanilla: '1 tsp',
  walnuts: '1/2 cup',
});

// Or we could substitute a different variation
muffins.substitute({ sugar: { variation: 'brown' }});
```

After some changes to our `Recipe`, we can check the instructions and see that the `sugar` (default: `granulated`) has been replaced by `brown sugar` and that the new flavor ingredients are added at the appropriate places in the recipe. The `muffin` method used in this example is the backbone of many simple muffin, scone, and quick bread recipes.

``` js
// View the updated instructions
muffins.instructions.forEach(i => console.log(i.toString()));

// This is what gets logged
// When you do this function
// Obviously this needs to be the actual instructions
// So that they get the idea
```

## Supplying your own method

If `Pantry` does not include the method you need (consider contributing!) or you aren't using it, you will need to provide a method when creating your recipe. The simplest method is a list of natural language instructions.

``` js
import Replicake from 'replicake';

let muffins = Replicake.Create({
  ingredients: {
    flour: '500g',
    bakingsoda: '7g',
    salt: '7g',
    butter: '1 stick',
    sugar: '200g'
    eggs: '3',
  },
  method: {
    name: 'muffin', // Optional
    instructions: [
      'Preheat oven to 350F.',
      // ...
      'Allow muffins to cool for 10 minutes before enjoying!',
    ],
  },
});
```

While this allows you to easily create a `Recipe` from a set of natural language instructions, the dynamic features we used earlier on this page (adding flavor or substituting the sugar) will not work without explicitly enabling these features in your method. If you'd like to learn more, you can check out the section in the doc on [Methods and Techniques].

The `Pantry` section of these docs details every ingredient, piece of equipment, technique and method in our library, their typical use in cooking/baking recipes, and shows example recipes that use them.

