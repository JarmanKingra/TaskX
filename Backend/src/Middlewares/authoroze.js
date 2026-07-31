const authorize = (requiredPermission) => {
  return (req, res, next) => {
    // Team owner always has full access
    if (req.team?.owner?.toString() === req.user._id.toString()) {
      return next();
    }

    const permissions = req.membership?.permissions || [];
    const hasPermission = permissions.some(
      (permission) => permission.name === requiredPermission,
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};

export default authorize;
