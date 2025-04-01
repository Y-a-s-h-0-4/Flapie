import Recipe from "@models/recipe";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    const { userId, title, description, ingredients, instructions, cookingTime, category, images } = await request.json();

    try {
        await connectToDB();
        const newRecipe = new Recipe({ 
            creator: userId, 
            title, 
            description, 
            ingredients, 
            instructions, 
            cookingTime, 
            category,
            images 
        });

        await newRecipe.save();
        return new Response(JSON.stringify(newRecipe), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new recipe", { status: 500 });
    }
} 