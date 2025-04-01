"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RecipePage = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch recipe");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/recipe/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete recipe");
      }

      router.push("/profile");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Recipe not found</h1>
          <p className="text-gray-600">The recipe you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isCreator = session?.user?.id === recipe.creator?._id;

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-16 sm:mt-20">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Recipe Header */}
        <div className="relative h-48 sm:h-64 bg-gray-100">
          {recipe.images && recipe.images.length > 0 ? (
            <img
              src={recipe.images[0]}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg
                className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <span className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                {recipe.category}
              </span>
              <span className="text-white/80 flex items-center gap-1 text-sm sm:text-base">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {recipe.cookingTime}
              </span>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="p-4 sm:p-6">
          <p className="text-gray-600 mb-6 break-words">{recipe.description}</p>

          {/* Ingredients */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2 break-words">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 sm:gap-4 break-words">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pt-6 border-t">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => {
                  const recipeText = `
Recipe: ${recipe.title}
Category: ${recipe.category}
Cooking Time: ${recipe.cookingTime}

Description:
${recipe.description}

Ingredients:
${recipe.ingredients.map((i) => `- ${i}`).join("\n")}

Instructions:
${recipe.instructions.map((i, index) => `${index + 1}. ${i}`).join("\n")}
                  `;
                  navigator.clipboard.writeText(recipeText);
                  alert("Recipe copied to clipboard!");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Share Recipe
              </button>
            </div>
            {isCreator && (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => router.push(`/update-recipe?id=${id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto justify-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Recipe
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto justify-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage; 