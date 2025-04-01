'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RecipeForm = ({ type, recipe, setRecipe, handleSubmit }) => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientsChange = (e, index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = e.target.value;
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionsChange = (e, index) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = e.target.value;
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const removeInstruction = (index) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmit(recipe);
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={recipe.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Select a category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snack">Snack</option>
          <option value="Beverage">Beverage</option>
        </select>
      </div>

      <div>
        <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
          Cooking Time (minutes)
        </label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        <div className="mt-2 space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientsChange(e, index)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder={`Ingredient ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-green-600 hover:text-green-800"
          >
            + Add Ingredient
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <div className="mt-2 space-y-2">
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionsChange(e, index)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder={`Step ${index + 1}`}
                rows={2}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="text-green-600 hover:text-green-800"
          >
            + Add Step
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : type === 'Create' ? 'Create Recipe' : 'Update Recipe'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm; 