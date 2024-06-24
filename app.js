const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 3000;
const ip = "localhost";
const connection = require("./DataBase/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static("public/"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/form.html"));
});

// Ruta para guardar datos
app.post("/guardar", (req, res) => {
  const { nombres, apellidos, dni, telefono, direccion, correo, asunto, mensaje } = req.body;
  console.log("Datos recibidos del formulario:");
  console.log(req.body);

  const sql = `INSERT INTO contactos (nombres, apellidos, dni, telefono, direccion, correo, asunto, mensaje, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'activo')`;
  connection.query(sql, [nombres, apellidos, dni, telefono, direccion, correo, asunto, mensaje], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error al guardar los datos');
      return;
    }
    res.redirect("/");
  });
});

// Ruta para obtener todos los datos
app.get("/contactos", (req, res) => {
  const sql = 'SELECT * FROM contactos WHERE estado = "activo"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error al obtener los datos');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener datos específicos por id
app.get("/contactos/:id", (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM contactos WHERE id = ? AND estado = "activo"';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error al obtener los datos');
      return;
    }
    res.json(results[0]);
  });
});

// Ruta para actualizar datos
app.put("/contactos/:id", (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, dni, telefono, direccion, correo, asunto, mensaje } = req.body;
  const sql = `UPDATE contactos SET nombres = ?, apellidos = ?, dni = ?, telefono = ?, direccion = ?, correo = ?, asunto = ?, mensaje = ? WHERE id = ? AND estado = 'activo'`;
  connection.query(sql, [nombres, apellidos, dni, telefono, direccion, correo, asunto, mensaje, id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error al actualizar los datos');
      return;
    }
    res.send('Datos actualizados correctamente');
  });
});

// Ruta para eliminar datos lógicamente
app.delete("/contactos/:id", (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE contactos SET estado = 'eliminado' WHERE id = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).send('Error al eliminar los datos');
      return;
    }
    res.send('Datos eliminados correctamente');
  });
});

app.listen(PORT, () => {
  console.log(`Server en http://${ip}:${PORT}`);
});
