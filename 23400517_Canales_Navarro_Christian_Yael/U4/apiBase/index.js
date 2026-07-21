const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const port = 3000;

app.use(morgan("dev"));

mongoose.connect("mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix")
.then(() => {
    console.log("Conectado correctamente a MongoDB");
})
.catch((error) => {
    console.error("Error al conectar con MongoDB", error);
});

const alumnoSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim: true},
        carrera: {type: String, required: true, trim: true},
        semestre: {type: Number, required: true, min: 1}
    },
    {
        timestamps: true
    }
);

const Alumno = mongoose.model("Alumno", alumnoSchema);


let alumnos = [
    {
        id:1,
        nombre: "Christian",
        carrera: "ISC",
        semestre: 7
    },
    {
        id:2,
        nombre: "Juan",
        carrera: "IM",
        semestre: 7
    }
]


app.get("/alumnos", async (req, res) => {
    try { 
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los alumnos",
            error: error
        })
    }
});

app.get("/alumnos/:id", async (req, res) => {
    try {
        const id = (req.params.id);
        const alumno = await alumnos.findBy(id);
        if (!alumno) {
            res.status(404).json({
                mensaje: "Alumno no encontrado"
            })    
        }
        res.json(alumno);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener alumno",
            error: error
        });
    }
});

app.post("/alumnos", async (req, res) => {
    try {
        const {nombre, carrera, semestre } = req.body;
        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }
        const nuevoAlumno = new Alumno({
            nombre, carrera, semestre
        });
        const alumnoGuardado = await nuevoAlumno.save();
        res.json({
            mensaje: "Alumno registrado correctamente",
            alumno: alumnoGuardado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al guardar alumno",
            error: error
        });
    }
});

app.put("/alumnos/:id", async (req, res) => {
    try {
        const id = (req.params.id);
        const {nombre, carrera, semestre } = req.body;
        
        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }

        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            id,
            { nombre, carrera, semestre},
            { new: true, runValidators: true}
        );

        if(!alumnoActualizado) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado",
                alumno: alumnoActualizado
            });
        }

        res.json({
            mensaje: "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar alumno",
            error: error
        });
    }
});

app.delete("/alumnos/:id", async (req, res) => {
    try{
        const id = (req.params.id);
        const alumnoEliminado = await Alumno.findByIdAndDelete(
            id
        );
        if(!alumnoEliminado){
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }
        res.json({
            mensaje: "Alumno eliminado correctamente",
            alumno: alumnoEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar alumno",
            error: error
        });
    }
});


app.get("/", (req, res) => {
    res.send("Hola Mundo");
});

app.get("/mensaje", (req, res) => {
    res.send("Mensaje desde Express");
});

app.get("/pagina", (req, res) => {
    const nombre = "Christian";
    res.send(`
        <style>
            .p1 {
                color: red;
                background: lightblue;
            }
        </style>
        <h1>Mi página web</h1>
        <p class="p1">Creada con Express</p>
        <p>Hola ${nombre}</p>
    `);
});

app.get("/alumno", (req, res) => {
    res.json({
        nombre: "Christian",
        carrera: "ISC",
        semestre: 7
    });
});

app.get("/materias", (req, res) => {
    res.json([
        {nombre: "NoSQL",hora: "08:00 - 11:00"},
        {nombre: "Programación Web",hora: "14:00 - 17:00"},
    ]);
});

app.get("/mensaje/:nombre", (req, res) => {
    res.send(`Hola ${req.params.nombre}`);
});

app.get("/suma/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    res.send(`Resultado ${a+b}`)
})

app.get("/multiplicar/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    res.send(`Resultado ${a*b}`)
});

app.get("/aleatorio", (req, res) => {
    const numero = Math.floor(Math.random() * 100);
    res.send(`Número aleatorio: ${numero}`);
});

app.listen(port, () => {
  console.log("Servidor iniciadio en http://localhost:" + port);
});

const peliculaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true },
        duracion: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }
    },
    {
        timestamps: true
    }
);

const serieSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true },
        temporadas: { type: Number, required: true, min: 1 },
        episodios: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }
    },
    {
        timestamps: true
    }
);

const Pelicula = mongoose.model('Pelicula', peliculaSchema);
const Serie = mongoose.model('Serie', serieSchema);

app.get('/peliculas', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las películas', error: error.message });
    }
});

app.post('/peliculas', async (req, res) => {
    try {
        const nuevaPelicula = new Pelicula(req.body);
        const peliculaGuardada = await nuevaPelicula.save();
        res.status(201).json(peliculaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la película', error: error.message });
    }
});

app.put('/peliculas/:id', async (req, res) => {
    try {
        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!peliculaActualizada) {
            return res.status(404).json({ mensaje: 'Película no encontrada' });
        }
        res.status(200).json(peliculaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la película', error: error.message });
    }
});

app.delete('/peliculas/:id', async (req, res) => {
    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(req.params.id);
        if (!peliculaEliminada) {
            return res.status(404).json({ mensaje: 'Película no encontrada' });
        }
        res.status(200).json({ mensaje: 'Película eliminada correctamente', pelicula: peliculaEliminada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la película', error: error.message });
    }
});

app.get('/series', async (req, res) => {
    try {
        const series = await Serie.find();
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las series', error: error.message });
    }
});

app.post('/series', async (req, res) => {
    try {
        const nuevaSerie = new Serie(req.body);
        const serieGuardada = await nuevaSerie.save();
        res.status(201).json(serieGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la serie', error: error.message });
    }
});

app.put('/series/:id', async (req, res) => {
    try {
        const serieActualizada = await Serie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!serieActualizada) {
            return res.status(404).json({ mensaje: 'Serie no encontrada' });
        }
        res.status(200).json(serieActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la serie', error: error.message });
    }
});

app.delete('/series/:id', async (req, res) => {
    try {
        const serieEliminada = await Serie.findByIdAndDelete(req.params.id);
        if (!serieEliminada) {
            return res.status(404).json({ mensaje: 'Serie no encontrada' });
        }
        res.status(200).json({ mensaje: 'Serie eliminada correctamente', serie: serieEliminada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la serie', error: error.message });
    }
});