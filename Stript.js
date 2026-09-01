const boton_carro = document.querySelector("#btn-carro");

boton_carro.addEventListener("click", () =>{
    const producto = document.querySelector("#producto");

    const lista = document.querySelector("#ListaProductos");

    if(producto.value = ""){
        alert("El producto no puede estar vacio")
    }else{
        let li = document.createElement("li");

        li.textContent = producto.value;

        producto.value = "";

        lista.appendChild(li);
    }
})

const boton_comprar = document.querySelector("btn-comprar")

boton_comprar.addEventListener("click", () =>{

    const h3_nombre = document.querySelector("#nombre_producto")

    let stock = Math.floor(Math.random() * 10) + 1

    alert(h3_nombre.textContent.trim() + "\nStock: "  + stock )
})