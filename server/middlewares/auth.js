// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   const { token } = req.headers;

//   if (!token) {
//     return res.json({
//       success: false,
//       message: "Not authorized. Login again.",
//     });
//   }

//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode.id) {
//       req.body.userId = tokenDecode.id;
//     } else {
//       res.json({ success: false, message: "Not authorized. Login again." });
//     }

//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export default userAuth;
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Login again.",
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Login again.",
      });
    }

    // Attach user ID to request body for later use
    req.body.userId = decoded.id;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired or invalid. Please log in again.",
    });
  }
};

export default userAuth;
