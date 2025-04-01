import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Form = ({ type, recipe, setRecipe, submitting, handleSubmit }) => {
  const router = useRouter();
  const [ingredients, setIngredients] = useState(recipe?.ingredients || [""]);
  const [instructions, setInstructions] = useState(recipe?.instructions || [""]);
  const [images, setImages] = useState(recipe?.images || []);
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!recipe.title.trim()) newErrors.title = "Title is required";
    if (!recipe.description.trim()) newErrors.description = "Description is required";
    if (!recipe.cookingTime.trim()) newErrors.cookingTime = "Cooking time is required";
    if (!recipe.category) newErrors.category = "Category is required";
    if (ingredients.some(ing => !ing.trim())) newErrors.ingredients = "All ingredients must be filled";
    if (instructions.some(inst => !inst.trim())) newErrors.instructions = "All instructions must be filled";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    const newPreviews = [...imagePreview];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          newImages.push(reader.result);
          setImagePreview(newPreviews);
          setImages(newImages);
          setRecipe({ ...recipe, images: newImages });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
    setRecipe({ ...recipe, images: newImages });
  };

  return (
    <section className="w-full max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {type} Recipe
      </h1>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            placeholder="Enter recipe title"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
            placeholder="Describe your recipe"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.ingredients ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              + Add Ingredient
            </button>
          </div>
          {errors.ingredients && (
            <p className="mt-1 text-sm text-red-500">{errors.ingredients}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.instructions ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              + Add Step
            </button>
          </div>
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Time
            </label>
            <input
              type="text"
              value={recipe.cookingTime}
              onChange={(e) => setRecipe({ ...recipe, cookingTime: e.target.value })}
              placeholder="e.g., 30 minutes"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.cookingTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cookingTime && (
              <p className="mt-1 text-sm text-red-500">{errors.cookingTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
        </label>
            <select
              value={recipe.category}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snacks">Snacks</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Images
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload images</span>
          <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="sr-only"
          />
        </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;