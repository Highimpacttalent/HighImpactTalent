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
      {blogs.length > 0 && (
        <Box sx={{display:{ xs: "none", md: "flex" },justifyContent:"center"}}>
         <Box
          sx={{
            borderRadius: 4,
            width:"60%",
            overflow: "hidden",
            height: { xs: "400px", md: "600px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mb:4
          }}
        >
        
              <CardActionArea onClick={() => navigate(`/blog/${blogs[0]._id}`)}>
                {/* Blog Image Placeholder */}
                <CardMedia
                  component="div"
                  sx={{ height:{ xs: "200px", md: "350px" }, backgroundColor: "#e0e0e0",borderRadius:3 }}
                  image={blogs[0].image}
                />
        
                <CardContent>
        
                  {/* Blog Title */}
                  <Typography variant="h6" gutterBottom sx={{fontFamily:"Poppins", fontWeight:"500",display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color:"#404258",
                      fontSize:24}}>
                    {blogs[0].title }
                  </Typography>
        
                  {/* Blog Content */}
                  <Typography variant="body2" color="textSecondary" sx={{color:"#808195",fontSize:18,fontFamily:"Poppins",display: "-webkit-box",WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",}}>
                    {blogs[0].content }
                  </Typography>
        
                  <Box sx={{mt:1}}>
                  {/* Post Date and Author */}
                  <Typography variant="caption" color="textSecondary" mt={2} sx={{color:"#404258",fontFamily:"Poppins",fontWeight:"400"}}>
                    Posted on <span style={{color:"#3C7EFC",fontFamily:"Poppins",fontWeight:"500"}}>{new Date(blogs[0].createdAt).toLocaleDateString()}</span> | By <span style={{color:"#3C7EFC",fontFamily:"Poppins",fontWeight:"500"}}>{blogs[0].name || "Name"}</span>
                  </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Box>
            </Box>
      )}
      <Grid container spacing={4}>
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