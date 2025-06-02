import User from './user.model.js';
import Post from './post.model.js';

// One-to-Many: User has many Posts
User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId', onDelete: 'CASCADE' });

sequelize.sync({ alter: true });