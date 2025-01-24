import express, { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { createBlog, getAllBlogs, getBlogById, likeBlog } from "../controllers/BlogController.js";
const router = express.Router();

router.post('/uploadblog',userAuth,createBlog)

router.get('/blogs',getAllBlogs)
router.post('/blog',getBlogById)
router.post('/togglelike',userAuth,likeBlog)
export default router;