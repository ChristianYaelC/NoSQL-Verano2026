async function obtenerPeliculas() {
    const respuesta = await fetch("/peliculas");
    if (!respuesta.ok) throw new Error("Error al consultar");
    return await respuesta.json();
}

async function agregarPelicula(pelicula) {
    const respuesta = await fetch("/peliculas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) throw new Error("Error al guardar");
    return await respuesta.json();
}

const formulario = document.getElementById("formulario");
const btnConsultar = document.getElementById("btnConsultar");
const listaPeliculas = document.getElementById("listaPeliculas");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pelicula = {
        titulo: document.getElementById("titulo").value,
        genero: document.getElementById("genero").value,
        año: Number(document.getElementById("año").value),
        duracion: Number(document.getElementById("duracion").value),
        idioma: document.getElementById("idioma").value,
        calificacion: Number(document.getElementById("calificacion").value),
        nc: document.getElementById("nc").value
    };

    try {
        await agregarPelicula(pelicula);
        alert("Película guardada");
        formulario.reset();
    } catch (error) {
        alert(error.message);
    }
});

btnConsultar.addEventListener("click", async () => {
    try {
        const peliculas = await obtenerPeliculas();
        listaPeliculas.innerHTML = "";
        peliculas.forEach((p) => {
            const li = document.createElement("li");
            li.textContent = `${p.titulo} (${p.año}) - ${p.calificacion}/10`;
            listaPeliculas.appendChild(li);
        });
    } catch (error) {
        alert(error.message);
    }
});
