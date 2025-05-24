const Category = require('../models/CategoryModel')

const getAllCategoriesHandler = async(req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan semua kategori",
      data: categories
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk mendapatkan semua kategori",
    });
  }
}

const createCategoryHandler = async(req, res) => {
  try {
    const userId = req.user.id;
    const { name, type } = req.body;

    if (!name || !type) {
      const error = new Error("Field 'name' dan 'type' harus diisi");
      error.statusCode = 400;
      throw error;
    }

    if (!["income", "expense"].includes(type)) {
      const error = new Error("Field 'type' harus 'income' atau 'expense'");
      error.statusCode = 400;
      throw error;
    }

    const newCategory = await Category.create({ name, type, userId });

    res.status(201).json({
      status: "success",
      message: "Kategori berhasil dibuat",
      data: newCategory
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk membuat kategori baru",
    });
  }
}

const deleteCategoryHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    if (!id) {
      const error = new Error("Field 'id' kategori harus disertakan di parameter URL");
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findOne({ where: { id, userId } });

    if (!category) {
      const error = new Error("Kategori tidak ditemukan atau bukan milik user");
      error.statusCode = 404;
      throw error;
    }

    await category.destroy();

    res.status(200).json({
      status: "success",
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk menghapus kategori",
    });
  }
};


module.exports = {
  getAllCategoriesHandler,
  createCategoryHandler,
  deleteCategoryHandler
}