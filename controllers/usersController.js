const { get } = require("lodash");
const { addUser, checkIfUserAlreadyExists, authenticateUser, getUserByEmail, updateUser } = require("../db/dbController");
const { generatePassword } = require("../utils/bcrypt");
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const isUserAlreadyExists = checkIfUserAlreadyExists(user);
    if (isUserAlreadyExists) throw new Error("User existed already, try login instead!");
    user.password = await generatePassword(user.password);
    await addUser(user);
    res
      .status(200)
      .send({ success: true });
  } catch (error) {
    // While no errors are expected in this use case,
    // still it's good practice to wrap IO operations like
    // database queries to catch any unexpected errors
    console.error("Error in usersController.registerUser --- ", error);
    res.status(400).send({ message: "Something went wrong!" });
  }
}

const loginUser = async (req, res) => {
  try {
    const user = req.body;
    const authenticatedUser = await authenticateUser(user);
    const SECRET_KEY = process.env.JWT_SECRET;
    const token = jwt.sign(authenticatedUser, SECRET_KEY);
    res
      .status(200)
      .send({ success: true, token });
  } catch (error) {
    // While no errors are expected in this use case,
    // still it's good practice to wrap IO operations like
    // database queries to catch any unexpected errors
    console.error("Error in usersController.loginUser --- ", error);
    if (error.message === 'Invalid credentials!')
      return res.status(401).send({ success: false, message: error.message });
    res.status(400).send({ message: "Something went wrong!" });
  }
}

const getUserPreferences = async (req, res) => {
  try {
    const token = req.token;
    const decodedToken = jwt.decode(token);
    const user = getUserByEmail(decodedToken.email);
    res
      .status(200)
      .send({ success: true, preferences: user.preferences || [] });
  } catch (error) {
    // While no errors are expected in this use case,
    // still it's good practice to wrap IO operations like
    // database queries to catch any unexpected errors
    console.error("Error in usersController.getUserPreferences --- ", error);
    res.status(400).send({ message: "Something went wrong!" });
  }
}

const updateUserPreferences = async (req, res) => {
  try {
    const token = req.token;
    const decodedToken = jwt.decode(token);
    const { preferences = null } = req.body;
    if (!preferences) throw new Error('Nothing to update!');
    await updateUser(decodedToken.email, { preferences });
    res
      .status(200)
      .send({ success: true, preferences });
  } catch (error) {
    // While no errors are expected in this use case,
    // still it's good practice to wrap IO operations like
    // database queries to catch any unexpected errors
    console.error("Error in usersController.updateUserPreferences --- ", error);
    res.status(400).send({ message: "Something went wrong!" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserPreferences,
  updateUserPreferences,
}