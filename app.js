const express = require('express');
const cors = require('cors');
const allRoutes = require('./routes');

const app = express();
app.use(cors({
  origin: '*'
}));
app.u
app.use(express.json());
app.use("/api", allRoutes);

app.listen(5001, () => console.log("Server jalan di port 5001"))