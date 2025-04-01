import { connectToDB } from "@utils/database";
import Recipe from "@models/recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Not authenticated" }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (session.user.id !== params.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { 
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectToDB();

        const savedRecipes = await Recipe.find({
            savedBy: new mongoose.Types.ObjectId(params.id)
        }).populate('creator');

        return new Response(JSON.stringify(savedRecipes), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch saved recipes" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 