const jwt = require("jsonwebtoken");

const verifyTokenAdmin = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined" || null || "") {
    return res.status(403).json({ msg: "Authorization is null." });
  }
  const bearer = bearerHeader;
  jwt.verify(bearer, process.env.ADMIN_TOKEN, (err, ver) => {
    if (err) {
      res.status(403).json({ msg: err });
    } else {
      next();
    }
  });
};

module.exports = verifyTokenAdmin;
