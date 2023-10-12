const express = require('express');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); 

const app = express();
const port = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SERVER_HOST,
  port: 587, // Cambia a 465 si estás utilizando conexiones SSL
  secure: false, // true para el puerto 465, false para el puerto 587
  auth: {
    user: process.env.API_USER,
    pass: process.env.API_KEY,
  },
});

// Configurar SendGrid con la API Key
sgMail.setApiKey(process.env.API_KEY);

// Ruta para enviar correos electrónicos con Dynamic Template
app.post('/api/enviar-correo-dinamico', async (req, res) => {
  try {
    const { remitente, destinatario, plantilla } = req.body;

    // Configurar el objeto de correo electrónico utilizando Dynamic Template
    const msg = {
      from: remitente, 
      to: destinatario,
      templateId: plantilla 
    };
    

    // Enviar el correo electrónico
    const info = await sgMail.send(msg);

    res.json({ mensaje: 'Correo electrónico enviado con éxito', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
});

// Ruta para enviar correos electrónicos sin Dynamic Template
app.post('/api/enviar-correo', async (req, res) => {
  try {
    const { remitente, destinatario, asunto, cuerpo } = req.body;

    // Configurar el objeto de correo electrónico sin Dynamic Template
    const mailOptions = {
      from: remitente, 
      to: destinatario,
      subject: asunto,
      text: cuerpo,
    };

    

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);

    res.json({ mensaje: 'Correo electrónico enviado con éxito', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
});

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, esta es tu API!');
});

// Escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
