import { Schema, model, models } from 'mongoose';

const RecipeSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Title is required!'],
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
  },
  ingredients: {
    type: [String],
    required: [true, 'At least one ingredient is required!'],
  },
  instructions: {
    type: [String],
    required: [true, 'At least one instruction is required!'],
  },
  cookingTime: {
    type: String,
    required: [true, 'Cooking time is required!'],
  },
  category: {
    type: String,
    required: [true, 'Category is required!'],
    enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snacks', 'vegetarian', 'vegan'],
  },
  images: {
    type: [String],
    default: [],
  },
});

const Recipe = models.Recipe || model('Recipe', RecipeSchema);

export default Recipe; 