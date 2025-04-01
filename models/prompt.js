import { Schema, model, models } from 'mongoose';

const RecipeSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Recipe title is required.'],
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required.'],
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients are required.'],
  },
  instructions: {
    type: [String],
    required: [true, 'Cooking instructions are required.'],
  },
  cookingTime: {
    type: String,
    required: [true, 'Cooking time is required.'],
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: [true, 'Recipe category is required.'],
  }
});

const Recipe = models.Recipe || model('Recipe', RecipeSchema);

export default Recipe;