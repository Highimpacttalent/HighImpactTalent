import Blog from "../models/BlogModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const userId = req.body.user.userId;
    console.log(userId)
    // Create a new blog post
    const newBlog = new Blog({
      userId,
      title,
      content,
      image,
    });

    // Save the blog to the database
    await newBlog.save();
    // Find the user and push the blog ID into the user's blogs array
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        
      });
    }
    user.blogs.push(newBlog._id); // Add blog ID to user's blogs array
    await user.save();

    res.status(201).json({
      success: true,
      message: "Blog posted successfully",
      user
    });
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to post blog",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const {id}=req.body
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    // For each blog, fetch user or company based on userId or companyId
    const blogWithAuthors = await Promise.all(
      blogs.map(async (blog) => {
        if (blog.userId) {
          // Find user by userId and attach to the blog
          const user = await Users.findById(blog.userId);

          if(!user){
            const company = await Companies.findById(blog.companyId);

            if(!company){
              return res.status(404).json({
                success: false,
                message: "User not found",
              });
            }
            return {
              ...blog.toObject(),
              name: company ? company.name : "Unknown Company",
              profilePic: company ? company.profileUrl : null,
            };
          }
          // Find company by companyId and attach to the blog
          return {
            ...blog.toObject(),
            name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
            profilePic: user ? user.profileUrl : null,
          };
          
        }  else {
          return blog; // If neither userId nor companyId exists
        }
      })
    );
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs:blogWithAuthors
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};
export const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.body.user.userId; 
    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    
    // Check if the user already liked the blog
    const isLiked = blog.likes.includes(userId);
    if (isLiked) {
      // If the user already liked the blog, remove their like (unlike)
      blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // If the user hasn't liked the blog yet, add their like
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Blog unliked successfully" : "Blog liked successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error liking blog",
      error: error.message,
    });
  }
};
