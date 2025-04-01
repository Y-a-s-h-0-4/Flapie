import Recipe from "@models/recipe";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
    try {
        await connectToDB()

        const recipes = await Recipe.find({}).populate('creator')

        return new Response(JSON.stringify(recipes), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all recipes", { status: 500 })
    }
}

export const POST = async (request) => {
    try {
        await connectToDB();

        const { title, description, ingredients, instructions, cookingTime, category, images, creator } = await request.json();

        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            category,
            images,
            creator
        });

        return new Response(JSON.stringify(recipe), { status: 201 });
    } catch (error) {
        return new Response("Failed to create recipe", { status: 500 });
    }
}; 