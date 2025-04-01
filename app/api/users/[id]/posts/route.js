import Recipe from "@models/recipe";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const recipes = await Recipe.find({ creator: params.id }).populate("creator")

        return new Response(JSON.stringify(recipes), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch recipes created by user", { status: 500 })
    }
} 