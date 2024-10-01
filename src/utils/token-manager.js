
import jwt from "jsonwebtoken";

export const CreateToken = (id, email) => {
    const payload = { id, email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return token;
};



 export const verifyToken = (req, res, next) => {
    // Access the signed cookie from req.signedCookies
    const token = req.signedCookies['auth_token'];  // Assuming the cookie name is 'token'
  
    if (!token || token.trim() === "") {
      return res.status(401).json({ message: "Token Not Received" });
    }
  
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
          reject(err.message);
          return res.status(401).json({ message: "Token Expired" });
        } else {
          resolve();
          res.locals.jwtData = success;  // Store decoded token data in res.locals
          return next();
        }
      });
    });
  };
