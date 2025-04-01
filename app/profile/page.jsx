"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myRecipes, setMyRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setMyRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError(error.message);
      }
    };

    if (session?.user.id) fetchRecipes();
  }, [session?.user.id]);

  const handleEdit = (recipe) => {
    router.push(`/update-recipe?id=${recipe._id}`);
  };

  const handleDelete = async (recipe) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/recipe/${recipe._id.toString()}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete recipe');
        }

        const filteredRecipes = myRecipes.filter((item) => item._id !== recipe._id);
        setMyRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error deleting recipe:', error);
        setError(error.message);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional recipes and inspire others with the power of your culinary creativity'
      data={myRecipes}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;