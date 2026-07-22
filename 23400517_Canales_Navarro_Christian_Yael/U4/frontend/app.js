const API_URL = "http://localhost:3000";

/* ========================================================
   API PETICIONES (PELÍCULAS & SERIES)
======================================================== */

// --- PELÍCULAS ---
async function obtenerPeliculas() {
    const respuesta = await fetch(`${API_URL}/peliculas`);
    if (!respuesta.ok) throw new Error("Error al consultar las películas");
    return await respuesta.json();
}

async function agregarPelicula(pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.error || "Error al guardar la película");
    }
    return await respuesta.json();
}

async function actualizarPelicula(idMongo, pelicula) {
    const respuesta = await fetch(`${API_URL}/peliculas/${idMongo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pelicula)
    });
    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.error || "Error al actualizar la película");
    }
    return await respuesta.json();
}

async function eliminarPeliculaAPI(idMongo) {
    const respuesta = await fetch(`${API_URL}/peliculas/${idMongo}`, { method: "DELETE" });
    if (!respuesta.ok) throw new Error("Error al eliminar la película");
}

// --- SERIES ---
async function obtenerSeries() {
    const respuesta = await fetch(`${API_URL}/series`);
    if (!respuesta.ok) throw new Error("Error al consultar las series");
    return await respuesta.json();
}

async function agregarSerie(serie) {
    const respuesta = await fetch(`${API_URL}/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });
    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.error || "Error al guardar la serie");
    }
    return await respuesta.json();
}

async function actualizarSerie(idMongo, serie) {
    const respuesta = await fetch(`${API_URL}/series/${idMongo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serie)
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || errorData.error || "Error al actualizar la serie");
    }

    return await respuesta.json();
}

async function eliminarSerieAPI(idMongo) {
    const respuesta = await fetch(`${API_URL}/series/${idMongo}`, { method: "DELETE" });
    if (!respuesta.ok) throw new Error("Error al eliminar la serie");
}


/* ========================================================
   LÓGICA DE INTERFAZ Y MODAL
======================================================== */

const formulario = document.getElementById("formulario");
const btnConsultar = document.getElementById("btnConsultar");
const listaContenido = document.getElementById("listaContenido");
const statTotal = document.getElementById("statTotal");
const statPromedio = document.getElementById("statPromedio");
const rowTitle = document.getElementById("rowTitle");

const modalForm = document.getElementById("modalForm");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const modalTitulo = document.getElementById("modalTitulo");
const btnGuardar = document.getElementById("btnGuardar");

const campoDinamicoPeliculas = document.getElementById("campoDinamicoPeliculas");
const campoDinamicoSeries = document.getElementById("campoDinamicoSeries");

const tabPeliculas = document.getElementById("tabPeliculas");
const tabSeries = document.getElementById("tabSeries");

let modoActual = "peliculas"; 
let editando = false;
let idMongoEditando = null; // Guardamos únicamente el _id de MongoDB

const PORTADA_DEFAULT = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop";

/* --- MODAL CONTROLES --- */
btnAbrirModal.addEventListener("click", () => {
    salirModoEdicion();
    modalForm.style.display = "flex";
});

btnCerrarModal.addEventListener("click", () => {
    modalForm.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modalForm) modalForm.style.display = "none";
});

function salirModoEdicion() {
    editando = false;
    idMongoEditando = null;
    const tipoTexto = modoActual === "peliculas" ? "Película" : "Serie";
    modalTitulo.textContent = `Añadir Nueva ${tipoTexto}`;
    btnGuardar.textContent = `Guardar en Catálogo`;
    formulario.reset();
    ajustarCamposModal();
}

function ajustarCamposModal() {
    if (modoActual === "peliculas") {
        campoDinamicoPeliculas.style.display = "block";
        campoDinamicoSeries.style.display = "none";
        document.getElementById("duracion").required = true;
        document.getElementById("temporadas").required = false;
        document.getElementById("episodios").required = false;
    } else {
        campoDinamicoPeliculas.style.display = "none";
        campoDinamicoSeries.style.display = "grid";
        document.getElementById("duracion").required = false;
        document.getElementById("temporadas").required = true;
        document.getElementById("episodios").required = true;
    }
}

/* --- SUBMIT DEL FORMULARIO --- */
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const portadaInput = document.getElementById("portada").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const año = Number(document.getElementById("año").value);
    const idioma = document.getElementById("idioma").value.trim();
    const calificacion = Number(document.getElementById("calificacion").value);
    const nc = document.getElementById("nc").value.trim();

    try {
        if (modoActual === "peliculas") {
            const pelicula = {
                titulo,
                genero,
                año,
                duracion: Number(document.getElementById("duracion").value),
                idioma,
                calificacion,
                nc,
                portada: portadaInput || PORTADA_DEFAULT
            };

            if (editando) {
                await actualizarPelicula(idMongoEditando, pelicula);
            } else {
                await agregarPelicula(pelicula);
            }
        } else {
            const serie = {
                titulo,
                genero,
                año,
                temporadas: Number(document.getElementById("temporadas").value),
                episodios: Number(document.getElementById("episodios").value),
                idioma,
                calificacion,
                nc,
                portada: portadaInput || PORTADA_DEFAULT
            };

            if (editando) {
                await actualizarSerie(idMongoEditando, serie);
            } else {
                await agregarSerie(serie);
            }
        }

        formulario.reset();
        modalForm.style.display = "none";
        await cargarContenido();
    } catch (error) {
        alert(error.message);
    }
});

/* --- RENDERIZAR TARJETAS --- */
function renderCard(item) {
    const imgPortada = (item.portada && item.portada.trim() !== "") ? item.portada : PORTADA_DEFAULT;
    
    let detalleEspecifico = "";
    if (modoActual === "peliculas") {
        detalleEspecifico = item.duracion ? `<span>${item.duracion} min</span>` : '';
    } else {
        const temp = item.temporadas ? `${item.temporadas} Temp` : '';
        const ep = item.episodios ? `${item.episodios} Ep` : '';
        detalleEspecifico = `<span>${temp} ${ep ? '• ' + ep : ''}</span>`;
    }

    return `
    <li class="movie-card">
        <div class="poster-wrapper">
            <img class="poster-img" src="${imgPortada}" alt="${item.titulo}" onerror="this.src='${PORTADA_DEFAULT}'">
            <div class="rating-badge">
                <i class="ti ti-star-filled"></i> ${item.calificacion}
            </div>
        </div>
        <div class="movie-details">
            <div>
                <div class="movie-title">${item.titulo}</div>
                <div class="movie-tags">
                    <span class="tag-hd">${modoActual === "peliculas" ? "PELÍCULA" : "SERIE"}</span>
                    <span>${item.genero || ''}</span>
                    <span>${item.año}</span>
                </div>
                <div class="movie-subtags">
                    ${detalleEspecifico}
                </div>
            </div>
            <div class="card-actions">
                <button type="button" class="btn-card btn-edit" data-id="${item._id}">
                    <i class="ti ti-edit"></i> Editar
                </button>
                <button type="button" class="btn-card btn-delete" data-id="${item._id}">
                    <i class="ti ti-trash"></i> Eliminar
                </button>
            </div>
        </div>
    </li>`;
}

function actualizarStats(lista) {
    statTotal.textContent = lista.length;
    if (lista.length === 0) {
        statPromedio.textContent = "0";
        return;
    }
    const suma = lista.reduce((acc, p) => acc + Number(p.calificacion || 0), 0);
    statPromedio.textContent = (suma / lista.length).toFixed(1);
}

/* --- CARGAR CONTENIDO DE LA API --- */
async function cargarContenido() {
    try {
        const data = modoActual === "peliculas" ? await obtenerPeliculas() : await obtenerSeries();

        if (!data || data.length === 0) {
            listaContenido.innerHTML = `<li style="grid-column: 1/-1; text-align: center; color: #777; padding: 60px;">No hay ${modoActual} registradas en el catálogo.</li>`;
            actualizarStats([]);
            return;
        }

        listaContenido.innerHTML = data.map(renderCard).join("");
        actualizarStats(data);

        listaContenido.querySelectorAll(".btn-edit").forEach((btn) => {
            btn.addEventListener("click", () => iniciarEdicion(btn.dataset.id, data));
        });

        listaContenido.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", () => confirmarEliminar(btn.dataset.id));
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

function iniciarEdicion(idMongo, lista) {
    const item = lista.find((p) => String(p._id) === String(idMongo));
    if (!item) return;

    document.getElementById("titulo").value = item.titulo || "";
    document.getElementById("portada").value = item.portada || "";
    document.getElementById("genero").value = item.genero || "";
    document.getElementById("año").value = item.año || "";
    document.getElementById("idioma").value = item.idioma || "";
    document.getElementById("calificacion").value = item.calificacion || "";
    document.getElementById("nc").value = item.nc || "";

    ajustarCamposModal();

    if (modoActual === "peliculas") {
        document.getElementById("duracion").value = item.duracion || "";
    } else {
        document.getElementById("temporadas").value = item.temporadas || "";
        document.getElementById("episodios").value = item.episodios || "";
    }

    editando = true;
    idMongoEditando = item._id;
    
    const tipoTexto = modoActual === "peliculas" ? "Película" : "Serie";
    modalTitulo.textContent = `Editar ${tipoTexto}`;
    btnGuardar.textContent = `Actualizar ${tipoTexto}`;

    modalForm.style.display = "flex";
}

async function confirmarEliminar(idMongo) {
    const tipoTexto = modoActual === "peliculas" ? "película" : "serie";
    if (!confirm(`¿Deseas eliminar esta ${tipoTexto}?`)) return;

    try {
        if (modoActual === "peliculas") await eliminarPeliculaAPI(idMongo);
        else await eliminarSerieAPI(idMongo);

        await cargarContenido();
    } catch (error) {
        alert(error.message);
    }
}

/* --- CAMBIO DE TABS (PELÍCULAS / SERIES) --- */
tabPeliculas.addEventListener("click", () => {
    modoActual = "peliculas";
    tabPeliculas.classList.add("active");
    tabSeries.classList.remove("active");
    btnAbrirModal.innerHTML = `<i class="ti ti-plus"></i> Añadir Película`;
    rowTitle.textContent = "Catálogo de Películas";
    cargarContenido();
});

tabSeries.addEventListener("click", () => {
    modoActual = "series";
    tabSeries.classList.add("active");
    tabPeliculas.classList.remove("active");
    btnAbrirModal.innerHTML = `<i class="ti ti-plus"></i> Añadir Serie`;
    rowTitle.textContent = "Catálogo de Series";
    cargarContenido();
});

btnConsultar.addEventListener("click", cargarContenido);

// Carga inicial
cargarContenido();