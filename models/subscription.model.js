import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Subscription Price is required'],
    min: [0, 'Price must be greater than 0'],
  },
  currency: {
    type: String,
    enum: ['EUR', 'USD', 'GBP', 'EGP', 'SAR'],
    default: 'USD',
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  category: {
    type: String,
    enum: ['sports', 'entertainment', 'news', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
    required: true,
  },
  paymentMethod: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value < new Date(); // Ensures startDate is strictly in the past
      },
      message: 'Start date must be in the past',
    },
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || (this.startDate && value > this.startDate);
      },
      message: 'Renewal date must be after start date',
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, { timestamps: true });

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate && this.startDate && this.frequency) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    const daysToAdd = renewalPeriods[this.frequency] || 30;
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
  }

  next();
});

// Middleware to update status on each save
subscriptionSchema.pre('save', function (next) {
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
