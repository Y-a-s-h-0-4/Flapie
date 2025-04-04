"use client";

import { useState, useEffect, Suspense } from "react";
import Feed from "@components/Feed";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const response = await fetch("/api/recipe");
      const data = await response.json();
      setRecipes(data);
      setIsLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share
        <br className="max-md:hidden" />
        <span className="green_gradient"> Amazing Recipes</span>
      </h1>
      <p className="desc text-center">
        Flapie is an open-source recipe sharing platform for the world to discover, create and share creative recipes.
      </p>

        <Feed recipes={recipes} isLoading={isLoading} />
    </section>
  );
};

export default Home; 