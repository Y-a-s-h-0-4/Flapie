"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const UpdateRecipe = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  const [submitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    cookingTime: "",
    category: "",
    images: []
  });

  useEffect(() => {
    const getRecipeDetails = async () => {
      try {
        const response = await fetch(`/api/recipe/${recipeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await response.json();

        setRecipe({
          title: data.title,
          description: data.description,
          ingredients: data.ingredients,
          instructions: data.instructions,
          cookingTime: data.cookingTime,
          category: data.category,
          images: data.images
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) getRecipeDetails();
  }, [recipeId]);

  const updateRecipe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipe/${recipeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      router.push(`/recipe/${recipeId}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
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

  return (
    <Form
      type='Edit'
      recipe={recipe}
      setRecipe={setRecipe}
      submitting={submitting}
      handleSubmit={updateRecipe}
    />
  );
};

export default UpdateRecipe; 