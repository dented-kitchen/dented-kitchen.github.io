# Getting Started

::: warning Outline Notes (TODO)

* What is Replicake?
* Creating our first recipe
* Make some tweaks

* What is Pantry?
* Writing your own method
* Contributions are needed
* Explore Replicake library
* View Pantry methods, ingredient and equipment data

:::

## What is Replicake?

Replicake is an open-source Javascript library for the creation and manipulation of cooking and baking recipes. Pantry is an open-source set of JSON data that encodes ingredient and cooking knowledge. These two work together to create a seamless experience. You are welcome to use or modify Pantry data to fit you needs or you can use Repicake to create your own data as well.

### Features
* Translate units of measure
* Make substitutions
* Calculate nutrition facts
* Estimate active and total time
* Create flexible recipes that can adapt to ingredient availability
* Change recipe instructions based on kitchen equipment
* Simplify recipe and cookbook authoring by automating repeated descriptions and steps

## Creating your first recipe

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
muffins.substitute({ sugar: 'brownsugar' });
```

After some changes to our `Recipe`, we can check the instructions and see that the `sugar` (default: `granulated`) has been replaced by `brownsugar` and that the new flavor ingredients are added at the appropriate places in the recipe. The `muffin` method used in this example is the backbone of many simple muffin, scone, and quick bread recipes.

``` js
// View the updated instructions
muffins.instructions.forEach(i => console.log(i.toString()));

// This is what gets logged
// When you do this function
// Obviously this needs to be the actual instructions
// So that they get the idea
```

Let's take a look at what it takes to create the `Pantry` dataset needed to enable the various features of the Replicake library. The dataset consists of 4 core concepts: ingredients, equipment, techniques, and methods. These can be provided directly when creating a recipe, or a data object can be provided to the library via `Replicake.use(pantry)` which we show how to create below.

Note: The keys for each of these data sets must be unique within their respective data sets. Those keys are used when referencing other items in the data (for example, a technique may have a condition that requires a particular piece of equipment). When using more than one data set, keys are merged and existing properties overwritten by whichever data set is specified last. This allows you to easily expand and customize the `Pantry` data set.

``` js
import Pantry from 'pantry';

let pantry = Pantry.Create({
  ingredients: {
    flour: {},
    sugar: {
      name: 'granulated sugar',
      // Conversions can be provided to enable switching units
      conversion: {
        volume: '1 cup',
        weight: '200g',
      },

      // Nutrition information enables recipe totals
      nurtrition: { ... },
    },
    bakingsoda: {},
    // ...
  },
  equipment: { ... },
  techniques: { ... },
  methods: {
    muffin: {
    },
  },
})
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
      'Add the dry ingredients to a bowl and mix.',
      'Add the wet ingredients to the same bowl and mix until just combined.',
      'Evenly distribute mixture into muffin pan filling cups 2/3 of the way.',
      'Bake for 15 to 20 minutes.',
      'Allow muffins to cool for 10 minutes before enjoying!',
    ],
  },
});
```

While this allows you to easily create a `Recipe` from a set of natural language instructions, the dynamic features we used earlier on this page (adding flavor or substituting the sugar) will not work without explicitly enabling these features in your method. Let's leverage the `CreateMethod` function to create a method that allows us to add flavor ingredients and substitute brown sugar as seen above.

``` js
import Replicake from 'replicake';

let method = Replicate.CreateMethod({
  name: 'muffin', // Optional
  instructions: [
    preheat('oven', '350F'),
    mix('bowl', ingredientsTagged('dry')),
    mix('bowl', ingredientsTagged('wet')),      // Vanilla would be added here
    mix('bowl', ingredientsOfType('nuts')),     // Allows us to add walnuts
    distributeContents('bowl', 'muffin-pan'),
    bake('oven', 'muffin-pan', '15-20m'),
    cool('muffin-pan', '10m'),
  ],

  required: {
    // Any equipment referenced in instructions must be listed here
    equipment: ['oven', 'bowl', 'muffin-pan'],

    // Any ingredients referenced in instructions must be listed here
    // Since we don't mention any ingredients, we can leave this blank
    ingredients: [],
  },

  substitutions: [
    // CreateSubstitutionSimple allows all ingredients in
    //   the parameter list to be used for each other 1:1
    Replicake.CreateSubstitutionSimple('sugar', 'brown sugar'),
  ],
});
```

You'll notice that we no longer have simple text strings for our instructions. Instead, we will use what the library refers to as `Techniques` for creating much more powerful and dynamic instructions. A technique as used in this library describes *how* to do something. Techniques are used internally to manipulate the recipe state and validate the recipe. You can think of them as functions that can run only in the context of a Recipe. They are specified in data using JSON. Some (such as `preheat` and `mix`) are included in `Replicake` while others are only in the `Pantry` data set. As with methods, you can create them yourself.

::: tip Why do we do this?

By translating the process into data, we improve upon the traditional recipe model in a lot of ways. With the ingredients and method separated, we can create many recipes that use the same method. By further representing instructions as these techniques, we separate the presentation layer from what physical actions are being performed by someone making the recipe. This makes it easy to translate an entire library of recipes by translating the techniques used or write recipes that work no matter what equipment or ingredient substitutions the baker has to make.

By separating it into the `Pantry` data set, we allow you to customize the library as needed. You can bring your own data, use and modify ours, or help us grow our free and open source data set by contributing translations!

:::

As we said, `preheat` and `mix` are techniques that already exist within the library, but we could just as easily create them ourselves. Let's use the `CreateTechnique` function to show you just how you'd do that. Techniques have a name, required equipment (just like methods), and a template that defines how it is turned into a natural language string (typically using the name).

These techniques also have a set of actions that represent the state change in the recipe. There are a very limited set of actions such as combining, dividing, shaping or changing state. Many techniques may have the same set of actions. This corresponds to when you want to perform a certain action in a certain way (e.g 'fold in the cheese' is fundamentally the action of mixing, but it is done in a distinct way and we may want to distinguish it in our recipe).

``` js
import Replicake from 'replicake';

let preheat = Replicate.CreateTechnique({
  name: 'preheat',
  actions: [ setTemperature(oven, temperature) ],
  required: {
    equipment: { oven },
    temperature: true,
  },
  template: '${name} ${oven}${temperature}',
});

let mix = Replicate.CreateTechnique({
  name: 'mix',
  actions: [
    // Add ingredients to the target if not already there
    move(ingredients, target),

    // Transform ingredients and target contents into the product
    transform(ingredients, target.contents, product),
  ],
  required: {
    ingredients: true,
    product: true,
    target: true,
  },
  template: 'in the ${target}, ${name} together ${ingredients}${product}',
});

```

In addition to methods and techniques, you can use Replicake to create ingredients and kitchen equipment needed for your recipes. Ideally, the `Pantry` library will contain the ingredient data needed, but it is currently limited to baking recipes and includes mostly common pantry items.

::: warning This is very complicated for just a recipe!

We know! The truth is that while there is a lot of power in changing the way we think about and store recipes, it takes a lot of effort to get there. But we think our approach allows for the right amount of flexibility versus ease of use. As our `Pantry` data set grows, we hope for it to become the de facto set of ingredient, equipment and technique data that will allow any number of applications to benefit.

Until we get there, we can use your help and contributions are welcome!

:::


The `Pantry` section of these docs details every ingredient, piece of equipment, technique and method in our library, their typical use in cooking/baking recipes, and shows example recipes that use them.

