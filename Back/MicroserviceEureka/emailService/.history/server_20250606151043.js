require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Eureka = require('eureka-js-client').Eureka;
const { startEmailNotificationConsumer } = require('./consumer/emailNotificationConsumer');
const app = express();

// Middlewares
// 1. Configuration CORS améliorée
const corsOptions = {
  origin: ['http://localhost:4200', 'https://e8.systeo.tn'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());


// Importer les routes
const authRoutes = require("./src/routes/authRoutes");
const emailRoutes = require("./src/routes/emailRoutes");
const draftRoutes = require("./src/routes/draftRoutes");
const PORT = process.env.PORT || 8079;
const client = new Eureka({
  instance: {
    app: 'emailService',
    instanceId: `e8.systeo.tn:emailService:${PORT}`, // Ajoutez ceci
    hostName: 'e8.systeo.tn',
    ipAddr: '161.97.88.195',
    port: {
      '$': PORT,
      '@enabled': 'true',
    },
    vipAddress: 'emailService',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    // Ajoutez ces métadonnées si nécessaire
    metadata: {
      'management.port': PORT,
      'securePort': 443,
      'securePortEnabled': 'true'
    }
  },
  eureka: {
    host: 'eureka.systeo.tn',
    port: 443,
    servicePath: '/eureka/apps/',
    ssl: true,
  },
});

// Démarrer le client Eureka
client.start(error => {
  console.log(error || 'Client Eureka démarré avec succès');
});

// Gestion de la fermeture propre
process.on('SIGINT', () => {
  client.stop();
  process.exit();
});

// Utiliser les routes
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes); // Préfixe pour toutes les routes liées aux emails
app.use("/drafts", draftRoutes); // Préfixe pour toutes les routes liées aux brouillons

// Route de base pour vérifier si le serveur fonctionne
app.get("/", (req, res) => {
  res.send("Serveur API Gmail fonctionnel.");
});

// Gestionnaire d'erreurs global (optionnel mais recommandé)
app.use((err, req, res, next) => {
  console.error("Erreur non gérée:", err.stack);
  res.status(500).json({ success: false, error: "Erreur interne du serveur." });
});

app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log("Endpoints disponibles:");
  console.log(`GET  /auth/google`);
  console.log(`GET  /auth/google/callback`);
  console.log(`POST /auth/refresh-token`);
  console.log(`POST /emails/send`);
  console.log(`GET  /emails/sent`);
  console.log(`GET  /emails/inbox`);
  console.log(`POST /emails/mark-as-read`);
  console.log(`GET  /emails/check-read/:emailId`);
  console.log(`DELETE /emails/:emailId`);
  console.log(`POST /emails/:emailId/restore`);
  console.log(`GET  /drafts`);
  console.log(`DELETE /drafts/:draftId`);
  try {
    await startEmailNotificationConsumer();
  } catch (error) {
    console.error('Erreur lors du démarrage du consumer RabbitMQ:', error);
  }
});