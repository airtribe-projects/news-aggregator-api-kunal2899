const Joi = require("joi");

const fieldTypesMapping = {
  name: Joi.string(),
  email: Joi.string().pattern(
    new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ),
  password: Joi.string(),
  preferences: Joi.array().items(Joi.string().required()),
};

const userSchema = Joi.object().keys({
  name: fieldTypesMapping.name.required(),
  email: fieldTypesMapping.email.required(),
  password: fieldTypesMapping.password.required(),
  preferences: fieldTypesMapping.preferences,
});

const validateUser =
  (requiredKeys = []) =>
  async (req, res, next) => {
    try {
      const user = req.body;
      // to validate user as full-object validation
      if (requiredKeys.length === 0) {
        const { error: validationError } = userSchema.validate(user);
        if (validationError) {
          throw new Error(
            `Invalid payload provided${
              validationError.message ? `: ${validationError.message}` : "!"
            }`
          );
        }
        Joi.assert(user.password, Joi.string().pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/
          )
        ));
      } else {
        const availableKeys = Object.keys(user);
        for (const key of requiredKeys) {
          if (!availableKeys.includes(key))
            throw new Error(`Invalid payload provided: ${key} is missing!`);
          Joi.assert(user[key], fieldTypesMapping[key]);
        }
      }
      next();
    } catch (err) {
      console.error("Error in middlewares.validateUser --- ", err);
      return res.status(400).send({ message: "Something went wrong!" });
    }
  };

module.exports = {
  validateUser,
};
