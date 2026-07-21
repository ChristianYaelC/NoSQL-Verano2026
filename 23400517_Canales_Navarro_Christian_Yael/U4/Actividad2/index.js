const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());)
const port = 3000;

app.use(morgan("dev"));

let alumnos = [
    {
        id:1,
        nombre: "Christian",
        carrera: "ISC",
        semestre: 7,
    },
    {
        id:2,
        nombre: "Juan",
        carrera: "IM",
        semestre: 7,
    }
]

app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});

app.get("/par/:numero", (req, res) => {
    const numero = parseInt(req.params.numero);
    if (numero % 2 === 0) {
        res.send(`El número ${numero} es par`);
    } else {
        res.send(`El número ${numero} no es par`);
    }
});

app.listen(port,() => {
    console.log("Servidor iniciado en http://localhost: " + port);
});

app.get("/edad/:edad", (req, res) => {
    const edad = parseInt(req.params.edad);
    if (edad >= 18) {
        res.send(`Eres mayor de edad`);
    } else {
       res.send(`Eres menor de edad`);
    }
});

app.get("/calculadora/:operacion/:a/:b", (req, res) => {
    const operacion = req.params.operacion;
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    let resultado;
    switch (operacion) {
        case "suma":
            resultado = a + b;
            break
        case "resta":
            resultado = a - b;
            break
        case "multiplicacion":
            resultado = a * b;
            break
        case "division":
            resultado = a / b;
            break
    }
    res.send(`Resultado: ${resultado}`);
});

app.get("/tabla/:numero", (req, res) =>{
    const numero = parseInt(req.params.numero);
    let tabla = "";
    for (let i = 1; i <= 10; i++) {
        tabla += `${numero} x ${i} = ${numero * i}<br>`;
    }
    res.send(tabla);
});

app.get("/calificacion/:nota", (req, res) => {
    const nota = parseInt(req.params.nota);
    let calificacion;
    if(nota < 70){
        calificacion = "Reprobado";
    }else if(nota >= 70 && nota <80){
        calificacion = "Aprobado";
    }else if(nota >=80 && nota < 90){
        calificacion = "Muy bien";
    }else if(nota >=90){
        calificacion = "Excelente"
    };
    res.send(`Calificación: ${calificacion}`);
});