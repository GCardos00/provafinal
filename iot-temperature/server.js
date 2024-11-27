// server.js
const express = require('express');
const admin = require('firebase-admin');
const app = express();
const path = require('path'); // Importar o módulo 'path' para resolver caminhos de arquivos
const port = 3000;

// Inicializando o Firebase Admin SDK
const serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projetoprova-94956-default-rtdb.firebaseio.com",
});

// Rota para listar as leituras de temperatura e umidade
app.use(express.static('public'));

// Rota para a raiz: Serve o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve o index.html
});

// Rota para listar as leituras de temperatura e umidade
app.get('/leituras', (req, res) => {
  const db = admin.database();
  const ref = db.ref('leituras');

  ref.once('value', (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      return res.status(404).send('Nenhuma leitura encontrada');
    }

    const leiturasList = Object.keys(data).map(key => {
      const leitura = data[key];
      const isTemperaturaAlta = leitura.temperatura > 30;  // Temperatura alta definida como > 30°C

      return {
        id: key,
        temperatura: leitura.temperatura,
        umidade: leitura.umidade,
        data: leitura.data,
        hora: leitura.hora,
        temperaturaAlta: isTemperaturaAlta
      };
    });

    res.json(leiturasList);
  }, (errorObject) => {
    res.status(500).send('Erro ao buscar leituras: ' + errorObject.code);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});