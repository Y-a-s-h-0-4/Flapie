import Recipe from "@models/recipe";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const recipe = await Recipe.findById(params.id).populate("creator");
        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(recipe), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch recipe" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const PATCH = async (request, { params }) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, category, images } = await request.json();

        // Validate required fields
        if (!title || !description || !ingredients || !instructions || !cookingTime || !category) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectToDB();

        // Find the existing recipe by ID
        const existingRecipe = await Recipe.findById(params.id);

        if (!existingRecipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update the recipe with new data
        existingRecipe.title = title;
        existingRecipe.description = description;
        existingRecipe.ingredients = ingredients;
        existingRecipe.instructions = instructions;
        existingRecipe.cookingTime = cookingTime;
        existingRecipe.category = category;
        existingRecipe.images = images;

        await existingRecipe.save();

        return new Response(JSON.stringify({ message: "Recipe updated successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error updating recipe:", error);
        return new Response(JSON.stringify({ error: "Failed to update recipe" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ error: "You must be logged in to delete a recipe" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectToDB();

        // Find the recipe by ID
        const recipe = await Recipe.findById(params.id);

        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if the user is the creator of the recipe
        if (recipe.creator.toString() !== session.user.id) {
            return new Response(JSON.stringify({ error: "You can only delete your own recipes" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Delete the recipe
        await Recipe.findByIdAndDelete(params.id);

        return new Response(JSON.stringify({ message: "Recipe deleted successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return new Response(JSON.stringify({ error: "Failed to delete recipe" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 