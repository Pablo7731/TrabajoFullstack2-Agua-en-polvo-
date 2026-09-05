function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function obtenerDescuento() {
  return parseFloat(sessionStorage.getItem('descuentoAplicado')) || 0;
}

function guardarDescuento(porcentaje) {
  sessionStorage.setItem('descuentoAplicado', porcentaje);
}

function calcularTotales() {
  const carrito = obtenerCarrito();
  const subtotal = carrito.reduce((acc, prod) => acc + prod.precio, 0);
  const porcentajeDescuento = obtenerDescuento();
  const descuento = subtotal * porcentajeDescuento;
  const totalFinal = Math.round(subtotal - descuento);

  return { subtotal, descuento, totalFinal };
}

function inicializarTienda() {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();

      let nombre = boton.dataset.nombre;
      let precio = parseInt(boton.dataset.precio);

      if (!nombre || isNaN(precio)) {
        const contenedor = boton.closest(".card-body") || boton.closest("article");
        const titulo = contenedor ? contenedor.querySelector("h3, h2, h5") : null;
        nombre = titulo ? titulo.textContent.trim() : "Producto";
        precio = 2500;
      }

      const nuevoProducto = {
        id: Date.now() + Math.random(),
        nombre: nombre,
        precio: precio
      };

      const carritoActual = obtenerCarrito();
      carritoActual.push(nuevoProducto);
      guardarCarrito(carritoActual);

      alert(`¡${nombre} se ha añadido al carrito!`);
    });
  });
}

function inicializarFormularioContacto() {
  const contactForm = document.querySelector('#contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const mensajeInput = document.querySelector('#mensaje');

    const nombre = nombreInput ? nombreInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

    if (!nombre || !email || !mensaje) {
      contactForm.classList.add('was-validated');
      alert('Por favor, completa todos los campos antes de enviar tu consulta.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      contactForm.classList.add('was-validated');
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    alert(`¡Muchas gracias, ${nombre}! Tu consulta ha sido enviada con éxito. Te responderemos pronto a ${email}.`);
    contactForm.reset();
    contactForm.classList.remove('was-validated');
  });
}

function inicializarCarritoPage() {
  const contenedorCarrito = document.querySelector('#contenedor-carrito');
  if (!contenedorCarrito) return;

  renderizarCarritoPage();
  inicializarCupon();
  inicializarBotonIrAPagar();
}

function renderizarCarritoPage() {
  const contenedorCarrito = document.querySelector('#contenedor-carrito');
  const elementoSubtotal = document.querySelector('#subtotal-carrito');
  const elementoTotal = document.querySelector('#total-carrito');

  if (!contenedorCarrito) return;

  const carrito = obtenerCarrito();
  contenedorCarrito.innerHTML = '';

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
      <div class="alert alert-info text-center" role="alert">
        Tu carrito está vacío. <a href="index.html" class="alert-link">¡Volver a la tienda para agregar productos!</a>
      </div>
    `;
  } else {
    carrito.forEach((producto) => {
      const articulo = document.createElement('article');
      articulo.className = 'card shadow-sm mb-3 border-danger';
      articulo.innerHTML = `
        <div class="row g-0 align-items-center p-3">
          <div class="col-md-7">
            <div class="card-body py-0">
              <h3 class="card-title h5 mb-1">${producto.nombre}</h3>
              <p class="card-text text-muted mb-0">Precio: $${producto.precio.toLocaleString('es-CL')}</p>
            </div>
          </div>
          <div class="col-md-5 text-end">
            <strong class="me-3">$${producto.precio.toLocaleString('es-CL')}</strong>
            <button class="btn btn-sm btn-outline-danger btn-eliminar-item" data-id="${producto.id}">Eliminar</button>
          </div>
        </div>
      `;
      contenedorCarrito.appendChild(articulo);
    });

    const botonesEliminar = contenedorCarrito.querySelectorAll('.btn-eliminar-item');
    botonesEliminar.forEach((boton) => {
      boton.addEventListener('click', (e) => {
        const idAEliminar = parseFloat(e.target.dataset.id);
        let carritoActual = obtenerCarrito();
        carritoActual = carritoActual.filter((prod) => prod.id !== idAEliminar);
        guardarCarrito(carritoActual);
        renderizarCarritoPage();
      });
    });
  }

  const { subtotal, totalFinal } = calcularTotales();
  if (elementoSubtotal) elementoSubtotal.textContent = `$${subtotal.toLocaleString('es-CL')}`;
  if (elementoTotal) elementoTotal.textContent = `$${totalFinal.toLocaleString('es-CL')}`;
}

function inicializarCupon() {
  const cuponForm = document.querySelector('#cuponForm');
  if (!cuponForm) return;

  cuponForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputCupon = document.querySelector('#cupon');
    if (!inputCupon) return;

    const codigo = inputCupon.value.trim().toUpperCase();

    if (!codigo) {
      alert('Por favor, ingresa un código de descuento.');
      return;
    }

    if (codigo === 'DUOC2026') {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        alert('Añade productos al carrito antes de aplicar un descuento.');
        return;
      }

      if (obtenerDescuento() > 0) {
        alert('El código DUOC2026 ya ha sido aplicado.');
        return;
      }

      guardarDescuento(0.20);
      alert('¡Código DUOC2026 aplicado! Se ha aplicado un 20% de descuento.');
      renderizarCarritoPage();
    } else {
      alert('El código ingresado no es válido.');
    }
  });
}

function inicializarBotonIrAPagar() {
  const btnPagar = document.querySelector('#btn-pagar');
  if (!btnPagar) return;

  btnPagar.addEventListener('click', (e) => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      e.preventDefault();
      alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
    }
  });
}

function inicializarPagoPage() {
  const formularioPago = document.querySelector('#formularioPago');
  if (!formularioPago) return;

  const { totalFinal } = calcularTotales();

  if (obtenerCarrito().length === 0) {
    alert('No tienes productos en tu carrito. Redirigiendo a la tienda...');
    window.location.href = 'index.html';
    return;
  }

  const btnConfirmar = formularioPago.querySelector('button[type="submit"]');
  if (btnConfirmar) {
    btnConfirmar.textContent = `Confirmar Pago de $${totalFinal.toLocaleString('es-CL')}`;
  }

  formularioPago.addEventListener('submit', (e) => {
    e.preventDefault();

    const radioSeleccionado = formularioPago.querySelector('input[name="tipoTarjeta"]:checked');
    const errorTipoTarjeta = document.querySelector('#errorTipoTarjeta');

    if (!radioSeleccionado) {
      if (errorTipoTarjeta) errorTipoTarjeta.style.display = 'block';
      formularioPago.classList.add('was-validated');
      return;
    } else {
      if (errorTipoTarjeta) errorTipoTarjeta.style.display = 'none';
    }

    if (!formularioPago.checkValidity()) {
      e.stopPropagation();
      formularioPago.classList.add('was-validated');
      return;
    }

    alert(`¡Gracias por tu compra!\nTu pago por $${totalFinal.toLocaleString('es-CL')} ha sido procesado con éxito.`);

    localStorage.removeItem('carrito');
    guardarDescuento(0);

    window.location.href = 'index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarTienda();
  inicializarFormularioContacto();
  inicializarCarritoPage();
  inicializarPagoPage();
});