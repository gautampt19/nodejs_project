import { sequelize } from '../db/index.js';
import { DataTypes } from 'sequelize';

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
        authorId: { // Explicitly define the foreign key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Table name (Sequelize defaults to plural)
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

export default Post;
