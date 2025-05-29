import { Router } from "express";
import {
    createPost,
    getPosts,
    updatePost,
    deletePost
} from '../controllers/post.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const postRouter = Router()

postRouter.route("/createPost").post(requireAuth, createPost);
postRouter.route("/getPosts").get(getPosts);
postRouter.route("/updatePost/:id").put(requireAuth, updatePost);
postRouter.route("/deletePost/:id").delete(requireAuth, deletePost);

export default postRouter;
