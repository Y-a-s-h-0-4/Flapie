"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const RecipeCard = ({ post, handleEdit, handleDelete, handleCategoryClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleShare = () => {
    const recipeText = `
${post.title}

Description:
${post.description}

Ingredients:
${post.ingredients.map(ing => `- ${ing}`).join('\n')}

Instructions:
${post.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

Cooking Time: ${post.cookingTime}
Category: ${post.category}
    `;
    
    navigator.clipboard.writeText(recipeText);
  };

  return (
    <div className='recipe_card'>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleShare}>
          <Image
            src="/assets/icons/share.svg"
            alt="share_icon"
            width={12}
            height={12}
          />
        </div>
      </div>

      <h2 className='my-4 font-satoshi text-xl font-bold text-gray-900'>{post.title}</h2>
      <p className='font-satoshi text-sm text-gray-700 mb-4'>{post.description}</p>
      
      <div className='mb-4'>
        <h3 className='font-semibold text-gray-900 mb-2'>Ingredients:</h3>
        <ul className='list-disc list-inside space-y-1'>
          {post.ingredients.map((ingredient, index) => (
            <li key={index} className='text-sm text-gray-700'>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className='mb-4'>
        <h3 className='font-semibold text-gray-900 mb-2'>Instructions:</h3>
        <ol className='list-decimal list-inside space-y-1'>
          {post.instructions.map((instruction, index) => (
            <li key={index} className='text-sm text-gray-700'>{instruction}</li>
          ))}
        </ol>
      </div>

      <div className='flex items-center gap-4 text-sm text-gray-700 mb-4'>
        <span>⏱️ {post.cookingTime}</span>
        <span
          className='blue_gradient cursor-pointer'
          onClick={() => handleCategoryClick && handleCategoryClick(post.category)}
        >
          {post.category}
        </span>
      </div>

      {post.images && post.images.length > 0 && (
        <div className='grid grid-cols-2 gap-2 mb-4'>
          {post.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Recipe image ${index + 1}`}
              width={200}
              height={200}
              className='rounded-lg object-cover'
            />
          ))}
        </div>
      )}

      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;