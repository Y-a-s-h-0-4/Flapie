"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyRecipes(data);
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
        await fetch(`/api/recipe/${recipe._id.toString()}`, {
          method: "DELETE",
        });

        const filteredRecipes = myRecipes.filter((item) => item._id !== recipe._id);

        setMyRecipes(filteredRecipes);
      } catch (error) {
        console.log(error);
      }
    }
  };

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