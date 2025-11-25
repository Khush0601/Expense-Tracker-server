import Transaction from "../model/transaction.model.js";

export const createTransaction=async(req,res)=>{
  try{
     const { userId, totalAmount, categories } = req.body;
     if (!userId || !totalAmount || !categories) {
      return res.status(400).json({
        success: false,
        message: "userId, totalAmount, and categories are required",
      });
    }
    // Calculate totalSpent (sum of all category spending)
    let totalSpent = categories.reduce(
      (sum, item) => sum + item.spendingAmount,
      0
    );

   // Calculate final left balance
    let totalLeftBalance = totalAmount - totalSpent;


    // Create Transaction Document
    const newTransaction = new Transaction({
      
      userId,
      totalAmount,
      categories,
      totalSpent,
      totalLeftBalance
    });

    //  Save to DB
    await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: newTransaction,
    });
  }
  catch(err){
        console.error("Error creating transaction:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  
  }
    
}

//Get transaction
export const getTransaction = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions
    });

  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// 