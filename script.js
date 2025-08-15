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
    let timer = null;
    let timeLeft = 30; // 30 segundos por problema
    let difficulty = 'easy'; // easy, medium, hard
    let gameMode = 'practice'; // practice, timed
    let highScore = localStorage.getItem('mathHighScore') || 0;

    // --- Configuración de Dificultad ---
    const difficultyConfig = {
        easy: {
            maxAddSub: 20,
            maxMul: 12,
            maxDivResult: 10,
            maxDivisor: 10,
            timeLimit: 45
        },
        medium: {
            maxAddSub: 50,
            maxMul: 20,
            maxDivResult: 20,
            maxDivisor: 15,
            timeLimit: 30
        },
        hard: {
            maxAddSub: 100,
            maxMul: 25,
            maxDivResult: 50,
            maxDivisor: 25,
            timeLimit: 20
        }
    };

    // --- Sistema de Sonidos ---
    const playSound = (type) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'correct') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            } else if (type === 'incorrect') {
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
            }
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Audio no soportado en este navegador');
        }
    };

    // --- Sistema de Timer ---
    const startTimer = () => {
        if (gameMode !== 'timed') return;
        
        timeLeft = difficultyConfig[difficulty].timeLimit;
        updateTimerDisplay();
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    };

    const updateTimerDisplay = () => {
        const timerElement = getEl('timer');
        if (timerElement) {
            timerElement.textContent = `Tiempo: ${timeLeft}s`;
            timerElement.className = timeLeft <= 5 ? 'timer-warning' : 'timer';
        }
    };

    const timeUp = () => {
        mensajeDiv.textContent = '¡Se acabó el tiempo!';
        feedbackIconSpan.textContent = '⏰';
        respuestaInput.classList.add('incorrect-input');
        playSound('incorrect');
        
        setTimeout(() => {
            generarProblema();
        }, 2000);
    };

    const stopTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

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
        stopTimer();
        
        let num1, num2;
        const config = difficultyConfig[difficulty];

        switch (currentOperation) {
            case '+':
                num1 = Math.floor(Math.random() * (config.maxAddSub + 1));
                num2 = Math.floor(Math.random() * (config.maxAddSub + 1));
                break;
            case '-':
                num1 = Math.floor(Math.random() * (config.maxAddSub + 1));
                num2 = Math.floor(Math.random() * (num1 + 1));
                break;
            case '*':
                num1 = Math.floor(Math.random() * (config.maxMul + 1));
                num2 = Math.floor(Math.random() * (config.maxMul + 1));
                break;
            case '/':
                const result = Math.max(1, Math.floor(Math.random() * config.maxDivResult));
                num2 = Math.max(1, Math.floor(Math.random() * config.maxDivisor));
                num1 = result * num2;
                break;
        }

        currentCorrectAnswer = eval(`${num1} ${currentOperation} ${num2}`);
        num1Span.textContent = num1;
        num2Span.textContent = num2;
        operadorSpan.textContent = currentOperation === '*' ? '×' : currentOperation;
        
        resetInput();
        startTimer();
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
            stopTimer();
            mensajeDiv.textContent = '¡Correcto!';
            feedbackIconSpan.textContent = '👍';
            respuestaInput.classList.add('correct-input');
            correctAnswersCount++;
            actualizarScore();
            playSound('correct');
            
            // Actualizar high score
            if (correctAnswersCount > highScore) {
                highScore = correctAnswersCount;
                localStorage.setItem('mathHighScore', highScore);
                actualizarHighScore();
            }
            
            setTimeout(generarProblema, 1200);
        } else {
            mensajeDiv.textContent = '¡Uy! Intenta de nuevo.';
            feedbackIconSpan.textContent = '❌';
            respuestaInput.classList.add('incorrect-input');
            playSound('incorrect');
        }
    };

    const actualizarScore = () => {
        scoreElement.textContent = `Puntuación: ${correctAnswersCount}`;
    };

    const actualizarHighScore = () => {
        const highScoreElement = getEl('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = `Mejor: ${highScore}`;
        }
    };

    const selectOperation = (selectedButton) => {
        currentOperation = selectedButton.dataset.op;
        opButtons.forEach(btn => btn.classList.remove('active-op'));
        selectedButton.classList.add('active-op');
        generarProblema();
    };

    const cambiarDificultad = (newDifficulty) => {
        difficulty = newDifficulty;
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(btn => {
            btn.classList.remove('active-difficulty');
            if (btn.dataset.difficulty === newDifficulty) {
                btn.classList.add('active-difficulty');
            }
        });
        generarProblema();
    };

    const cambiarModo = (newMode) => {
        gameMode = newMode;
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.classList.remove('active-mode');
            if (btn.dataset.mode === newMode) {
                btn.classList.add('active-mode');
            }
        });
        generarProblema();
    };

    const crearTeclado = () => {
        numberListDiv.innerHTML = ''; // Limpiar teclado existente
        for (let i = 0; i <= 9; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            span.setAttribute('tabindex', '0');
            span.setAttribute('role', 'button');
            span.setAttribute('aria-label', `Número ${i}`);
            span.addEventListener('click', () => appendToResponse(i));
            span.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    appendToResponse(i);
                }
            });
            numberListDiv.appendChild(span);
        }
        const backspaceSpan = document.createElement('span');
        backspaceSpan.innerHTML = '&#9003;';
        backspaceSpan.classList.add('backspace-btn');
        backspaceSpan.setAttribute('tabindex', '0');
        backspaceSpan.setAttribute('role', 'button');
        backspaceSpan.setAttribute('aria-label', 'Borrar');
        backspaceSpan.addEventListener('click', backspace);
        backspaceSpan.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                backspace();
            }
        });
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

        // Event listeners para modo de juego
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => cambiarModo(button.dataset.mode));
        });

        // Event listeners para dificultad
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => cambiarDificultad(button.dataset.difficulty));
        });

        // Permitir verificar con la tecla Enter
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                verificar();
            }
            
            // Números del teclado físico
            if (event.key >= '0' && event.key <= '9') {
                appendToResponse(parseInt(event.key));
            }
            
            // Backspace
            if (event.key === 'Backspace') {
                backspace();
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
        actualizarHighScore();
    };

    init();
});