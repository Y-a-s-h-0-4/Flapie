"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RecipeForm from '@/components/RecipeForm';
import { connectToDB } from '@/utils/database';
import Recipe from '@/models/recipe';

function UpdateRecipeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeId = searchParams.get('id');
        if (!recipeId) {
          setError('No recipe ID provided');
          return;
        }

        await connectToDB();
        const foundRecipe = await Recipe.findById(recipeId);
        
        if (!foundRecipe) {
          setError('Recipe not found');
          return;
        }

        if (foundRecipe.creator.toString() !== session?.user?.id) {
          setError('You are not authorized to edit this recipe');
          return;
        }

        setRecipe(foundRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Failed to load recipe');
      }
    };

    if (session?.user) {
      fetchRecipe();
    }
  }, [searchParams, session]);

  const handleSubmit = async (formData) => {
    try {
      const recipeId = searchParams.get('id');
      const response = await fetch(`/api/recipe/${recipeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update recipe');
      }

      router.push('/profile');
    } catch (error) {
      console.error('Error updating recipe:', error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Recipe</h1>
      <RecipeForm
        type="Edit"
        recipe={recipe}
        setRecipe={setRecipe}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default function UpdateRecipe() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    }>
      <UpdateRecipeContent />
    </Suspense>
  );
} 