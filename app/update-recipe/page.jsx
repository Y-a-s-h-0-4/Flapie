"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RecipeForm from '@/components/RecipeForm';

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

        const response = await fetch(`/api/recipe/${recipeId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch recipe');
        }

        const data = await response.json();
        
        if (data.creator._id !== session?.user?.id) {
          setError('You are not authorized to edit this recipe');
          return;
        }

        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error.message);
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
        credentials: 'include',
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Recipe</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <RecipeForm
          type="Edit"
          recipe={recipe}
          setRecipe={setRecipe}
          handleSubmit={handleSubmit}
        />
      </div>
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