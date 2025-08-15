# Pizarra Mágica de Mates

Una aplicación web educativa e interactiva para que los niños practiquen operaciones matemáticas básicas (suma, resta, multiplicación y división) de una forma divertida y desafiante.

## 🎯 Características

### Operaciones Matemáticas
- **Operaciones básicas**: Suma, resta, multiplicación y división
- **Diferentes niveles de dificultad**: Fácil, Medio y Difícil
- **Números adaptativos**: Los rangos de números se ajustan según la dificultad seleccionada

### Modos de Juego
- **Modo Práctica**: Sin límite de tiempo, ideal para aprender
- **Modo Contra Reloj**: Con temporizador, para añadir emoción y desafío

### Interfaz de Usuario
- **Teclado numérico en pantalla**: Facilita la introducción de respuestas en dispositivos táctiles
- **Soporte para teclado físico**: También puedes usar las teclas numéricas de tu teclado
- **Área de dibujo**: Un lienzo para resolver problemas visualmente (disponible en pantallas grandes)
- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla, optimizado para móviles y ordenadores de sobremesa

### Feedback y Progreso
- **Feedback instantáneo**: Muestra si la respuesta es correcta o incorrecta al instante
- **Efectos de sonido**: Feedback auditivo para respuestas correctas e incorrectas
- **Puntuación en tiempo real**: Lleva la cuenta de las respuestas correctas
- **Récord personal**: Guarda tu mejor puntuación en el navegador
- **Temporizador visual**: En modo contra reloj, muestra el tiempo restante con alertas visuales

### Accesibilidad
- **Navegación por teclado**: Todos los elementos son accesibles mediante teclado
- **Etiquetas ARIA**: Mejora la experiencia para usuarios con lectores de pantalla
- **Contraste optimizado**: Colores que cumplen con estándares de accesibilidad

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, diseño responsivo, animaciones y transiciones
- **JavaScript (ES6+)**: Lógica del juego, manejo de eventos, Web Audio API
- **Web Storage API**: Para guardar récords personales

## 🎮 Cómo utilizarlo

### Configuración Inicial
1. Abre el archivo `index.html` en tu navegador web
2. Selecciona el modo de juego: **Práctica** o **Contra Reloj**
3. Elige el nivel de dificultad: **Fácil**, **Medio** o **Difícil**

### Jugando
1. Selecciona una operación (+, -, ×, ÷)
2. Introduce la respuesta utilizando:
   - El teclado numérico en pantalla
   - Las teclas numéricas de tu teclado físico
3. Pulsa el botón "Verificar" o presiona Enter
4. En pantallas grandes, utiliza el área de dibujo para ayudarte a resolver el problema

### Niveles de Dificultad

#### Fácil
- Sumas y restas: números del 0 al 20
- Multiplicaciones: números del 0 al 12
- Divisiones: resultados del 1 al 10
- Tiempo límite: 45 segundos (modo contra reloj)

#### Medio
- Sumas y restas: números del 0 al 50
- Multiplicaciones: números del 0 al 20
- Divisiones: resultados del 1 al 20
- Tiempo límite: 30 segundos (modo contra reloj)

#### Difícil
- Sumas y restas: números del 0 al 100
- Multiplicaciones: números del 0 al 25
- Divisiones: resultados del 1 al 50
- Tiempo límite: 20 segundos (modo contra reloj)

## 🚀 Mejoras Implementadas

### Funcionalidad
- **Sistema de dificultad**: Tres niveles con rangos de números adaptativos
- **Modo contra reloj**: Añade emoción y desafío temporal
- **Efectos de sonido**: Feedback auditivo usando Web Audio API
- **Récord personal**: Persistencia de la mejor puntuación
- **Soporte para teclado físico**: Navegación completa por teclado

### Experiencia de Usuario
- **Interfaz mejorada**: Nuevos selectores de modo y dificultad
- **Animaciones**: Efectos visuales para el temporizador y botones
- **Responsividad**: Mejor adaptación a dispositivos móviles pequeños
- **Accesibilidad**: Navegación por teclado y etiquetas ARIA

### Código
- **Modularización**: Mejor organización del código JavaScript
- **Manejo de errores**: Validaciones y fallbacks mejorados
- **Performance**: Optimización del canvas y eventos
- **Compatibilidad**: Soporte para diferentes navegadores

## 📱 Compatibilidad

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Móviles, tablets y ordenadores de sobremesa
- **Funcionalidades**: Touch, ratón y teclado
- **Accesibilidad**: Lectores de pantalla y navegación por teclado

## 🔧 Personalización

El código está estructurado de forma modular, permitiendo fácil personalización:

- **Colores**: Modifica las variables CSS en `:root`
- **Dificultad**: Ajusta los rangos en `difficultyConfig`
- **Sonidos**: Personaliza las frecuencias en `playSound()`
- **Tiempos**: Cambia los límites de tiempo por dificultad

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.