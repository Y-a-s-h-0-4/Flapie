"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreateRecipe = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [recipe, setRecipe] = useState({ 
    title: "", 
    description: "", 
    ingredients: [], 
    instructions: [], 
    cookingTime: "", 
    category: "",
    images: []
  });

  const createRecipe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        body: JSON.stringify({
          ...recipe,
          creator: session?.user.id,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type='Create'
      recipe={recipe}
      setRecipe={setRecipe}
      submitting={submitting}
      handleSubmit={createRecipe}
    />
  );
};

export default CreateRecipe; 