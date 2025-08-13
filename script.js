document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const getEl = (id) => document.getElementById(id);
    const querySel = (selector) => document.querySelector(selector);

    const num1Span = getEl('num1');
    const num2Span = getEl('num2');
    const operadorSpan = getEl('operador');
    const respuestaInput = getEl('respuesta');
    const mensajeDiv = getEl('mensaje');
    const feedbackIconSpan = getEl('feedbackIcon');
    const numberListDiv = getEl('numberList');
    const verificarBtn = getEl('verificarBtn');
    const borrarCanvasBtn = getEl('borrarCanvasBtn');
    const canvas = getEl('canvas');
    const scoreElement = getEl('score');
    const operationSelector = getEl('operationSelector');
    const opButtons = operationSelector.querySelectorAll('button');
    const dibujoArea = querySel('.dibujo');

    // --- Estado de la Aplicación ---
    let currentCorrectAnswer = 0;
    let correctAnswersCount = 0;
    let currentOperation = '+';
    let drawing = false;
    let ctx = null;

    // --- Lógica de Dibujo ---
    const setupCanvas = () => {
        if (canvas && typeof canvas.getContext === 'function') {
            ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#333';
        } else {
            console.warn('Canvas no soportado o no encontrado.');
        }
    };

    const getCoords = (event) => {
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = event.touches?.[0]?.clientX ?? event.clientX;
        const clientY = event.touches?.[0]?.clientY ?? event.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const startDrawing = (event) => {
        if (!ctx) return;
        if (event.cancelable) event.preventDefault();
        drawing = true;
        const { x, y } = getCoords(event);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const stopDrawing = (event) => {
        if (event?.cancelable) event.preventDefault();
        drawing = false;
    };

    const draw = (event) => {
        if (!drawing || !ctx) return;
        if (event.cancelable) event.preventDefault();
        const { x, y } = getCoords(event);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const borrarCanvas = () => {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // --- Lógica del Juego ---
    const generarProblema = () => {
        let num1, num2;
        const maxAddSub = 20;
        const maxMul = 12;
        const maxDivResult = 10;
        const maxDivisor = 10;

        switch (currentOperation) {
            case '+':
                num1 = Math.floor(Math.random() * (maxAddSub + 1));
                num2 = Math.floor(Math.random() * (maxAddSub + 1));
                break;
            case '-':
                num1 = Math.floor(Math.random() * (maxAddSub + 1));
                num2 = Math.floor(Math.random() * (num1 + 1));
                break;
            case '*':
                num1 = Math.floor(Math.random() * (maxMul + 1));
                num2 = Math.floor(Math.random() * (maxMul + 1));
                break;
            case '/':
                const result = Math.max(1, Math.floor(Math.random() * maxDivResult));
                num2 = Math.max(1, Math.floor(Math.random() * maxDivisor));
                num1 = result * num2;
                break;
        }

        currentCorrectAnswer = eval(`${num1} ${currentOperation} ${num2}`);
        num1Span.textContent = num1;
        num2Span.textContent = num2;
        operadorSpan.textContent = currentOperation === '*' ? '×' : currentOperation;
        
        resetInput();
    };

    const resetInput = () => {
        respuestaInput.value = '';
        respuestaInput.classList.remove('correct-input', 'incorrect-input');
        mensajeDiv.textContent = '';
        feedbackIconSpan.textContent = '';
    };

    const verificar = () => {
        const respuestaUsuario = parseInt(respuestaInput.value, 10);

        if (isNaN(respuestaUsuario)) {
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
            setTimeout(generarProblema, 1200);
        } else {
            mensajeDiv.textContent = '¡Uy! Intenta de nuevo.';
            feedbackIconSpan.textContent = '❌';
            respuestaInput.classList.add('incorrect-input');
        }
    };

    const actualizarScore = () => {
        scoreElement.textContent = `Puntuación: ${correctAnswersCount}`;
    };

    const selectOperation = (selectedButton) => {
        currentOperation = selectedButton.dataset.op;
        opButtons.forEach(btn => btn.classList.remove('active-op'));
        selectedButton.classList.add('active-op');
        generarProblema();
    };

    const crearTeclado = () => {
        numberListDiv.innerHTML = ''; // Limpiar teclado existente
        for (let i = 0; i <= 9; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            span.addEventListener('click', () => appendToResponse(i));
            numberListDiv.appendChild(span);
        }
        const backspaceSpan = document.createElement('span');
        backspaceSpan.innerHTML = '&#9003;';
        backspaceSpan.classList.add('backspace-btn');
        backspaceSpan.addEventListener('click', backspace);
        numberListDiv.appendChild(backspaceSpan);
    };

    const appendToResponse = (number) => {
        if (respuestaInput.classList.contains('correct-input')) return;
        respuestaInput.value += number;
        respuestaInput.classList.remove('incorrect-input');
    };

    const backspace = () => {
        respuestaInput.value = respuestaInput.value.slice(0, -1);
        respuestaInput.classList.remove('incorrect-input', 'correct-input');
    };

    // --- Responsividad y Event Listeners ---
    const handleResize = () => {
        const esEscritorio = window.matchMedia('(min-width: 1024px)').matches;
        if (esEscritorio) {
            dibujoArea.style.display = 'flex';
            if (!ctx) setupCanvas(); // Inicializar canvas solo si es necesario
        } else {
            dibujoArea.style.display = 'none';
        }
    };

    const setupEventListeners = () => {
        verificarBtn.addEventListener('click', verificar);
        borrarCanvasBtn.addEventListener('click', borrarCanvas);

        opButtons.forEach(button => {
            button.addEventListener('click', () => selectOperation(button));
        });

        // Permitir verificar con la tecla Enter
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                verificar();
            }
        });

        // Listeners para el canvas (puntero para unificar ratón y táctil)
        if (canvas) {
            canvas.addEventListener('pointerdown', startDrawing);
            canvas.addEventListener('pointerup', stopDrawing);
            canvas.addEventListener('pointermove', draw);
            canvas.addEventListener('pointerleave', stopDrawing);
            canvas.addEventListener('pointercancel', stopDrawing);
        }

        window.addEventListener('resize', handleResize);
    };

    // --- Inicialización ---
    const init = () => {
        if (!num1Span || !respuestaInput || !numberListDiv || !scoreElement) {
            console.error("Error: Faltan elementos esenciales del DOM. La aplicación no puede iniciarse.");
            document.body.innerHTML = "<p>Error al cargar la aplicación. Por favor, recarga la página.</p>";
            return;
        }
        
        crearTeclado();
        setupEventListeners();
        handleResize(); // Comprobar tamaño de pantalla al cargar
        generarProblema();
        actualizarScore();
    };

    init();
});