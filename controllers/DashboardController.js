const Transaction = require('../models/TransactionModel');
const Category = require('../models/CategoryModel');
const { Op, Sequelize } = require('sequelize');

const getDashboardHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDate = currentMonthStart.toISOString().split('T')[0];
    const endDate = currentMonthEnd.toISOString().split('T')[0];

    // 1. Monthly transactions with category
    const monthlyTransactions = await Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{
        model: Category,
        attributes: ['type'],
      }],
    });

    let totalIncome = 0;
    let totalExpense = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.category?.type === 'income') {
        totalIncome += parseFloat(transaction.amount);
      } else if (transaction.category?.type === 'expense') {
        totalExpense += parseFloat(transaction.amount);
      }
    });

    // 2. Last 5 transactions
    const recentTransactions = await Transaction.findAll({
      where: { userId },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'type'],
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 5,
    });

    // 3. Top 5 expense categories
    const expenseCategories = await Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{
        model: Category,
        where: { type: 'expense' },
        attributes: ['id', 'name', 'type'],
      }],
      attributes: [
        'categoryId',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
        [Sequelize.fn('COUNT', Sequelize.col('transaction.id')), 'transactionCount'],
      ],
      group: ['categoryId', 'category.id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'DESC']],
      limit: 5,
    });

    const topExpenseCategories = expenseCategories.map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.category.name,
      totalAmount: parseFloat(item.dataValues.totalAmount),
      transactionCount: parseInt(item.dataValues.transactionCount),
    }));

    const balance = totalIncome - totalExpense;

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const totalTransactionsThisMonth = monthlyTransactions.length;
    const avgDailyExpense = now.getDate() > 0 ? totalExpense / now.getDate() : 0;

    res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapatkan data dashboard',
      data: {
        summary: {
          currentMonth,
          currentYear,
          totalIncome,
          totalExpense,
          balance,
          totalTransactions: totalTransactionsThisMonth,
          averageDailyExpense: parseFloat(avgDailyExpense.toFixed(2)),
        },
        recentTransactions,
        topExpenseCategories,
        monthlyOverview: {
          period: `${currentMonth} ${currentYear}`,
          startDate,
          endDate,
          incomeTransactionCount: monthlyTransactions.filter(t => t.category?.type === 'income').length,
          expenseTransactionCount: monthlyTransactions.filter(t => t.category?.type === 'expense').length,
        },
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Server gagal untuk mendapatkan data dashboard',
    });
  }
};


module.exports = { getDashboardHandler };