import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";

export const getUsers = async (req, res, next) => {
try {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
  });
} catch (error) {
  next(error);
}
}

export const getUser = async (req, res, next) => {
try {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  res.status(200).json({
    success: true,
    data: user,
  });
} catch (error) {
  next(error);
}
}

// Delete user account (must be the logged-in user)
export const deleteUser = async (req, res, next) => {
  try {
    // Ensure the user can only delete their own account
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check if the user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete all subscriptions linked to this user
    await Subscription.deleteMany({ user: req.params.id });

    // Delete user account
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const deleteAllUsers = async (req, res, next) => {
  try {
    // Delete all subscriptions linked to any user
    await Subscription.deleteMany({});

    // Delete all users
    await User.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All user accounts deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

