const errorHandler = (error, req, res, next) => {
  const { status = 404, stack, message = "unknown error" } = error;

  res.status(status).json({
    status,
    message,
    stack,
  });
};

module.exports=errorHandler
 