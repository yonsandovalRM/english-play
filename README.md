# 🇬🇧 EnglishPlay — Aprende Inglés con Gamificación

> Una aplicación web interactiva para aprender inglés a través de minijuegos, enfocada en vocabulario, frases cotidianas y estructuras gramaticales básicas.

---

## 🎯 Objetivo

Crear una app que haga del aprendizaje del inglés algo divertido y adictivo, usando mecánicas de gamificación como puntos, rachas, niveles y minijuegos variados. El foco principal es **vocabulario** y **frases de uso diario** (I can, I can't, I like, I don't like, etc.).

---

## 🧩 Minijuegos Principales

### 1. 🪢 Ahorcado (Hangman)
- El usuario debe adivinar una palabra en inglés letra por letra.
- Se muestra la traducción al español como pista.
- Categorías: animales, comida, colores, profesiones, objetos, etc.
- Dificultad progresiva: palabras más largas o menos intentos.

### 2. 🔗 Conectar Pares (Match Pairs)
- Cartas con palabras en inglés y español que el usuario debe emparejar.
- Modo memoria (cartas boca abajo) o modo directo (drag & drop).
- Temporizador opcional para sumar puntos extra.

### 3. 📝 Completar la Frase (Fill the Blank)
- Frases con un espacio en blanco: *"I ___ swim"* → `can` / `can't`.
- Opciones múltiples o escritura libre.
- Frases organizadas por estructura: *can/can't, like/don't like, have/don't have, want/don't want*.

### 4. 🔀 Ordenar Palabras (Word Scramble)
- Palabras o frases desordenadas que el usuario debe reordenar.
- Ejemplo: `like / I / pizza` → *"I like pizza"*.
- Dificultad progresiva: frases más largas y complejas.

### 5. 🎧 Escucha y Escribe (Listen & Type)
- Se reproduce un audio con una palabra o frase en inglés.
- El usuario debe escribir lo que escuchó.
- Usa Web Speech API o archivos de audio pregrabados.

### 6. 🖼️ ¿Qué es esto? (Picture Quiz)
- Se muestra una imagen y el usuario debe escribir o seleccionar la palabra en inglés.
- Ideal para vocabulario concreto: frutas, animales, partes del cuerpo, etc.

### 7. ⚡ Velocidad (Speed Round)
- Ronda cronometrada con preguntas rápidas de vocabulario.
- Traducir palabra, elegir la correcta, verdadero/falso.
- Puntuación por velocidad y precisión.

---

## 📚 Contenido y Categorías

### Vocabulario por Temas
| Categoría       | Ejemplos                                    |
|-----------------|---------------------------------------------|
| Animales        | dog, cat, bird, fish, horse                 |
| Comida          | apple, bread, milk, chicken, rice           |
| Colores         | red, blue, green, yellow, purple            |
| Familia         | mother, father, brother, sister, baby       |
| Cuerpo          | head, hand, eye, mouth, leg                 |
| Ropa            | shirt, pants, shoes, hat, jacket            |
| Casa            | kitchen, bedroom, door, window, table       |
| Profesiones     | doctor, teacher, engineer, chef, driver     |
| Clima           | sunny, rainy, cloudy, windy, cold           |
| Números         | one, two, three... twenty, hundred          |

### Frases y Estructuras
| Estructura         | Ejemplos                                        |
|--------------------|-------------------------------------------------|
| I can / I can't    | I can swim. I can't drive.                      |
| I like / I don't   | I like pizza. I don't like spiders.             |
| I have / I don't   | I have a dog. I don't have a car.               |
| I want / I don't   | I want water. I don't want coffee.              |
| I am / I'm not     | I am happy. I'm not tired.                      |
| There is / are     | There is a book. There are two cats.            |
| Do you...?         | Do you like music? Do you have a pet?           |
| Can you...?        | Can you cook? Can you speak English?            |
| What / Where / How | What is this? Where is the park? How are you?   |

---

## 🏆 Sistema de Gamificación

### Puntos y XP
- Cada respuesta correcta otorga **+10 XP** (base).
- Bonus por racha: 3 seguidas = **x1.5**, 5 seguidas = **x2**.
- Bonus por velocidad en rondas cronometradas.

### Niveles
| Nivel | XP Requerido | Título          |
|-------|-------------|-----------------|
| 1     | 0           | 🌱 Beginner     |
| 2     | 100         | 📖 Student      |
| 3     | 300         | ✏️ Learner      |
| 4     | 600         | 🎯 Practitioner |
| 5     | 1000        | ⭐ Advanced     |
| 6     | 1500        | 🏅 Expert       |
| 7     | 2500        | 👑 Master       |

### Rachas Diarias (Streaks)
- Se registra si el usuario practica al menos **1 sesión por día**.
- La racha se muestra con 🔥 y un contador de días consecutivos.
- Perder la racha reinicia el contador (se puede implementar "freeze" como recompensa).

### Logros (Achievements)
| Logro                  | Condición                           |
|------------------------|-------------------------------------|
| 🎯 Primera Palabra     | Completar el primer ejercicio       |
| 🔥 Racha de 7 días     | Practicar 7 días seguidos           |
| 🧠 Vocabulario x50     | Aprender 50 palabras                |
| ⚡ Rayo                | 10 respuestas correctas en < 30 seg |
| 🪢 Maestro del Ahorcado| Ganar 20 partidas de ahorcado       |
| 📝 Frasero             | Completar todas las frases de un tema |

---

## 🛠️ Stack Tecnológico

| Capa          | Tecnología                                     |
|---------------|-------------------------------------------------|
| Frontend      | **React** + **Vite** + **TypeScript**           |
| Estilos       | **Vanilla CSS** (variables, animaciones custom) |
| Estado        | React Context + `useReducer`                    |
| Persistencia  | `localStorage` (progreso, XP, rachas)           |
| Audio         | Web Speech API / archivos `.mp3`                |
| Imágenes      | Generadas con IA o libres de royalties          |
| Deploy        | Vercel / Netlify                                |

> **Nota:** En una primera versión se usa `localStorage` para almacenar progreso. En el futuro se puede integrar un backend con base de datos para sincronización entre dispositivos.

---

## 📁 Estructura del Proyecto

```
ingles/
├── public/
│   ├── audio/            # Archivos de audio para pronunciación
│   └── images/           # Imágenes para Picture Quiz
├── src/
│   ├── assets/           # Iconos, fuentes, recursos estáticos
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/           # Botones, cards, modales, progress bars
│   │   ├── games/        # Componentes de cada minijuego
│   │   │   ├── Hangman/
│   │   │   ├── MatchPairs/
│   │   │   ├── FillBlank/
│   │   │   ├── WordScramble/
│   │   │   ├── ListenType/
│   │   │   ├── PictureQuiz/
│   │   │   └── SpeedRound/
│   │   └── layout/       # Header, Sidebar, Navigation
│   ├── data/             # Bancos de palabras y frases (JSON)
│   │   ├── vocabulary/   # Palabras organizadas por categoría
│   │   └── phrases/      # Frases organizadas por estructura
│   ├── hooks/            # Custom hooks (useGame, useScore, useStreak)
│   ├── context/          # GameContext, UserContext
│   ├── pages/            # Páginas principales
│   │   ├── Home.tsx      # Dashboard con progreso y acceso a juegos
│   │   ├── Games.tsx     # Lista de minijuegos disponibles
│   │   ├── Profile.tsx   # Perfil, nivel, logros, estadísticas
│   │   └── Settings.tsx  # Configuración (dificultad, sonido, tema)
│   ├── utils/            # Funciones utilitarias
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css         # Estilos globales y design tokens
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🗺️ Roadmap de Implementación

### Fase 1 — Fundación *(Semana 1-2)*
- [ ] Inicializar proyecto con Vite + React + TypeScript
- [ ] Diseñar sistema de estilos (colores, tipografía, animaciones)
- [ ] Crear layout principal (header, navegación, contenedor)
- [ ] Implementar página Home con dashboard básico
- [ ] Crear banco de datos de vocabulario (JSON) — al menos 5 categorías
- [ ] Crear banco de frases — al menos 4 estructuras (can, like, have, want)

### Fase 2 — Primeros Juegos *(Semana 3-4)*
- [ ] Implementar **Ahorcado** con selección de categoría
- [ ] Implementar **Completar la Frase** con opciones múltiples
- [ ] Implementar **Conectar Pares** (modo directo)
- [ ] Sistema de puntuación básico (XP por respuesta correcta)
- [ ] Feedback visual y sonoro (correcto/incorrecto)

### Fase 3 — Gamificación *(Semana 5-6)*
- [ ] Sistema de niveles con barra de progreso
- [ ] Rachas diarias con tracking en `localStorage`
- [ ] Logros desbloqueables
- [ ] Página de perfil con estadísticas
- [ ] Animaciones de celebración (confetti, badges)

### Fase 4 — Más Juegos *(Semana 7-8)*
- [ ] Implementar **Ordenar Palabras**
- [ ] Implementar **Escucha y Escribe** (Web Speech API)
- [ ] Implementar **Picture Quiz**
- [ ] Implementar **Speed Round**
- [ ] Modo dificultad configurable

### Fase 5 — Pulido y Expansión *(Semana 9-10)*
- [ ] Expandir banco de vocabulario (+200 palabras)
- [ ] Agregar más estructuras de frases
- [ ] Tema oscuro / claro
- [ ] Responsive design (mobile-first)
- [ ] Sonidos y música de fondo opcional
- [ ] Deploy a producción

### Fase 6 — Futuro *(Opcional)*
- [ ] Backend con autenticación (guardar progreso en la nube)
- [ ] Modo multijugador (competir con amigos)
- [ ] Lecciones guiadas por nivel
- [ ] Spaced Repetition System (SRS) para repaso inteligente
- [ ] Integración con IA para generar ejercicios dinámicos

---

## 🎨 Diseño Visual

### Paleta de Colores
- **Primario:** `#6C63FF` (violeta vibrante)
- **Secundario:** `#FF6584` (rosa coral)
- **Éxito:** `#00C896` (verde menta)
- **Error:** `#FF4757` (rojo suave)
- **Fondo claro:** `#F8F9FE`
- **Fondo oscuro:** `#1A1A2E`
- **Texto:** `#2D3436` / `#EAEAEA`

### Tipografía
- **Títulos:** `Outfit` (Google Fonts)
- **Cuerpo:** `Inter` (Google Fonts)
- **Monospace:** `JetBrains Mono` (para inputs de texto)

### Animaciones
- Transiciones suaves en hover (200ms ease)
- Shake en respuesta incorrecta
- Bounce en respuesta correcta
- Confetti al subir de nivel o desbloquear logro
- Progreso animado en barras de XP

---

## 🚀 Cómo Empezar

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 📄 Licencia

MIT — Uso libre para aprendizaje y desarrollo personal.
