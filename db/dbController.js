const fs = require("fs");
const { users: usersData } = require('./users.json');
const { find, pick, keyBy } = require("lodash");
const { comparePasswords } = require("../utils/bcrypt");
const { randomUUID } = require("crypto");

const updateUsersData = async updatedUsersData => {
  try {
    await fs.promises.writeFile(
      "./db/users.json",
      JSON.stringify({ users: updatedUsersData }, null, 2)
    );
  } catch (e) {
    console.error('Error in updateUsersData --- ', e);
    throw new Error('Fatal: Unable to update users data');
  }
}

const addUser = async user => {
  const updatedUsersData = [...usersData];
  user.id = randomUUID().split('-')[0];
  if (!user.preferences?.length) user.preferences = [];
  updatedUsersData.push(user);
  await updateUsersData(updatedUsersData);
}

const updateUser = async (email, userUpdatedData) => {
  const existingUsersData = [...usersData];
  const indexedUsersData = keyBy(existingUsersData, 'email');
  let userToUpdate = indexedUsersData[email];
  if (!userToUpdate) throw new Error('User not found!');
  indexedUsersData[email] = {
    ...userToUpdate,
    ...userUpdatedData,
  }
  await updateUsersData(Object.values(indexedUsersData));
}

const getUserByEmail = userEmail => find(usersData, { email: userEmail });

const checkIfUserAlreadyExists = user => {
  const userWithExistingEmail = find(usersData, { email: user.email });
  return !!userWithExistingEmail; 
}

const authenticateUser = async user => {
  const { email, password } = user;
  const userWithGivenEmail = find(usersData, { email });
  if (!userWithGivenEmail) throw new Error('User not found!');
  const isPasswordMatched = await comparePasswords(password, userWithGivenEmail.password);
  if (!isPasswordMatched) throw new Error('Invalid credentials!');
  return pick(userWithGivenEmail, ['name', 'email']);
}

module.exports = {
  addUser,
  updateUser,
  checkIfUserAlreadyExists,
  authenticateUser,
  getUserByEmail,
}