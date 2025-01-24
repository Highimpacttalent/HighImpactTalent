import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io"; // Assuming you're using react-icons
import { useParams } from "react-router-dom";

const SingleBlog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blogId } = useParams();
  // Fetch blog data using axios
  const getBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://demojobportal.onrender.com/api-v1/blog/blog`,
        { id: blogId }
      );
      console.log(response);
      setBlog(response.data.blog);
    } catch (err) {
      setError("Failed to load the blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  // Like handler function
  const handleLike = async (id) => {
    try {
      await axios.post(`/api/blogs/${id}/like`); // Example API for liking a blog
      // Logic to update local state after liking
      setBlog((prevBlog) => ({
        ...prevBlog,
        likes: [...prevBlog.likes, "user-id"], // Append the user's ID (assuming you have it)
      }));
    } catch (err) {
      console.error("Error liking the blog", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white shadow-md flex flex-col justify-center items-center rounded-lg p-4 min-h-screen">
      <img
        src={blog?.image || "https://via.placeholder.com/150"} // Fallback image if blog.image is null
        alt="blog cover"
        className="w-full h-48 max-w-[500px] object-cover rounded-t-md"
      />
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handleLike(blog._id)}
          className="text-red-500 flex items-center gap-1"
        >
          {blog?.likes.includes("user-id") ? ( // Check if the current user has liked the blog
            <IoMdHeart />
          ) : (
            <IoMdHeartEmpty />
          )}
          {blog?.likes.length || 0}
        </button>
      </div>
      <h2 className="text-md capitalize max-w-[500px] font-semibold mt-2">
        {blog?.title || "Untitled Blog"}
      </h2>
      <div
        dangerouslySetInnerHTML={{
          __html: (blog?.content || "").replace(/\n/g, "<br>"),
        }}
        className="text-sm text-gray-600 max-w-[500px] mt-2"
      />
    </div>
  );
};

export default SingleBlog;
