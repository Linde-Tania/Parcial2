//obtiene la referencia al contenedor main
const main = document.querySelector(".mainListMovies");
const totalPelis = [];

/* consigue el listado de generos */
fetch(
  genres_list_http +
  new URLSearchParams({
    api_key: api_key,
    language: "es",
  })
)
  .then((res) => res.json())
  .then((data) => {
    listCheckboxesGenero(data);
    data.genres.forEach((item) => {
      fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });

fetch(
  certification_movies +
  new URLSearchParams({
    api_key: api_key,
    language: "es",
  })
)
  .then((res) => res.json())
  .then((data) => {
    cargarSelectClasificaciones(data.certifications.US);
  });

const fetchListaPeliculasPorGenero = (id, genres, otrosPrametros = {}) => {
  fetch(
    movie_genres_http +
    new URLSearchParams({
      api_key: api_key,
      with_genres: id,
      page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
      language: "es",
      ...otrosPrametros,
    })
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      // totalPelis.push({ category: `${genres}_movies`, results: data.results });
      totalPelis.push(...data.results);
      construirElementoCategoria(`${genres}_movies`, data.results);
    })
    .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {
  main.innerHTML += `
    <div class="movie-list">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;
  construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
  const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.backdrop_path == null) {
      item.backdrop_path = item.poster_path;
      if (item.backdrop_path == null) {
        return;
      }
    }

    movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });
};

/* crea el titulo de categoria */
const cargarSelectClasificaciones = (data = []) => {
  const select = document.getElementById("Clasificiion");
  data.forEach((item) => {
    let option = document.createElement("option");
    option.text = item.certification;
    option.value = item.certification;
    select.add(option);
  });
};

/* Crear listado de generos checkboxs */
const listCheckboxesGenero = (data = []) => {
  const generos = data.genres;
  console.log(generos.length);
  let divContenedor = document.getElementById("generos");
  let htmlCheckboxs = "";
  generos.forEach((genero, index) => {
    htmlCheckboxs += `
    <div class="mealplanner-container">
      <div class="form-row ">
        <div class="buttons top-buttons">
            <input class="meal-checkbox meal" type="checkbox" name="${genero.name}" id="${genero.name}" value="${genero.id}">
            <label class="meal-label" for="${genero.name}">${genero.name}</label>
    </div>
    </div>
  </div>
    `;
  });
  divContenedor.innerHTML = htmlCheckboxs;
};

{/* <label for="${genero.name}">${genero.name}</label>
<input class="checkboxGenero" type="checkbox" id="${genero.name}" name="${genero.name}" value="${genero.id}" > */}

const removerDuplicados = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

const correrFiltro = () => {
  let checkboxs = document.getElementsByClassName("meal-checkbox");
  let generosSeleccionados = [];
  let otrosParametros = {};
  /* Depurar listado de generos seleccionados */
  for (let i = 0; checkboxs[i]; ++i) {
    if (checkboxs[i].checked) {
      generosSeleccionados.push({
        id: checkboxs[i].value,
        name: checkboxs[i].name,
      });
    }
  }
  /* Crear filtro de año */
  let anio = document.getElementById("anioLanzamiento").value;
  if (anio) {
    //validamos que se haya ingreado el anio
    otrosParametros.year = anio;
  }
  /* Crear filtro para adulto mejor calificada */
  let adultoMejorCalficada = document.getElementById("adultMejorCalificada");
  if (adultoMejorCalficada.checked) {
    otrosParametros.include_adult = true;
    otrosParametros.sort_by = "vote_count.asc";
  }
  /* Filtro de certificacion */
  let clasificacion = document.getElementById("Clasificiion").value;
  if (clasificacion && clasificacion != "0") {
    otrosParametros.certification_country = "US";
    otrosParametros.certification = clasificacion;
  }

  console.log({ otrosParametros });
  main.innerHTML = "";

  generosSeleccionados.forEach((genero) => {
    fetchListaPeliculasPorGenero(genero.id, genero.name, otrosParametros);
  });
  console.log({ generosSeleccionados });


};