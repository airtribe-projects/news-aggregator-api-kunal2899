const bcrypt = require("bcrypt");

const generatePassword = async (plainPassword) => {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const comparePasswords = async (userPassword, savedPassword) =>
  bcrypt.compare(userPassword, savedPassword);

module.exports = { generatePassword, comparePasswords };
