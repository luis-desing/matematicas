        // --- El código JavaScript permanece EXACTAMENTE IGUAL que en la versión anterior ---
        // --- (Variables, funciones: generarProblema, verificar, crearListaNumeros, dibujo, setupEventListeners, etc.) ---

        // --- Variables Globales y Elementos del DOM ---
        const num1Span = document.getElementById('num1');
        const num2Span = document.getElementById('num2');
        const operadorSpan = document.getElementById('operador');
        const respuestaInput = document.getElementById('respuesta');
        const mensajeDiv = document.getElementById('mensaje');
        const feedbackIconSpan = document.getElementById('feedbackIcon');
        const opcionesDiv = document.getElementById('opciones');
        const opcionesListDiv = document.getElementById('opcionesList');
        const numberListDiv = document.getElementById('numberList');
        const verificarBtn = document.getElementById('verificarBtn');
        const borrarCanvasBtn = document.getElementById('borrarCanvasBtn');
        const canvas = document.getElementById('canvas');
        // Añadir chequeo por si canvas no existe o no soporta 2d
        const ctx = canvas?.getContext('2d');
        const scoreElement = document.getElementById('score');
        const operationSelectorDiv = document.getElementById('operationSelector');
        const opButtons = operationSelectorDiv.querySelectorAll('button');

        let currentCorrectAnswer = 0;
        let drawing = false;
        let correctAnswersCount = 0;
        let currentOperation = '+';

        // --- Funciones Principales ---
        function generarProblema() {
             let num1, num2;
             const maxAddSub = 20;
             const maxMul = 12;
             const maxDivResult = 10;
             const maxDivisor = 10;

             switch (currentOperation) {
                 case '+':
                     num1 = Math.floor(Math.random() * (maxAddSub + 1));
                     num2 = Math.floor(Math.random() * (maxAddSub + 1));
                     currentCorrectAnswer = num1 + num2;
                     operadorSpan.textContent = '+';
                     break;
                 case '-':
                     num1 = Math.floor(Math.random() * (maxAddSub + 1));
                     num2 = Math.floor(Math.random() * (num1 + 1)); // num2 <= num1
                     currentCorrectAnswer = num1 - num2;
                     operadorSpan.textContent = '-';
                     break;
                 case '*':
                     num1 = Math.floor(Math.random() * (maxMul + 1));
                     num2 = Math.floor(Math.random() * (maxMul + 1));
                     currentCorrectAnswer = num1 * num2;
                     operadorSpan.textContent = '×';
                     break;
                 case '/':
                     const result = Math.max(1, Math.floor(Math.random() * (maxDivResult + 1))); // Resultado al menos 1
                     num2 = Math.max(1, Math.floor(Math.random() * maxDivisor)); // Divisor al menos 1
                     num1 = result * num2;
                     currentCorrectAnswer = result;
                     operadorSpan.textContent = '÷';
                     break;
             }

             num1Span.textContent = num1;
             num2Span.textContent = num2;
             respuestaInput.value = '';
             respuestaInput.classList.remove('correct-input', 'incorrect-input');
             // Evitar error si respuestaInput no existe
             respuestaInput?.focus();
             mensajeDiv.textContent = '';
             feedbackIconSpan.textContent = '';
             opcionesDiv.style.display = 'none';
         }

        function verificar() {
             // Comprobar si respuestaInput existe
             if (!respuestaInput) return;

             const respuestaTexto = respuestaInput.value;
             const respuestaUsuario = parseInt(respuestaTexto);

             respuestaInput.classList.remove('correct-input', 'incorrect-input');

             if (respuestaTexto.trim() === '' || isNaN(respuestaUsuario)) {
                  mensajeDiv.textContent = 'Escribe un número.';
                  feedbackIconSpan.textContent = '❓';
                  return;
             }

             if (respuestaUsuario === currentCorrectAnswer) {
                 mensajeDiv.textContent = '¡Correcto!';
                 feedbackIconSpan.textContent = '👍';
                 respuestaInput.classList.add('correct-input');
                 correctAnswersCount++;
                 actualizarScore();
                 setTimeout(generarProblema, 1500);
             } else {
                 mensajeDiv.textContent = '¡Uy! Intenta de nuevo.';
                 feedbackIconSpan.textContent = '❌';
                 respuestaInput.classList.add('incorrect-input');
             }
         }

        function actualizarScore() {
             if (scoreElement) {
                scoreElement.textContent = `Puntuación: ${correctAnswersCount}`;
             }
         }

        function selectOperation(selectedButton) {
              currentOperation = selectedButton.dataset.op;
              opButtons.forEach(btn => btn.classList.remove('active-op'));
              selectedButton.classList.add('active-op');
              generarProblema();
         }

        function crearListaNumeros() {
            if (!numberListDiv || !respuestaInput) return; // Salir si no existen

            numberListDiv.innerHTML = '';
            for (let i = 0; i <= 9; i++) {
                const span = document.createElement('span');
                span.textContent = i;
                span.draggable = true;

                span.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', i.toString());
                    event.dataTransfer.effectAllowed = "copy";
                });

                span.addEventListener('click', () => {
                    respuestaInput.value += i;
                    respuestaInput.focus();
                    respuestaInput.classList.remove('correct-input', 'incorrect-input');
                });

                numberListDiv.appendChild(span);
            }
            const backspaceSpan = document.createElement('span');
            backspaceSpan.innerHTML = '&#9003;';
            backspaceSpan.classList.add('backspace-btn');
            backspaceSpan.addEventListener('click', () => {
                respuestaInput.value = respuestaInput.value.slice(0, -1);
                respuestaInput.focus();
            });
            numberListDiv.appendChild(backspaceSpan);
        }


        // --- Funciones de Dibujo ---
        function borrarCanvas() {
            // Comprobar si ctx existe
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        function getCoords(event) {
            if (!canvas) return { x: 0, y: 0 }; // Devolver 0 si no hay canvas
            const rect = canvas.getBoundingClientRect();
            let clientX, clientY;
            if (event.touches && event.touches.length > 0) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }
            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);
            return { x, y };
        }


        function startDrawing(event) {
            if (!ctx) return; // Salir si no hay contexto
            if (event.cancelable) event.preventDefault();
            drawing = true;
            const { x, y } = getCoords(event);
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function stopDrawing(event) {
            if (event.cancelable) event.preventDefault();
            if (drawing) {
                drawing = false;
            }
        }

        function draw(event) {
            if (!drawing || !ctx) return; // Salir si no se está dibujando o no hay contexto
            if (event.cancelable) event.preventDefault();

            const { x, y } = getCoords(event);

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#333';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }


         // --- Configuración de Event Listeners ---
         function setupEventListeners() {
            // Comprobar existencia de elementos antes de añadir listeners
            verificarBtn?.addEventListener('click', verificar);
            borrarCanvasBtn?.addEventListener('click', borrarCanvas);
            opButtons?.forEach(button => {
                button.addEventListener('click', () => selectOperation(button));
            });

            if (respuestaInput) {
                respuestaInput.addEventListener('dragover', (event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "copy";
                });
                respuestaInput.addEventListener('drop', (event) => {
                    event.preventDefault();
                    const numero = event.dataTransfer.getData('text/plain');
                    if (!isNaN(numero) && numero !== null && numero.trim() !== '') {
                        respuestaInput.value += numero;
                        respuestaInput.classList.remove('correct-input', 'incorrect-input');
                    }
                });
                respuestaInput.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        verificar();
                    }
                });
            }

            if (canvas) {
                canvas.addEventListener('pointerdown', startDrawing);
                canvas.addEventListener('pointerup', stopDrawing);
                canvas.addEventListener('pointermove', draw);
                canvas.addEventListener('pointerleave', stopDrawing);
                canvas.addEventListener('pointercancel', stopDrawing);
            }
         }


        // --- Inicialización ---
        window.onload = () => {
            // Comprobar si los elementos esenciales existen antes de proceder
             if (!document.getElementById('opSum') || !numberListDiv || !scoreElement || !canvas || !ctx) {
                console.error("Error: No se encontraron algunos elementos esenciales del DOM. La aplicación no puede inicializarse correctamente.");
                // Opcionalmente, mostrar un mensaje al usuario en el HTML
                // document.body.innerHTML = "<p>Error al cargar la aplicación. Faltan componentes.</p>";
                return; // Detener la ejecución si falta algo crítico
            }

            setupEventListeners();
            document.getElementById('opSum').classList.add('active-op');
            crearListaNumeros();
            generarProblema();
            actualizarScore();
        };
