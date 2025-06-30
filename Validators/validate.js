const validator = require("validator");

function validUser(req, res, next) {
  const data = req.body;
    // console.log(data)
    

  if (!data || typeof data !== 'object') {
    return res.render("signin",{ error: "Invalid request body" });
  }

  const mandatoryFields = ["fullname", "email", "password"];
  const isValid = mandatoryFields.every((key) =>
    Object.keys(data).includes(key)
  );

  // console.log(isValid)

  if (!isValid) {
    return res.render("signin",{ error: "Missing fields" });
  }

  if (!validator.isEmail(data.email)) {
    return res.render("signin",{ error: "Invalid email" });
  }

  if (!validator.isStrongPassword(data.password)) {
    return res.render("signin",{ error: "Weak password" });
  }

  const len = data.fullname.length;
  if (len < 3 || len > 20) {
    return res.status(400).json({
      error: "Invalid first name! Must be between 3 and 20 characters.",
    });
  }

  next();
}

module.exports = validUser;
