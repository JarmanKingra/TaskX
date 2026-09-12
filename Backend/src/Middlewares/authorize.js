const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (req.membership?.isOwner) {
      return next();
    }

    const permissions = req.membership?.permissions || [];
    const hasPermission = permissions.some(
      (permission) => permission.name === requiredPermission,
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

export default authorize;
