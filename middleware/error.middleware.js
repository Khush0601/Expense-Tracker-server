export const errorHandler = (err, req, res, next) => {
  console.error(" Error Middleware Caught:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  //  Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  //  Handle duplicate key errors (like unique email)
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate field value: ${Object.keys(err.keyValue).join(", ")}`;
  }

  //  Handle JWT or Auth related errors 
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};