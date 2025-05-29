import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401);
        throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }
    req.user = user;
    next();
});
