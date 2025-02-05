// jwtMiddleware.mjs
import jwt from "jsonwebtoken";

// Use an environment variable for the secret key, or fallback to a default value.
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware to verify the JWT token from the Authorization header.
 *
 * Expected header format:
 *    Authorization: Bearer <token>
 */
export const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header.
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // The token should be in the format: "Bearer <token>"
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = tokenParts[1];

  // Verify the token using the secret key.
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // If token verification fails, return a 403 Forbidden response.
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    // Attach the decoded token payload to the request object for later use.
    req.user = decoded;
    next();
  });
};
