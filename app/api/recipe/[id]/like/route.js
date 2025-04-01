import { connectToDB } from "@utils/database";
import Recipe from "@models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export const POST = async (request, { params }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Not authenticated" }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectToDB();
        
        // Convert user ID to ObjectId
        const userId = new mongoose.Types.ObjectId(session.user.id);
        
        // Find and update the recipe in one operation
        const recipe = await Recipe.findById(params.id);
        
        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const isLiked = recipe.likes.some(id => id.equals(userId));

        if (isLiked) {
            // Unlike: Remove user ID from likes array
            await Recipe.findByIdAndUpdate(params.id, {
                $pull: { likes: userId }
            });
        } else {
            // Like: Add user ID to likes array
            await Recipe.findByIdAndUpdate(params.id, {
                $addToSet: { likes: userId }
            });
        }

        // Get updated recipe to return accurate likes count
        const updatedRecipe = await Recipe.findById(params.id);

        return new Response(JSON.stringify({ 
            message: isLiked ? "Recipe unliked" : "Recipe liked",
            likes: updatedRecipe.likes.length,
            isLiked: !isLiked
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error handling like:", error);
        return new Response(JSON.stringify({ error: "Failed to process like" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 