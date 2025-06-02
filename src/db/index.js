import dotenv from "dotenv"
import { Sequelize } from "sequelize";

dotenv.config({
    path: './.env'
})

export const sequelize = new Sequelize(
  'node_practice', // Database name
  'root', // Username
  'my_password', // Password
  {
    host: '127.0.0.1', // RDS instance endpoint
    dialect: 'mysql', // Dialect
    port: 3306, // Port,
    logging: true, // Disable logging for production
  }
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }) // or { force: true } for development only
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
    console.log(`\n SQL Database connected !! `);
  } catch (error) {
    console.log("SQL Database connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB

