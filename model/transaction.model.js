import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  totalAmount: { type: Number, required: true },

  categories: [
    {
      type: { type: String, required: true },  
      spendingAmount: { type: Number, required: true }, 
      paymentType: { type: String, required: true },
      time: { type: Date, default: Date.now },
      leftBalance: { type: Number, required: true }
    }
  ],

  totalSpent: { type: Number, default: 0 },

  totalLeftBalance: { type: Number, default: 0 }

}, { timestamps: true });

//  Generate transactionId automatically before saving
transactionSchema.pre("save", function(next) {
  if (!this.transactionId) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random
    this.transactionId = `TXN-${randomNum}`;
  }
  next();
});

const Transaction = mongoose.model('transaction', transactionSchema);

export default Transaction;
