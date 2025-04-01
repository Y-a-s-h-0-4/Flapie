require('dotenv').config();
const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const Recipe = require('../app/models/recipe').default;

async function clearRecipes() {
  try {
    await connectToDB();
    await Recipe.deleteMany({});
    console.log('All recipes have been deleted successfully');
  } catch (error) {
    console.error('Error clearing recipes:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

clearRecipes(); 