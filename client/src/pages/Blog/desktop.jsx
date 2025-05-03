import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import BlogCard from "./blogcard";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Grid,
  Box,
  Container,
} from "@mui/material";

const BlogPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://highimpacttalent.onrender.com/api-v1/blog/blogs"
        );
        if (response.data.success) {
          setBlogs(response.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/blog/togglelike",
        { blogId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.success) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId ? { ...blog, likes: response.data.likes } : blog
          )
        );
      }
    } catch (error) {
      console.error("Error while liking blog:", error);
    }
  };

  return (
    <Box  sx={{ minHeight: "100vh", p: 4,bgcolor:"white"}}>
        <Box sx={{mb:2}}>
        <Typography variant="h4" sx={{textAlign:"center",color:"#474E68", fontFamily:"Satoshi, sans-serif", fontWeight:"700"}}>Latest Blog</Typography>
        </Box>
      
      <Grid container spacing={4} sx={{mt:2}}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Box>
            <BlogCard blog={blog} handleLike={handleLike} />
            </Box>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default BlogPage;