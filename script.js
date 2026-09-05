const carrito = []

const botonesAgregar = document.querySelectorAll(".card-body button, #agua-polvo button");

botonesAgregar.forEach((boton) =>{
    boton.addEventListener('click', () =>{
        const contenedor = boton.closest(".card-body") || boton.closest("article");

        if (contenedor){
            const titulo = contenedor.querySelector("h3");

            if (titulo){
                let nombreProducto = titulo.textContent.trim();

                if (nombreProducto === "¿Qué es el Agua en Polvo?"){
                    nombreProducto = "Agua en polvo";
                }

                carrito.push(nombreProducto)

                alert(`¡${nombreProducto} se ha añadido al carrito!`)
            }
        }
    });
});

