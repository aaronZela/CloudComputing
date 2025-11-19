const admin = require('firebase-admin');
const path = require('path');

const initializeFirebase = () => {
  try {
    // 1. Buscamos el archivo subiendo 2 niveles desde 'src/config' hacia 'backend'
    const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
    
    // 2. Lo importamos directamente
    const serviceAccount = require(serviceAccountPath);

    // 3. Inicializamos Firebase
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // Usamos el project_id que viene dentro del mismo archivo para no fallar
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
      console.log('✅ Firebase (Backend) conectado exitosamente');
    }
  } catch (error) {
    console.error('❌ Error CRÍTICO inicializando Firebase:', error.message);
    console.error('👉 Verifica que el archivo "serviceAccountKey.json" esté en la carpeta "backend"');
  }
};

const db = () => admin.firestore();
const auth = () => admin.auth();

module.exports = { initializeFirebase, admin, db, auth };