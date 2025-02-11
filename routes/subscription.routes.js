import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import {
 createSubscription,
 getUserSubscriptions,
 getAllSubscriptions,
 getUserSubscription,
 deleteSubscription,
 cancelSubscription,
 getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Get all subscriptions in the app (includes user emails)
subscriptionRouter.get('/', authorize, getAllSubscriptions);

// Get all subscriptions for a specific user (must be the logged-in user)
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Get a specific subscription by ID
subscriptionRouter.get('/:id', authorize, getUserSubscription);

// Create a new subscription for the logged-in user
subscriptionRouter.post('/', authorize, createSubscription);

// Delete a specific subscription (must be the logged-in user)
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// Cancel a specific subscription (must be the logged-in user)
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// Get upcoming renewals for subscriptions
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export { subscriptionRouter };
