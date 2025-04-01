"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { useSession } from "next-auth/react";

const RecipeCard = ({ recipe: initialRecipe }) => {
  const { data: session } = useSession();
  const [copied, setCopied] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(initialRecipe.likes?.length || 0);
  const [recipe, setRecipe] = useState(initialRecipe);

  useEffect(() => {
    setRecipe(initialRecipe);
  }, [initialRecipe]);

  useEffect(() => {
    if (session?.user?.id && recipe) {
      // Convert ObjectId to string for comparison
      const likes = recipe.likes?.map(id => id.toString()) || [];
      const savedBy = recipe.savedBy?.map(id => id.toString()) || [];
      
      setIsLiked(likes.includes(session.user.id));
      setIsSaved(savedBy.includes(session.user.id));
      setLikesCount(likes.length);
    }
  }, [session?.user?.id, recipe]);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    await navigator.clipboard.writeText(recipeText);
    setCopied("Recipe copied!");
    setTimeout(() => setCopied(""), 3000);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.id) return;

    try {
      // Store current state
      const wasLiked = isLiked;
      
      // Optimistic update
      setIsLiked(!wasLiked);
      setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1);

      const response = await fetch(`/api/recipe/${recipe._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // Revert optimistic update if request fails
        setIsLiked(wasLiked);
        setLikesCount(wasLiked ? likesCount + 1 : likesCount - 1);
        throw new Error('Failed to like recipe');
      }

      const data = await response.json();
      // Update state with server response
      setIsLiked(data.isLiked);
      setLikesCount(data.likes);
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.id) return;

    try {
      // Store current state
      const wasSaved = isSaved;
      
      // Optimistic update
      setIsSaved(!wasSaved);

      const response = await fetch(`/api/recipe/${recipe._id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // Revert optimistic update if request fails
        setIsSaved(wasSaved);
        throw new Error('Failed to save recipe');
      }

      const data = await response.json();
      setIsSaved(data.isSaved);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/recipe/${recipe._id}`}>
        <div className="relative h-48 bg-gray-100">
          {recipe.images && recipe.images.length > 0 ? (
            <Image
              src={recipe.images[0]}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg
                className="w-24 h-24 text-gray-400"
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
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
            </button>
            {session?.user?.id && (
              <button
                onClick={handleSave}
                className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              >
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isSaved ? 'text-blue-500 fill-current' : 'text-gray-700'
                  }`}
                  fill={isSaved ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {recipe.creator?.image ? (
              <Image
                src={recipe.creator.image}
                alt={recipe.creator.username || 'User'}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  {(recipe.creator?.username || 'U')[0].toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600 font-medium">
              {recipe.creator?.username || 'Anonymous'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(recipe.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {recipe.category}
          </span>
          <span className="text-gray-500 text-sm flex items-center gap-1">
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

        <Link href={`/recipe/${recipe._id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors">
            {recipe.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            href={`/recipe/${recipe._id}`}
            className="text-green-500 hover:text-green-600 font-medium text-sm transition-colors"
          >
            View Recipe →
          </Link>
          <div className="flex items-center gap-2">
            {session?.user?.id && (
              <button
                onClick={handleLike}
                className="flex items-center gap-1 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                  {likesCount}
                </span>
              </button>
            )}
            {copied && (
              <span className="text-sm text-green-500 animate-fade-in-out">
                {copied}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 