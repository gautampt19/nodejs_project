import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import Post from '../models/post.model.js';
import User from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }
    console.log("printing user id " + req.user.id )
    // Create the post
    let post;
    try {
        post = await Post.create({
            title,
            content,
            authorId: req.user.id // Assumes req.user is set by authentication middleware
        });
    } catch (err) {
        throw new ApiError(500, "Failed to create post");
    }
    console.log("printing post")
    console.log(post.authorId)
    return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});


// Get All Posts
export const getPosts = asyncHandler(async (req, res) => {

    console.log("indside get post")
    const posts = await Post.findAll({
        where: { authorId: req.user.id },
        include: [{
            model: User,
            attributes: ['id', 'username']
        }]
    });
    console.log("postss:" + posts)
    res
    .status(200)
    .json(new ApiResponse(200, posts));
});

// Update Post
export const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }
    if (post.authorId !== req.user.id) {
        throw new ApiError(403, 'Unauthorized');
    }

    // Only allow updating title and content
    const { title, content } = req.body;
    if (!title && !content) {
        throw new ApiError(400, 'Nothing to update');
    }

    await post.update({ title, content });
    res
    .status(200)
    .json(new ApiResponse(200, post, 'Post updated successfully'));
});

// Delete Post
export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) 
    {
        throw new ApiError(404, 'Post not found');
    }
    if (post.authorId !== req.user.id) 
    {
        throw new ApiError(403, 'Unauthorized');
    }

    await post.destroy();
    res
    .status(200)
    .json(new ApiResponse(200, null, 'Post deleted successfully'));
});

