# Getting Started

Replicake is a Javascript library for the creation and manipulation of cooking and baking recipes. Pantry is an open-source set of JSON data that encodes recipe knowledge. These two work together to create a seamless experience. You are welcome to contribute to Pantry and use it as you wish. However, you can bring your own data if needed.

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

This will create a `Recipe` that contains instructions for making muffins from the ingredients. The `Pantry` library being used by `Replicake` contains the data that describes the 'muffin' method. This data is a JSON format that is read/written by our library. You can replace or extend the library of known methods by utilizing the `use()` method from the example.

Let's add some more flavor to our muffins:

``` js
// We can add certain ingredients directly
muffins.addIngredients({
  vanilla: '1 tsp',
  walnuts: '1/2 cup',
});

// Or we could substitute a different variation
muffins.substitute({ sugar: { variation: 'brown' }});
```

## Reading the instructions

After some changes to our `Recipe`, we want to see the instructions. We can get any instruction as a natural language string just by calling toString(). Logging the instructions to the console is as simple as:

``` js
muffin.instructions.forEach(i => console.log(i.toString()));
```

