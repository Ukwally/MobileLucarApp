const express = require('express');
const mysql = require('mysql');


const bodyParser = require('body-parser'); // REMOVER
const cors = require('cors'); // REMOVER
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


// Middlewares
app.use(bodyParser.json()); // Para interpretar JSON no corpo da requisição
app.use(express.json());    // Alternativa moderna para interpretar JSON
app.use(cors());            // Permite requisições de origens diferentes

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lucar2'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Lucar Conectado ao banco de dados');
});

//conectar-se o uto banco
const dbDtser = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'externo_api'
});
dbDtser.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco externo_api:', err);
    return;
  }
  console.log('Conectado ao banco de dados externo_api');
});

//CONSULA DADOS DA VIATURA
app.get('/data/:matricola', (req, res) => {
  const matricola = req.params.matricola; // Captura o parâmetro da URL
  const query = `SELECT v.Matricola, v.Marca, v.Modelo, v.Ano, v.Cor,v.NumeroMotor,v.MedidaPmeumaticos,v.Servico,v.Lotacao,v.Cilindrada,v.NumeroCilindros,v.Combustivel,v.PesoBruto,v.Tara,v.NumeroQuadro,      pr.Id, pr.NumeroBI, c.Nome, c.Endereco, c.DataNascimento 
                  FROM viatura v 
                  JOIN propriedade pr ON v.Matricola = pr.Matricola 
                  JOIN cidadao c ON pr.NumeroBI = c.NumeroBI 
                  WHERE v.Matricola = ? 
                  AND (pr.DataFim IS NULL OR pr.DataFim = '0000-00-00')
                 `;

  db.query(query, [matricola], (err, results) => { // Usa o parâmetro na consulta
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      res.status(500).send('Erro ao consultar o banco de dados');
      return;
    }
    console.log('Resultados da consulta:', results);
    res.json(results);
  });
});

//CONSULTA HISTÓRICO
app.get('/historico/:matricola', (req, res) => {
  const matricola = req.params.matricola;
  const query = `SELECT pr.Matricola, pr.DataInicio, pr.DataFim, pr.Id, pr.NumeroBI, c.Nome, c.Endereco
               FROM Propriedade pr
               JOIN Cidadao c ON pr.NumeroBI = c.NumeroBI
               WHERE pr.Matricola = ?
               ORDER BY pr.DataInicio`;

  db.query(query, [matricola], (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      res.status(500).send('Erro ao consultar o banco de dados');
      return;
    }
    res.json(results);
  });
});


// LOGICA DE LOGIN FÁCIL DE ENTENDER(SEM A INTESPRETAÇÃO DE  SENHAS hasheadas)
/*
app.post('/login', (req, res) => {
  const { userId, password } = req.body; // Captura os dados do corpo da requisição

  // Consulta o banco de dados para verificar as credenciais
  const query = `SELECT * FROM usuarios WHERE tech_number = ? AND password = ?`;

  db.query(query, [userId, password], (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      res.status(500).send('Erro ao consultar o banco de dados');
      return;
    }

    if (results.length > 0) {
      res.status(200).send({ success: true, user: results[0] });
    } else {
      res.status(401).send({ success: false, message: 'Credenciais inválidas' });
    }
  });
}); */

//CONSULTA CIDADAO
app.get('/cidadao/:BI', (req, res) => {
  const BI = req.params.BI;
  const query = `SELECT *
               FROM cidadao
               WHERE NumeroBI = ?
               LIMIT 1`;

  db.query(query, [BI], (err, results) => {
    if (err) {
      console.error('Erro na consulta de cidadao:', err);
      res.status(500).send('Erro ao consultar o banco de dados');
      return;
    }
    res.json(results);
  });
});

//API login
app.post('/login', (req, res) => {
  const { userId, password } = req.body; // Captura os dados do corpo da requisição

  // Consulta o banco de dados pelo usuário
  const query = `SELECT * FROM usuarios WHERE tech_number = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      res.status(500).send('Erro ao consultar o banco de dados');
      return;
    }

    if (results.length === 0) {
      res.status(401).send({ success: false, message: 'Credenciais inválidas' });
      return;
    }

    const user = results[0];

    console.log('Usuário encontrado:', user);
    console.log('Hash armazenado:', user.password);
    console.log('Senha recebida:', password);

    // Verifica se a senha corresponde ao hash armazenado
    // bcrypt.compare(password, user.password, (err, isMatch) => {
    const hashStored = user.password.replace('$2y$', '$2a$');
    bcrypt.compare(password, hashStored, (err, isMatch) => {
      if (err) {
        console.error('Erro ao verificar a senha:', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }

      if (isMatch) {
        console.log('Login bem-sucedido');
        res.status(200).send({ success: true, user });
      } else {
        console.log('Senha incorreta');
        res.status(401).send({ success: false, message: 'Credenciais inválidas' });
      }
    });
  });
});






//APARTIR DAQUI ESTÃO AS APIs EXTERNAS AO DTSER ( PARA CONSULTAR: CARTAS, VIATURAS ROUBADAS,  MULTAS )
//API CONSULTA CARTAS (usando o banco externo_api)
app.get('/cartas', (req, res) => {
  const { numeroBI, numero_carta } = req.query;  // Captura os parâmetros passados na URL

  if (!numeroBI && !numero_carta) {
    return res.status(400).send('Por favor, forneça numeroBI ou numero_carta');
  }

  let query = 'SELECT * FROM cartas WHERE';
  let queryParams = [];

  if (numeroBI) {
    query += ' numeroBI = ?';
    queryParams.push(numeroBI);
  }
  if (numero_carta) {
    if (numeroBI) {
      query += ' OR';  // Se já existe o parametro numeroBI, fazemos a consulta por OR
    }
    query += ' numero_carta = ?';
    queryParams.push(numero_carta);
  }

  // Executar a query no banco de dados
  dbDtser.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      return res.status(500).send('Erro ao consultar o banco de dados');
    }

    if (results.length > 0) {
      res.json(results);  // Retorna os resultados encontrados
      console.log('CARTA encontrada')
      console.log(results)
    } else {
      res.status(404).send('Nenhuma carta encontrada para o numeroBI ou numero_carta fornecido');
    }
  });
});

// API CONSULTAR VIATURAS ROUBADAS (usando o banco externo_api)
app.get('/viaturas-roubadas/:matricula', (req, res) => {
  const { matricula } = req.params;
  const sql = `
    SELECT * FROM viaturasroubadas
    WHERE matricula = ?
    LIMIT 1
  `;

  dbDtser.query(sql, [matricula], (err, results) => {
    if (err) {
      console.error('Erro ao buscar ViaturasRoubadas:', err);
      return res.status(500).json({ error: 'Erro ao buscar ViaturasRoubadas' });
    }
    res.json(results);
  });
});







// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});