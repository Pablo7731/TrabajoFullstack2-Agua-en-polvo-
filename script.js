document.addEventListener('DOMContentLoaded', () => {

    const esNombreValido = (nombre) => {
        const regexNombre = /^[a-zA-ZÀ-ÿ\s]+$/;
        return regexNombre.test(nombre);
    };

    const esEmailValido = (email) => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+(\.[a-zA-Z]+)*\.(com|cl|net|org|edu|es|gov|[a-zA-Z]{2,})$/i;
        return regexEmail.test(email);
    };

    const esPasswordValida = (password) => {
        return password.length >= 14;
    };

    const esTarjetaValida = (numero) => {
        const regexTarjeta = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        return regexTarjeta.test(numero);
    };

    const esFechaValida = (fecha) => {
        const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return regexFecha.test(fecha);
    };

    const esCvvValido = (cvv) => {
        const regexCvv = /^\d{3}$/;
        return regexCvv.test(cvv);
    };

    const camposNombre = [
        document.getElementById('nombre'),
        document.getElementById('registroNombre'),
        document.getElementById('nombreTitular'),
        document.getElementById('nombreTarjeta'),
        document.getElementById('nombreEspecial')
    ];

    camposNombre.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[0-9]/g, '');
            });
        }
    });

    const inputNumeroTarjeta = document.getElementById('numeroTarjeta');
    const inputFechaExpiracion = document.getElementById('expiracionTarjeta');
    const inputCvv = document.getElementById('cvvTarjeta');

    if (inputNumeroTarjeta) {
        inputNumeroTarjeta.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.substring(0, 16);
            let bloques = valor.match(/.{1,4}/g);
            e.target.value = bloques ? bloques.join('-') : '';
        });
    }

    if (inputFechaExpiracion) {
        inputFechaExpiracion.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.substring(0, 4);
            if (valor.length > 2) {
                e.target.value = `${valor.substring(0, 2)}/${valor.substring(2)}`;
            } else {
                e.target.value = valor;
            }
        });
    }

    if (inputCvv) {
        inputCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    const formRegistro = document.getElementById('formRegistro');
    const formLogin = document.getElementById('formLogin');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombreInput = document.getElementById('registroNombre');
            const emailInput = document.getElementById('registroEmail');
            const passwordInput = document.getElementById('registroPassword');

            const nombre = nombreInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!nombre || !email || !password) {
                alert('Por favor, completa todos los campos para registrarte.');
                return;
            }

            if (!esNombreValido(nombre)) {
                alert('El nombre solo puede contener letras y espacios (sin números).');
                nombreInput.classList.add('is-invalid');
                return;
            } else {
                nombreInput.classList.remove('is-invalid');
            }

            if (!esEmailValido(email)) {
                alert('Por favor, ingresa un correo electrónico válido (el dominio después del @ no puede contener números).');
                emailInput.classList.add('is-invalid');
                return;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            if (!esPasswordValida(password)) {
                alert('La contraseña es demasiado corta. Debe tener al menos 14 caracteres por seguridad.');
                passwordInput.classList.add('is-invalid');
                return;
            } else {
                passwordInput.classList.remove('is-invalid');
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());

            if (usuarioExiste) {
                alert('Este correo electrónico ya está registrado.');
                emailInput.classList.add('is-invalid');
                return;
            }

            usuarios.push({ nombre, email, password });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('¡Usuario creado con éxito! Ahora puedes iniciar sesión.');
            formRegistro.reset();
            nombreInput.classList.remove('is-invalid');
            emailInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                alert('Por favor, ingresa tu correo y contraseña.');
                return;
            }

            if (!esEmailValido(email)) {
                alert('Ingresa un correo electrónico válido.');
                emailInput.classList.add('is-invalid');
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioEncontrado = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (!usuarioEncontrado) {
                alert('Error: El usuario no existe o las credenciales son incorrectas.');
                emailInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
                return;
            }

            sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
            alert(`¡Bienvenido/a, ${usuarioEncontrado.nombre}!`);
            window.location.href = 'index.html';
        });
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const guardarCarrito = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseInt(boton.getAttribute('data-precio'));
            const img = boton.getAttribute('data-img');

            const itemExistente = carrito.find(prod => prod.nombre === nombre);

            if (itemExistente) {
                itemExistente.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, img, cantidad: 1 });
            }

            guardarCarrito();
            alert(`"${nombre}" fue añadido al carrito.`);
        });
    });

    const contenedorCarrito = document.getElementById('contenedor-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    const renderizarCarrito = () => {
        if (!contenedorCarrito) return;

        contenedorCarrito.innerHTML = '';

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
            if (subtotalCarrito) subtotalCarrito.textContent = '$0';
            if (totalCarrito) totalCarrito.textContent = '$0';
            return;
        }

        let totalCalculado = 0;

        carrito.forEach((prod, index) => {
            const subtotalItem = prod.precio * prod.cantidad;
            totalCalculado += subtotalItem;

            const card = document.createElement('article');
            card.className = 'card mb-3 shadow-sm';
            card.innerHTML = `
                <div class="row g-0 align-items-center">
                    <div class="col-md-3 text-center p-2">
                        <img src="${prod.img}" class="img-fluid rounded" alt="${prod.nombre}" style="max-height: 100px; object-fit: contain;">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title">${prod.nombre}</h5>
                            <p class="card-text mb-1">Precio: $${prod.precio.toLocaleString('es-CL')}</p>
                            <p class="card-text"><small class="text-muted">Cantidad: ${prod.cantidad}</small></p>
                        </div>
                    </div>
                    <div class="col-md-3 text-end p-3">
                        <p class="fw-bold mb-2">$${subtotalItem.toLocaleString('es-CL')}</p>
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            contenedorCarrito.appendChild(card);
        });

        if (subtotalCarrito) subtotalCarrito.textContent = `$${totalCalculado.toLocaleString('es-CL')}`;
        if (totalCarrito) totalCarrito.textContent = `$${totalCalculado.toLocaleString('es-CL')}`;
        localStorage.setItem('totalFinalPagar', totalCalculado);
    };

    window.eliminarDelCarrito = (index) => {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        guardarCarrito();
        renderizarCarrito();
    };

    renderizarCarrito();

    const btnProcederPago = document.getElementById('btn-pagar') || document.getElementById('btnProcederPago') || document.querySelector('.btn-proceder-pago');
    
    if (btnProcederPago) {
        btnProcederPago.addEventListener('click', (e) => {
            if (carrito.length === 0) {
                e.preventDefault();
                alert('Tu carrito está vacío. Agrega al menos un producto antes de proceder al pago.');
            }
        });
    }

    const cuponForm = document.getElementById('cuponForm');
    if (cuponForm) {
        cuponForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cuponInput = document.getElementById('cupon').value.trim();
            if (cuponInput.toUpperCase() === 'DUOC2026') {
                let subtotalNum = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
                let descuento = subtotalNum * 0.20;
                let totalConDescuento = subtotalNum - descuento;
                if (totalCarrito) totalCarrito.textContent = `$${totalConDescuento.toLocaleString('es-CL')} (20% Desc.)`;
                
                // Actualizar el monto en localStorage con el descuento aplicado
                localStorage.setItem('totalFinalPagar', totalConDescuento);
                
                alert('¡Cupón aplicado con éxito! Tienes un 20% de descuento.');
            } else {
                alert('Código de cupón no válido.');
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const inputNombreContacto = document.getElementById('nombre');
            const emailContacto = contactForm.querySelector('input[type="email"]');

            if (inputNombreContacto) {
                const nombreValor = inputNombreContacto.value.trim();
                if (!nombreValor || !esNombreValido(nombreValor)) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('El nombre solo puede contener letras y espacios (sin números).');
                    inputNombreContacto.classList.add('is-invalid');
                    contactForm.classList.add('was-validated');
                    return;
                } else {
                    inputNombreContacto.classList.remove('is-invalid');
                }
            }
            
            if (emailContacto && !esEmailValido(emailContacto.value.trim())) {
                e.preventDefault();
                e.stopPropagation();
                alert('Por favor, ingresa un correo electrónico válido (el dominio no debe contener números).');
                emailContacto.classList.add('is-invalid');
                contactForm.classList.add('was-validated');
                return;
            } else if (emailContacto) {
                emailContacto.classList.remove('is-invalid');
            }

            if (!contactForm.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();
                alert('¡Gracias por tu mensaje! Te responderemos a la brevedad.');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                if (inputNombreContacto) inputNombreContacto.classList.remove('is-invalid');
                if (emailContacto) emailContacto.classList.remove('is-invalid');
                return;
            }
            contactForm.classList.add('was-validated');
        });
    }

    const formularioPago = document.getElementById('formularioPago');
    
    if (formularioPago) {
        // --- NUEVO: Actualizar el monto en el botón de pago al cargar la página ---
        const botonConfirmar = formularioPago.querySelector('button[type="submit"]');
        if (botonConfirmar) {
            // Recuperar el total (ya sea con o sin descuento) desde el localStorage
            let totalAPagar = localStorage.getItem('totalFinalPagar') || 0;
            // Escribir el total en el botón, dándole el formato de moneda chilena
            botonConfirmar.textContent = `Confirmar Pago de $${parseInt(totalAPagar).toLocaleString('es-CL')}`;
        }
        // --------------------------------------------------------------------------

        formularioPago.addEventListener('submit', (e) => {
            e.preventDefault();

            if (carrito.length === 0) {
                alert('Tu carrito está vacío. Debes agregar productos antes de realizar el pago.');
                return;
            }

            const tarjetaCredito = document.getElementById('tarjetaCredito');
            const tarjetaDebito = document.getElementById('tarjetaDebito');
            const errorTipoTarjeta = document.getElementById('errorTipoTarjeta');
            const inputNombreTitular = document.getElementById('nombreTitular') || document.getElementById('nombreTarjeta');

            let tarjetaSeleccionada = (tarjetaCredito && tarjetaCredito.checked) || (tarjetaDebito && tarjetaDebito.checked);

            if (!tarjetaSeleccionada) {
                if (errorTipoTarjeta) errorTipoTarjeta.style.display = 'block';
            } else {
                if (errorTipoTarjeta) errorTipoTarjeta.style.display = 'none';
            }

            if (inputNombreTitular) {
                if (!esNombreValido(inputNombreTitular.value.trim())) {
                    alert('El nombre del titular solo puede contener letras y espacios.');
                    inputNombreTitular.classList.add('is-invalid');
                    return;
                } else {
                    inputNombreTitular.classList.remove('is-invalid');
                }
            }

            if (inputNumeroTarjeta && !esTarjetaValida(inputNumeroTarjeta.value.trim())) {
                alert('El número de tarjeta debe tener 16 dígitos (Ej: 1111-2222-3333-4444).');
                inputNumeroTarjeta.classList.add('is-invalid');
                return;
            } else if (inputNumeroTarjeta) {
                inputNumeroTarjeta.classList.remove('is-invalid');
            }

            if (inputFechaExpiracion && !esFechaValida(inputFechaExpiracion.value.trim())) {
                alert('La fecha de expiración debe tener el formato MM/AA (Ej: 11/26).');
                inputFechaExpiracion.classList.add('is-invalid');
                return;
            } else if (inputFechaExpiracion) {
                inputFechaExpiracion.classList.remove('is-invalid');
            }

            if (inputCvv && !esCvvValido(inputCvv.value.trim())) {
                alert('El código de seguridad (CVV) debe contener exactamente 3 números.');
                inputCvv.classList.add('is-invalid');
                return;
            } else if (inputCvv) {
                inputCvv.classList.remove('is-invalid');
            }

            if (!formularioPago.checkValidity() || !tarjetaSeleccionada) {
                e.stopPropagation();
                formularioPago.classList.add('was-validated');
            } else {
                alert('¡Pago realizado con éxito! Gracias por tu compra.');
                
                // --- NUEVO: Limpiamos carrito y total para futuras compras ---
                localStorage.removeItem('carrito');
                localStorage.removeItem('totalFinalPagar');
                
                window.location.href = 'index.html';
            }
        });
    }

    const formPedidoEspecial = document.getElementById('formPedidoEspecial') || 
                               document.getElementById('pedidoEspecialForm') || 
                               document.getElementById('formPedidosEspeciales');

    if (formPedidoEspecial) {
        formPedidoEspecial.addEventListener('submit', (e) => {
            const inputNombreEspecial = document.getElementById('nombreEspecial') || 
                                        document.getElementById('nombrePedidoEspecial') || 
                                        document.getElementById('nombreCompletoEspecial') ||
                                        formPedidoEspecial.querySelector('input[type="text"]');

            const emailEspecial = formPedidoEspecial.querySelector('input[type="email"]');

            if (inputNombreEspecial) {
                const nombreEspecial = inputNombreEspecial.value.trim();
                if (!nombreEspecial || !esNombreValido(nombreEspecial)) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('El nombre completo en el pedido especial solo puede contener letras y espacios.');
                    inputNombreEspecial.classList.add('is-invalid');
                    formPedidoEspecial.classList.add('was-validated');
                    return;
                } else {
                    inputNombreEspecial.classList.remove('is-invalid');
                }
            }

            if (emailEspecial && !esEmailValido(emailEspecial.value.trim())) {
                e.preventDefault();
                e.stopPropagation();
                alert('Por favor, ingresa un correo electrónico válido para el pedido.');
                emailEspecial.classList.add('is-invalid');
                formPedidoEspecial.classList.add('was-validated');
                return;
            } else if (emailEspecial) {
                emailEspecial.classList.remove('is-invalid');
            }

            if (!formPedidoEspecial.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.preventDefault();
                alert('¡Tu pedido especial ha sido enviado con éxito! Nos pondremos en contacto contigo.');
                formPedidoEspecial.reset();
                formPedidoEspecial.classList.remove('was-validated');
                return;
            }
            formPedidoEspecial.classList.add('was-validated');
        });
    }

});