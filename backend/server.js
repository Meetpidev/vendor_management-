const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const googleAuthMiddleware = require('./googleAuth.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});


mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Mogo is connected");
}).catch(() => {
    console.log("Error");
});

const Vendor = mongoose.model('Vendor', {
  name: String,
  accountNo: String,
  bankName: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  country: String,
  zipCode: String,
  creatorEmail: String,
});

app.use(cors());
app.use(express.json());
dotenv.config();

app.use('/test', (req, res) => {
  res.send("It's working");
});

// Create Vendor
app.post('/api/vendors',googleAuthMiddleware, async (req, res) => {
   const vendorData = { ...req.body, creatorEmail: req.user.email };
  const vendor = new Vendor(vendorData);
  await vendor.save();
  res.send(vendor);
});

// Get Paginated Vendors
app.get('/api/vendors', async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const vendors = await Vendor.find()
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Vendor.countDocuments();
  res.send({ vendors, total });
});

// Get Vendor by ID
app.get('/api/vendors/:id',googleAuthMiddleware, async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  res.send(vendor);
});

// Update Vendor
app.put('/api/vendors/:id',googleAuthMiddleware, async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(vendor);
});

// Delete Vendor
app.delete('/api/vendors/:id',googleAuthMiddleware, async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.send({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
