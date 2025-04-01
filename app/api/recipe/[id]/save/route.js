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
        const recipe = await Recipe.findById(params.id);
        
        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userId = session.user.id;
        const isSaved = recipe.savedBy.some(id => id.toString() === userId);

        if (isSaved) {
            // Unsave: Remove user ID from savedBy array
            recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== userId);
        } else {
            // Save: Add user ID to savedBy array
            recipe.savedBy.push(new mongoose.Types.ObjectId(userId));
        }

        await recipe.save();

        return new Response(JSON.stringify({ 
            message: isSaved ? "Recipe unsaved" : "Recipe saved",
            isSaved: !isSaved
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error handling save:", error);
        return new Response(JSON.stringify({ error: "Failed to process save" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 