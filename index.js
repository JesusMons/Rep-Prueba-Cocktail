function buscarRecetas() {
    // Obtener los valores de los campos de búsqueda
    var nombreReceta = document.getElementById("nombreReceta").value;
    var ingredienteReceta = document.getElementById("ingredienteReceta").value;

    // Verificar si se está buscando por nombre o por ingrediente
    if (nombreReceta.trim() !== "") {
        
        buscarPorNombre(nombreReceta);
    } else if (ingredienteReceta.trim() !== "") {
       
        buscarPorIngrediente(ingredienteReceta);
    } else {
       
        alert("Por favor, ingresa un nombre o un ingrediente para buscar.");
    }
}

function buscarPorNombre(nombre) {
    var url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(nombre);

    // Realizar la solicitud GET a la API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarRecetas(data);
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });
}

function buscarPorIngrediente(ingrediente) {
    var url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + encodeURIComponent(ingrediente);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarRecetas(data);
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });
}


function mostrarRecetas(data) {
    // Verificar si la propiedad 'drinks' está presente en la respuesta
    if (data.drinks) {
      
        limpiarResultadosAnteriores();

        // Iterar sobre cada cóctel en la respuesta
        data.drinks.forEach((coctel, index) => {
            // Crear un enlace para cada cóctel
            var link = document.createElement("a");
            link.href = "#";  
            link.textContent = coctel.strDrink;

            // Agregar un manejador de eventos para mostrar las instrucciones y el tipo de vaso al hacer clic
            link.addEventListener("click", function() {
                mostrarDetallesCoctel(coctel.idDrink);
            });

            // Crear un elemento de lista y agregar el enlace al contenedor de resultados
            var listItem = document.createElement("li");
            listItem.appendChild(link);
            document.getElementById("resultados").appendChild(listItem);
        });
    } else {
        console.log("No se encontraron cócteles con ese ingrediente.");
    }
}

function mostrarDetallesCoctel(idCocktail) {
    // Realizar una nueva solicitud a la API para obtener detalles específicos del cóctel por su ID
    var url = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + idCocktail;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //  procesar la respuesta y mostrar las instrucciones y el tipo de vaso
            var cocktailDetails = data.drinks[0];
            mostrarDetallesEnPantalla(cocktailDetails.strInstructions, cocktailDetails.strGlass);
        })
        .catch(error => {
            console.error("Error al obtener detalles del cóctel:", error);
        });
}

function mostrarDetallesEnPantalla(instructions, glassType) {
    // Actualizar el contenido del cuadro de texto con las instrucciones y el tipo de vaso
    var detalleCoctel = document.getElementById("detalleCoctel");
    detalleCoctel.value = "Instrucciones: " + instructions + "\nTipo de vaso: " + glassType;
}

function limpiarResultadosAnteriores() {
    // Limpiar el contenido anterior en el contenedor de resultados
    var resultadosContainer = document.getElementById("resultados");
    while (resultadosContainer.firstChild) {
        resultadosContainer.removeChild(resultadosContainer.firstChild);
    }
}
