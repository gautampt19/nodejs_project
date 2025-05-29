import { DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sequelize } from '../db/index.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('username', value.toLowerCase().trim());
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase().trim());
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            this.setDataValue('fullName', value.trim());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password is required'
            }
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true, // Adds createdAt and updatedAt
    indexes: [
        {
            fields: ['username']
        },
        {
            fields: ['fullName']
        },
        {
            fields: ['email'],
            unique: true
        }
    ]
});

// Pre-save hook for password hashing
User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Instance method: Check if password is correct
User.prototype.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Instance method: Generate access token
User.prototype.generateAccessToken = function() {
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Instance method: Generate refresh token
User.prototype.generateRefreshToken = function() {
    return jwt.sign(
        {
            id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};


export default User;