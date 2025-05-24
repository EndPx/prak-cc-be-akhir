const Transaction = require('../models/TransactionModel');
const Category = require('../models/CategoryModel');

const getAllTransactionsHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { userId },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'type'],
        required: true,
      }],
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil semua transaksi",
      data: transactions,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk mendapatkan data transaksi",
    });
  }
};

const createTransactionHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId } = req.params;
    const { amount, note, date } = req.body;

    if (!amount || !categoryId || !date) {
      const error = new Error("Field 'amount', 'categoryId', dan 'date' wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findOne({ 
      where: { id: categoryId, userId },
      paranoid: true
    });
    if (!category) {
      const error = new Error("Kategori tidak ditemukan atau bukan milik user");
      error.statusCode = 404;
      throw error;
    }

    const newTransaction = await Transaction.create({
      userId,
      amount,
      note,
      categoryId,
      date,
    });

    res.status(201).json({
      status: "success",
      message: "Transaksi berhasil dibuat",
      data: newTransaction,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk membuat data transaksi",
    });
  }
};

const getDetailTransactionByIdHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      const error = new Error("ID transaksi harus disertakan di parameter URL");
      error.statusCode = 400;
      throw error;
    }

    const transaction = await Transaction.findOne({
      where: { id, userId },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'type'],
        required: true,
      }]
    });

    if (!transaction) {
      const error = new Error("Transaksi tidak ditemukan atau bukan milik user");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan detail transaksi",
      data: transaction
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk mendapatkan detail data transaksi",
    });
  }
};

const updateTransactionHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount, note } = req.body;

    if (!id) {
      const error = new Error("ID transaksi harus disertakan di parameter URL");
      error.statusCode = 400;
      throw error;
    }

    const transaction = await Transaction.findOne({ where: { id, userId } });
    if (!transaction) {
      const error = new Error("Transaksi tidak ditemukan atau bukan milik user");
      error.statusCode = 404;
      throw error;
    }

    transaction.amount = amount ?? transaction.amount;
    transaction.note = note ?? transaction.note;

    await transaction.save();

    res.status(200).json({
      status: "success",
      message: "Transaksi berhasil diperbarui",
      data: transaction,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk memperbarui data transaksi",
    });
  }
};

const deleteTransactionHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      const error = new Error("ID transaksi harus disertakan di parameter URL");
      error.statusCode = 400;
      throw error;
    }

    const transaction = await Transaction.findOne({
      where: { id, userId },
    });

    if (!transaction) {
      const error = new Error("Transaksi tidak ditemukan atau bukan milik user");
      error.statusCode = 404;
      throw error;
    }

    await Transaction.destroy({
      where: { id, userId },
    });

    res.status(200).json({
      status: "success",
      message: "Transaksi berhasil dihapus",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk menghapus data transaksi",
    });
  }
};

module.exports = {
  getAllTransactionsHandler,
  createTransactionHandler,
  getDetailTransactionByIdHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
};
