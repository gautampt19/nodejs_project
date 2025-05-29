import { Router } from "express";
import {  
    registerUser, 
    getAllUsers, 
    loginUser, 
    updatePassword, 
    deleteUserById, 
    updateAccountDetails 
} from "../controllers/user.controller.js";
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/register").post(registerUser);
router.route("/getAllUsers").get(getAllUsers);
router.route("/login").post(loginUser)
router.route("/updatePassword").post(requireAuth, updatePassword)
router.route('/users/:id').delete(requireAuth, deleteUserById);
router.route('/updateAccountDetails').patch(requireAuth, updateAccountDetails);

export default router