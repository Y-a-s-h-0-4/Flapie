import RecipeCard from "./RecipeCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='green_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      <div className='mt-10 recipe_layout'>
        {data.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            handleEdit={() => handleEdit && handleEdit(recipe)}
            handleDelete={() => handleDelete && handleDelete(recipe)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;