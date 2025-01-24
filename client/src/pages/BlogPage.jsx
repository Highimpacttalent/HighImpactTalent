import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../redux/userSlice";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import logo from "../../src/assets/tlogo.png";
import { useNavigate } from "react-router-dom";
// import logo from '../assets/tlogo.png';
const BlogPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [blogs, setBlogs] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setBlogData({ title: "", content: "", image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setBlogData((prevState) => ({
      ...prevState,
      image: e.target.files[0], // Store the selected image file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;

      // If image is selected, upload it to Cloudinary
      if (blogData.image) {
        const formData = new FormData();
        formData.append("file", blogData.image);
        formData.append("upload_preset", "jtzzkmlf");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/db7pikwo4/image/upload`,
          formData
        );

        uploadedImageUrl = response.data.secure_url;
        setImageUrl(uploadedImageUrl);
      }

      // Now send the blog data to the backend including the image URL
      // http://localhost:8800
      // https://demojobportal.onrender.com
      const blogResponse = await axios.post(
        `https://demojobportal.onrender.com/api-v1/blog/uploadblog`,
        {
          title: blogData.title,
          content: blogData.content,
          image: uploadedImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Replace with your actual token handling logic
            "Content-Type": "application/json",
          },
        }
      );

      if (blogResponse.data.success) {
        dispatch(UpdateUser(blogResponse.data.user));
        alert("Blog uploaded successfully");
        fetchBlogs();
        handleFormClose(); // Close form and reset data after successful upload
      } else {
        console.error("Error uploading blog:", blogResponse.data.message);
      }
    } catch (error) {
      console.error("Failed to upload blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://demojobportal.onrender.com/api-v1/blog/blogs`
      );
      if (response.data.success) {
        setBlogs(response.data.blogs);
        console.log(response.data.blogs);
      }
    } catch (error) {
      console.log("error while getting blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        `https://demojobportal.onrender.com/api-v1/blog/togglelike`,
        { blogId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        fetchBlogs(); // Refresh blogs after liking
      }
    } catch (error) {
      console.log("Error while liking blog:", error);
    }
  };
  const navigate = useNavigate()
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center overflow-x-hidden">
      <div className="max-w-7xl">
        {/* Blog Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {blogs && blogs.length > 0 ? (
            <>
              {blogs.map((blog, index) => {
                return (
                  <div key={index} className="">
                    {/* Example Blog Card */}
                    <div className="bg-white shadow-md rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {/* Profile section with author name */}
                        <img
                          src={logo}
                          // src={
                          //   blog.profilePic
                          //     ? blog.profilePic
                          //     : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010"
                          // }
                          alt="author"
                          className="w-6 h-6 rounded-full mr-2 border border"
                        />
                        <span className="text-sm font-semibold">
                          {/* {blog.name ? blog.name : "Unknown"} */}
                          High Impact Talent
                        </span>
                      </div>
                      <img
                        src={blog.image}
                        alt="blog cover"
                        className="w-full h-48 object-cover rounded-t-md"
                      />
                      <div className="flex justify-between items-center">
                        {/* <button className="text-blue-500">Read More</button> */}
                        <div className="flex items-center">
                          {/* Like button */}
                          <button
                            onClick={() => handleLike(blog._id)}
                            className="text-red-500 flex items-center gap-1"
                          >
                            {blog.likes.includes(user._id) ? (
                              <IoMdHeart />
                            ) : (
                              <IoMdHeartEmpty />
                            )}
                            {blog.likes.length || 0}
                          </button>
                        </div>
                      </div>
                      <h2 className="text-md capitalize font-semibold mt-2">
                        {blog.title}
                      </h2>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.content.replace(/\n/g, "<br>"),
                        }}
                        className="text-sm text-gray-600 mt-2 line-clamp-6"
                      />
                      <div onClick={()=>navigate(`${blog._id}`)} className="bg-blue-500 w-full py-2 text-center cursor-pointer capitalize text-white rounded-lg mt-2">view more</div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div>No blogs found</div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        +
      </button>

      {/* Blog Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Blog Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  name="content"
                  value={blogData.content}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Write your content with paragraphs, line breaks..."
                  rows="6"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
