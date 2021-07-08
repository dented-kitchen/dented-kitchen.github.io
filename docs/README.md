# Introduction

Welcome to Dented Kitchen! We are the team behind Replicake, a library that lets you write powerful, dynamic recipes for cooking and baking. This introduction will show you how to create a recipe and give you a look at some of the library features. We'll also show you how those features are powered by Pantry, our open source ingredient data set.

## What is Replicake?

Replicake is an open source Javascript library for the creation and manipulation of cooking and baking recipes. After creating a recipe, you can query for nutrition information, serving sizes and preparation time, or tweak your recipe by making allergy substitutions, flavor customizations, or updating the instructions depending on equipment availability (such as a stand mixer). Check out the `Recipe` class for more details.

## Creating your first recipe

Let's get started by creating your first recipe:

``` js
import Replicake from 'replicake';
import Pantry from '@dented-kitchen/pantry';

// Use our open source ingredient dataset
Replicake.use(Pantry);

let muffins = Replicake.Create({
  ingredients: {
    flour: '240g',
    sugar: '120g',
    bakingpowder: '14g',
    salt: '5g',
    eggs: '1',
    milk: '170g',
    vanilla: '1/2 tsp',
    buttermelted: '1 stick',
  },
  equipment: {
    oven: Replicake.Oven,
    bowl: Replicake.Bowl,
    bowl2: {
      type: Replicake.Bowl,
      name: 'another bowl',
    },
    pan: {
      type: Replicake.Pan,
      name: 'muffin pan',
    },
  },
  instructions: [
    preheat({ temperature: '400F' }),
    mix({ target: 'bowl', ingredients: tagged('dry') }),
    mix({ target: 'bowl2', ingredients: tagged('wet') }),
    mix({ target: 'bowl', ingredients: 'bowl2', suffix: 'until just combined' }),
    distribute({ target: 'pan', ingredients: 'bowl' }),
    bake({ target: 'pan', duration: { min: '20m', max: '30m' }, product: 'muffins' }),
    cool({ target: 'muffins', duration: '10m' }),
  ],
});
```

Most recipes today (even digital) include instructions in plain text. This is how Replicake differs. We take advantage of the fact that most recipes consist of the same set of `Techniques` to automatically generate the instruction text based on what is being done. This is the instruction text for the `Recipe` object we created. Generating this text is done by simply converting the instructions to strings (implicitly calling `toString()`).

```

1. Melt 1 stick of unsalted butter and allow to cool to room temperature.
2. Preheat the overn to 375 F.
3. Sift together 240g all-purpose flour, 120g granulated sugar, 14g baking powder, 5g salt in a large bowl.
4. Mix together 1 egg (beaten), 170g whole milk, 1/2 tsp vanilla extract, and melted butter in a separate bowl.
5. Add milk mixture to flour mixture in large bowl and mix until just combined.
6. Distribute batter to muffin pan (50 - 55g per cup).
7. Bake muffins in oven for 20 - 30 minutes.
8. Allow muffins to cool for 10 minutes before enjoying!

```

## Making some tweaks

With this `Recipe` object you can easily switch units, calculate nutrition information, or estimate total time taken. It's also easy to apply ingredient customizations that are automatically reflected in the instructions. Let's add some flavor to our muffins. Here are a few options:

``` js
// Cinnamon raisin
muffins.customize({
  raisins: '80g',
  cinnamon: '1/2 tsp',
  nutmeg: '1/4 tsp',
});

// Blueberry
muffins.customize({
  blueberry: '160g',
});

// Honey Cornmeal
muffins.customize({
  flour: '-120g',
  cornmeal: '120g',
  sugar: '-60g',
  honey: '60g',
});

// Keep it basic!
// Removes any customizations added to this Recipe.
muffins.removeCustomizations();
```

Throughout these examples, you'll notice we've been using javascript property names for ingredients. These are keys into our `Pantry` dataset that contains the information needed for unit conversions, nutrition information, and special instructions.

## What is Pantry?

In order to enable the recipe features mentioned above, we utilize ingredient, equipment and technique data that is found in our open source `Pantry` dataset. Because this dataset is still growing, you'll likely end up needing to create this data for yourself if you author recipes. It's easy to merge custom data into our dataset or override properties entirely as needed.

Here's a snippet from a particular ingredient:

``` js
import Replicake from 'replicake';

let sugar = Replicake.CreateIngredient({
  name: 'granulated sugar',
  key: 'sugar',
  conversion: {
    volume: '1 cup',
    weight: '200g',
  },
  nutrition: {
    serving: '1 tsp',
    quantity: 4,
    calories: 15,
    fat: 0,
    carbs: 4,
    sugar: 4,
    protein: 0,
  },
});
```

You can check out the full list of ingredients in Pantry here. [TODO]

## Customizing your techniques

In order to customize the instruction text for recipes, you have a few options. First, there are some flags you can set directly. These flags can be used to alter how ingredient lists and their quantities are displayed in the instruction text.

``` js
recipe.setFlagShowIngredientQuantity(false);
recipe.setFlagQuantityAbbreviated(false);
```

It'll also be likely that you need to create a new `Technique` yourself as you create new recipes. Let's take a look at how the `preheat` and `mix` techniques are implemented in Pantry. Each technique maps to a real-world action and includes a name, what equipment is needed, and a template string for converting to a human readable string. The templates support certain arguments which allow the strings to be generated based on the recipe's ingredient list (among other variables).

``` js
import Replicake from 'replicake';

let preheat = Replicake.CreateTechnique({
  name: 'preheat',
  actions: [ setTemperature(oven, temperature) ],
  required: {
    equipment: { oven },
    temperature: true,
  },
  template: '${name} ${oven}${temperature}',
});

let mix = Replicake.CreateTechnique({
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

You can find more about Techniques and how to write them here [TODO].

Pantry includes a lot of techniques already, and if you only want to change the template, you can override it in a custom dataset or directly when creating the recipe. Just specify the new value under the proper keys in the object passed to the constructor. In fact, just about everything can be customized in this way, so it's a useful tip for testing or creating one-off behavior.

``` js
import Replicake from 'replicake';

let muffins = Replicake.Create({
  ingredients: { ... },
  instructions: [ ... ],
  techniques: {
    preheat: {
      // We can override the preheat template to add a convection tip
      template: '${name} ${oven} to 400F (375F if convection)',
    },
  },
});
```

[TODO] Why do we do it like this?

## What's next?

* Explore the list of ingredients, equipment and techniques already in the Pantry dataset.
* Check out the `Recipe` API to see what else you can do with our powerful dynamic recipes.
* We are open source! Contribute to our Replicake library or Pantry dataset.
* Share your projects. We love seeing what you've built.
