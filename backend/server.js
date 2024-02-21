// server.js

const express = require('express');
const csvParser = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = 3000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


let users = []; // Global variable with csv in rows
app.use(cors());


// GET api/users
// Receives: The function receives an HTTP GET request, possibly with query parameters, specifically q, which is used to filter users based on a search term.
// Returns: The function returns a JSON response containing the filtered users based on the query parameter q, or simply returns all users if no query parameter is provided.
app.get('/api/users', (req, res) => {
  const query = req.query.q

  if (!query) {
    return res.json({ data: users });
  }

  const lowercaseQuery = query.toLowerCase();
  
  // Filter users array for partial and case-insensitive matches
  const filteredUsers = users.filter(user => {
    return Object.values(user).some(value => {
      if (typeof value === 'string') {
        const lowercaseValue = value.toLowerCase();
        return lowercaseValue.includes(lowercaseQuery);
      } else if (typeof value === 'number') {
        const stringValue = value.toString();
        const lowercaseValue = stringValue.toLowerCase();
        return lowercaseValue.includes(lowercaseQuery);
      }
      return false; // Handle other data types as non-matches
    });
  });

  res.json({ data: filteredUsers });
});

// POST /api/files
// Receives: The function receives an HTTP POST request, which must include a file sent with the key file.
// Returns: The function returns a response indicating whether the file was received correctly and processed successfully. If there are errors during the processing of the file or if the file format is not supported (in this case, only CSV files are supported), the function returns a corresponding error status and an explanatory message.
app.post('/api/files', upload.single('file'), (req, res) => {
  const file = req.file;

  // Verificar se o arquivo foi enviado corretamente
  if (!file) {
    return res.status(500).send('File not received');
  }

  if (!file.originalname.endsWith('.csv')) {
    // Arquivo enviado não é um CSV, retornar erro 500
    return res.status(500).send({message: 'Unsupported file format. Only CSV files are supported.'});
  }

  // Ler o arquivo CSV e preencher os usuários
  users = []
  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on('data', (row) => {
      users.push(row); // Adicionar usuário à lista
    })
    .on('end', () => {
      // Excluir o arquivo CSV temporário
      fs.unlinkSync(file.path);
      
      // Faça o que você precisa fazer com os dados dos usuários aqui
      // Por exemplo, você pode salvá-los em um banco de dados
      
      res.status(200).send({message: 'CSV file processed successfully'});
    })
    .on('error', (error) => {
      // Lidar com erros durante o processamento do arquivo CSV
      console.error('Error processing CSV file:', error);
      res.status(500).send({message: 'An error occurred while processing the CSV file'});
    });
});
// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
