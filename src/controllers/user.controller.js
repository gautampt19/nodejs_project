import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Sequelize, Op } from "sequelize";


const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { fullName, email, username, password } = req.body;
    console.log("the full name is : " + fullName)

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        where: {
            [Op.or]: [
                { username: username.toLowerCase() },
                { email: email }
            ]
        }
    });


    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

     const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    );

});

const getAllUsers = asyncHandler(async(req, res) => {
    const allUsers  = await User.findAll({
        attributes: { exclude: ['password', 'refreshToken'] }
    })
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        allUsers,
        "User fetched successfully"
    ))
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    // Find user by username or email (case-insensitive)
    const conditions = [];

    if (username) {
        conditions.push({ username: username.toLowerCase() });
    }
    if (email) {
        conditions.push({ email: email.toLowerCase() });
    }

    const user = await User.findOne({
    where: {
        [Op.or]: conditions
    }
    });


    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }


    // Fetch user without password and refreshToken
    const loggedInUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });

    const options = {
        httpOnly: true,
        secure: true
    };
    
    // Generate new tokens (refresh token rotation)
    const accessToken = user.generateAccessToken(user.id);
    const refreshToken = user.generateRefreshToken(user.id);

    // Update refresh token in DB
    await user.update({ refreshToken });

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    refreshToken,
                    accessToken
                },
                "User logged In Successfully"
            )
        );
});


const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword || newPassword.trim() === "") {
    throw new ApiError(400, "Old and new password are required");
  }

  console.log("user details: "+req.user)

  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if old password is correct
  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  // Set and save new password (will be hashed by hook)
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});


const deleteUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.destroy();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User account deleted successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    // Find the user by primary key (id)
    const user = await User.findByPk(req.user?.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update fields
    user.fullName = fullName;
    user.email = email;
    await user.save();

    // Remove sensitive fields
    const userSafe = user.get({ plain: true });
    delete userSafe.password;

    return res
        .status(200)
        .json(new ApiResponse(200, userSafe, "Account details updated successfully"));
});


export { registerUser, getAllUsers , loginUser, updatePassword, deleteUserById, updateAccountDetails}