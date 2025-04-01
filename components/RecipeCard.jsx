"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RecipeCard = ({ recipe }) => {
  const [copied, setCopied] = useState("");

  const handleShare = async () => {
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
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleShare();
              }}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors duration-200"
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
          </div>
        </div>
      </Link>

      <div className="p-4">
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
            className="text-green-500 hover:text-green-600 font-medium text-sm"
          >
            View Recipe →
          </Link>
          {copied && (
            <span className="text-sm text-green-500 animate-fade-in-out">
              {copied}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 