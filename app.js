const express = require('express');
const cors = require('cors');
const allRoutes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", allRoutes);

app.listen(5000, () => console.log("Server jalan di port 5000"))