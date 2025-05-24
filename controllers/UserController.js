require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error(
        `Semua field harus diisi username:${username}, password:${password}`
      );
      error.statusCode = 400;
      throw error;
    }

    const currenUser = await User.findOne({
      where: {
        username,
        deletedAt: null,
      },
    });

    if (!currenUser) {
      const error = new Error("Username tidak terdaftar");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, currenUser.password);

    if (!isPasswordValid) {
      const error = new Error("Password salah");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: currenUser.id },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      status: "success",
      message: "User berhasil login",
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk login user",
    });
  }
};

const registerHandler = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      const error = new Error(
        `Semua field harus diisi username:${username}, name:${name}, password:${password}`
      );
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({
      where: { username },
      paranoid: false
    });

    if (existingUser) {
      const error = new Error("Username sudah terdaftar");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      name,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      message: "User berhasil terdaftar",
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Server gagal untuk mendaftar user",
    });
  }
};

const editProfileUserHandler = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId, deletedAt: null }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan atau sudah dihapus",
      });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    await User.update(updatedData, { where: { id: userId } });

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Gagal memperbarui profil",
    });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId, deletedAt: null }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan atau sudah dihapus",
      });
    }

    await User.destroy({ where: { id: userId } });

    res.status(200).json({
      status: "success",
      message: "Akun berhasil dihapus (soft delete)",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Gagal menghapus akun",
    });
  }
};

module.exports = {
  loginHandler,
  registerHandler,
  editProfileUserHandler,
  deleteUserHandler
};
