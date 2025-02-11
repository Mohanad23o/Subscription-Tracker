import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";

const SERVER_URL = process.env.SERVER_URL;

// Create a subscription for a specific user
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: { 'Content-Type': 'application/json' },
      retries: 0,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions for the logged-in user
export const getUserSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions in the app, including user emails
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate("user", "email");
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// Get a specific subscription for a user
export const getUserSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate("user", "email");
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Delete a specific subscription (must be the logged-in user)
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Subscription.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    next(error);
  }
};

// Cancel a specific subscription (must be the logged-in user)
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    subscription.status = "canceled";
    await subscription.save();
    res.status(200).json({ success: true, message: "Subscription canceled" });
  } catch (error) {
    next(error);
  }
};

// Get upcoming renewals
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const upcomingRenewals = await Subscription.find({ renewalDate: { $gte: new Date() } });
    res.status(200).json({ success: true, data: upcomingRenewals });
  } catch (error) {
    next(error);
  }
};
