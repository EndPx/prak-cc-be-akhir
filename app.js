const express = require('express');
const cors = require('cors');
const allRoutes = require('./routes');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000','https://tcc-fe-akhir-292820894391.us-central1.run.app'],
  credentials: true
}));
app.use(express.json());
app.use("/api", allRoutes);

app.listen(5001, () => console.log("Server jalan di port 5001"))