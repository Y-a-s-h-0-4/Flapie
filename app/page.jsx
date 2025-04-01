"use client";

import { useState, useEffect } from "react";
import Feed from "@components/Feed";

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipe");
      const data = await response.json();
      setRecipes(data);
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

      <Feed recipes={recipes} />
    </section>
  );
};

export default Home; 