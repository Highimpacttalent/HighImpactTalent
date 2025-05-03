import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useParams } from "react-router-dom";

const SingleBlog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blogId } = useParams();

  const getBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://highimpacttalent.onrender.com/api-v1/blog/blog`,
        { id: blogId }
      );
      setBlog(response.data.blog);
    } catch (err) {
      setError("❌ Failed to load the blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.post(
        `https://highimpacttalent.onrender.com/api/blogs/${id}/like`
      );
      setBlog((prev) => ({
        ...prev,
        likes: [...prev.likes, "user-id"],
      }));
    } catch (err) {
      console.error("Error liking the blog", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-pulse w-full max-w-3xl p-6 bg-white rounded shadow-md">
          <div className="h-56 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-20">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-10">
        {/* Blog Image */}
        <img
          src={blog?.image || "https://via.placeholder.com/800x400"}
          alt="Blog Cover"
          className="w-full h-[250px] md:h-[400px] object-cover rounded-md"
        />

        {/* Title and Like Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold capitalize text-gray-800">
            {blog?.title}
          </h1>
          <button
            onClick={() => handleLike(blog._id)}
            className="flex items-center gap-1 text-red-600 text-xl hover:scale-110 transition-transform"
          >
            {blog?.likes.includes("user-id") ? <IoMdHeart /> : <IoMdHeartEmpty />}
            <span className="text-base font-medium">{blog?.likes.length || 0}</span>
          </button>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Blog Content */}
        <div
          className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{
            __html: (blog?.content || "")
              .replace(/\n/g, "<br>")
              .replace(/<script.*?>.*?<\/script>/gi, ""),
          }}
        />
      </div>
    </div>
  );
};

export default SingleBlog;
