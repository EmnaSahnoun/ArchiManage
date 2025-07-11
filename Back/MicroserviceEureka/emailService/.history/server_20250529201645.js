require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Eureka = require('eureka-js-client').Eureka;
// Importer les routes
const authRoutes = require("./src/routes/authRoutes");
const emailRoutes = require("./src/routes/emailRoutes");
const draftRoutes = require("./src/routes/draftRoutes");

const app = express();

// Middlewares
app.use(cors()); // Activer CORS pour toutes les origines (à ajuster en production)
app.use(express.json()); // Pour parser le JSON des requêtes entrantes

const PORT = process.env.PORT || 8079;

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


const eurekaClient = new Eureka({
  instance: {
    app: process.env.APP_NAME,
    instanceId: `${process.env.APP_NAME}:${process.env.PORT}`,
    hostName: process.env.EUREKA_INSTANCE_HOSTNAME,
    ipAddr: '127.0.0.1', // À remplacer par votre IP si nécessaire
    port: {
      '$': parseInt(process.env.PORT),
      '@enabled': true
    },
    vipAddress: process.env.APP_NAME,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    },
    preferIpAddress: process.env.EUREKA_PREFER_IP_ADDRESS === 'true'
  },
  eureka: {
    serviceUrls: {
      default: [
        process.env.EUREKA_SERVICE_URL
      ]
    },
    registerWithEureka: true,
    fetchRegistry: true
  }
});

// Démarrer Eureka une fois que le serveur Express est prêt
eurekaClient.start(error => {
  if (error) {
    console.error('Erreur lors de l’enregistrement auprès d’Eureka:', error);
  } else {
    console.log('Enregistré auprès d’Eureka avec succès');
  }
});
app.listen(PORT, () => {
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
});
