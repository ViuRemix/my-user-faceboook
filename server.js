const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối cơ sở dữ liệu
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Kết nối thất bại:", err);
    return;
  }
  console.log("Kết nối cơ sở dữ liệu thành công!");
});

// API đăng nhập
app.post("/login", (req, res) => {
  const { fullname, password } = req.body;

  // Kiểm tra thông tin đăng nhập
  const query =
    "SELECT * FROM users_facebook WHERE fullname = ? AND password = ?";
  db.query(query, [fullname, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Đăng nhập thành công" });
    } else {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }
  });
});

// đăng ký
// API đăng ký
// API đăng ký
app.post("/signup", (req, res) => {
  const { fullname, password } = req.body;

  // Kiểm tra nếu người dùng đã tồn tại
  const checkQuery = "SELECT * FROM users_facebook WHERE fullname = ?";
  db.query(checkQuery, [fullname], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    // Thêm người dùng mới vào cơ sở dữ liệu
    const insertQuery =
      "INSERT INTO users_facebook (fullname, password) VALUES (?, ?)";
    db.query(insertQuery, [fullname, password], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi hệ thống" });
      }

      return res.status(201).json({ message: "Đăng ký thành công" });
    });
  });
});

// Chạy server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
