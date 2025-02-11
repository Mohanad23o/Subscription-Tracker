import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import {sendReminderEmail} from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  try {
    const { subscriptionId } = context.requestPayload;
    console.log(`Received request to send reminders for subscription: ${subscriptionId}`);

    const subscription = await fetchSubscription(context, subscriptionId);
    console.log("Fetched Subscription:", subscription);

    if (!subscription || subscription.status !== 'active') {
      console.log(`Subscription ${subscriptionId} is not active. Exiting.`);
      return;
    }

    const renewalDate = dayjs(subscription.renewalDate);
    console.log(`Renewal Date: ${renewalDate.format()}`);

    if (renewalDate.isBefore(dayjs())) {
      console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
      return;
    }

    for (const daysBefore of REMINDERS) {
      const reminderDate = renewalDate.subtract(daysBefore, 'day');
      console.log(`Checking reminder for ${daysBefore} days before renewal: ${reminderDate.format()}`);

      if (reminderDate.isAfter(dayjs())) {
        console.log(`Scheduling sleep until ${reminderDate.format()}`);
        await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
      }


      if (dayjs().isSame(reminderDate, 'day')) {
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
      }
    }
  } catch (error) {
    console.error("Error in sendReminders:", error);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date.format()}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder for subscription: ${subscription._id}`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription: subscription,
    });
  });
};
