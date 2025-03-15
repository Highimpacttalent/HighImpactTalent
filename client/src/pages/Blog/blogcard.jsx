import React from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <Box
  sx={{
    borderRadius: 4,
    border: "2px solid #E7E7E7", // Very thin border
    overflow: "hidden",
    height: { xs: "400px", md: "400px" },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>

      <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)}>
        {/* Blog Image Placeholder */}
        <CardMedia
          component="div"
          sx={{ height: 210, backgroundColor: "#e0e0e0",borderRadius:3 }}
          image={blog.image}
        />

        <CardContent>

          {/* Blog Title */}
          <Typography variant="h6" gutterBottom sx={{fontFamily:"Poppins", fontWeight:"500",display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color:"#404258",
              fontSize:18}}>
            {blog.title }
          </Typography>

          {/* Blog Content */}
          <Typography variant="body2" color="textSecondary" sx={{color:"#808195",fontSize:12,fontFamily:"Poppins",display: "-webkit-box",WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",}}>
            {blog.content }
          </Typography>

          <Box sx={{mt:1}}>
          {/* Post Date and Author */}
          <Typography variant="caption" color="textSecondary" mt={2} sx={{color:"#404258",fontFamily:"Poppins",fontWeight:"400"}}>
            Posted on <span style={{color:"#3C7EFC",fontFamily:"Poppins",fontWeight:"500"}}>{new Date(blog.createdAt).toLocaleDateString()}</span> | By <span style={{color:"#3C7EFC",fontFamily:"Poppins",fontWeight:"500"}}>{blog.name || "Name"}</span>
          </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Box>
  );
};

export default BlogCard;