import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
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
    <Container maxWidth="lg" sx={{ minHeight: "100vh", py: 4 }}>
      {blogs.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3, display: "flex" }}>
          {/* Left Section - Image */}
          <CardMedia
            component="img"
            sx={{ width: "50%", objectFit: "contain",p:2 }}
            image={blogs[0].image}
            alt="Hero Blog"
          />
          {/* Right Section - Content */}
          <CardContent sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <Typography variant="body2" sx={{width:"25%",pl:2,borderRadius:4,bgcolor:"grey.200",color:"black"}}>
              {new Date(blogs[0].createdAt).toDateString()}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
              {blogs[0].title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {blogs[0].content.substring(0, 680)}...
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, alignSelf: "flex-start", fontWeight:"bold" }}
              onClick={() => navigate(`/blog/${blogs[0]._id}`)}
            >
              Read More
            </Button>
          </CardContent>
        </Card>
      )}

<Grid container spacing={4}>
  {blogs.slice(1).map((blog) => (
    <Grid item xs={12} sm={6} md={4} key={blog._id}>
      <Card 
        sx={{ 
          boxShadow: 3, 
          transition: "0.3s", 
          "&:hover": { boxShadow: 6 }
        }}
      >
        <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)}>
          <CardMedia
            component="img"
            image={blog.image}
            alt="Blog Cover"
            sx={{ objectFit: "contain",p:2 }}
          />
          
        <CardContent 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            height:10
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {new Date(blog.createdAt).toDateString()}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleLike(blog._id)} color="error">
            {blog.likes.includes(user._id) ? <IoMdHeart /> : <IoMdHeartEmpty />}
          </IconButton>
          <Typography variant="body2">{blog.likes.length}</Typography>
          </Box>
        </CardContent>
          <CardContent >
            <Typography variant="h6" fontWeight="bold">
              {blog.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {blog.content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>

    </Container>
  );
};

export default BlogPage;