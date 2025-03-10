const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  users: [{ type: String }], // Stocke les ID Keycloak des utilisateurs liés
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Company", companySchema);
