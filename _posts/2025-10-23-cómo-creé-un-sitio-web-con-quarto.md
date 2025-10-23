---
layout: post
title: Cómo creé un sitio web con Quarto
date: 2025-10-23 13:58 -0600
city: Ciudad de México
description: Cómo repliqué las herramientas de un curso de estadística de Berkeley usando un framework llamado Quarto.
---

A mediados del año, descubrí que ya no podía acceder a mi cuenta de la UNAM, que mantenía y usaba constantemente para aprovechar el espacio de OneDrive y beneficios que ofrece GitHub a cuentas educativas. Sin embargo, en mi búsqueda de un posgrado y al aplicar a diferentes sitios, acabé con tres correos institucionales. Y uso los tres porque me dan acceso a diferentes recursos bibliográficos y de base de datos, lo que me ahorra un buen rato de búsquedas. Para ser sinceros, me dan mucho más beneficios que los que me daba mi cuenta de la UNAM.

Una de esas cuentas es de Berkeley, y gracias a ello me pude meter de "oyente" a una de las clases preparatorias para la maestría de MaCSS, en la que me aceptaron pero finalmente no pude ir. A palabras del profesor, encontré una grieta en el sistema. Tomé el curso en parte para tener la experiencia de tomar clases en una universidad de ese nivel, así como para conocer los materiales que utilizan para enseñar.

Me dio satisfacción saber que Berkeley usa Canvas LMS, que es el mismo LMS que utilizamos para [Daiuk](https://daiuk.com.mx). Además, algunos de los materiales se encuentran en páginas creadas con Jekyll. Había un detalle de una de las páginas que me llamaba mucho la atención y eran sus [tutoriales de código](https://stat20.berkeley.edu/summer-2025/2-summarizing-data/04-conditioning/tutorial.html). La página parecía hecha con markdown, pero es posible correr código y modificarlo. Me pareció una manera muy didáctica para enseñar programación, así que quise replicarlo.

Yo sospechaba que la página estaba hecha con algún framework de software libre, y por lo tanto debía ser barato y fácil de replicar. Mi apuesta era que se trataba de Jekyll con algunas extensiones. Le pedí a Claude.ai que me identificara el framework que utilizaba el curso de estadística de Berkeley y para él, lo más probable era que se tratara de [Quarto](quarto.org).

Resulta que Quarto comparte alguno de los beneficios de Jekyll, pues es código libre, permite crear páginas con markdown, es posible agregar código ejecutable, y se puede hospedar en Github Pages sin necesidad de un _backend_. Le pedí a Claude más detalles para crear mi proyecto de Quarto e implementarlo en GitHub Pages. Si te interesa, [aquí está mi conversación](https://claude.ai/share/84531137-888b-4e48-a6fa-11508c57e922), pero también te comparto un resumen en la siguiente sección del post.

Para esta entrada, utilicé muchas etiquetas especiales de markdown. Espero se vean bien en el correo.

## Cómo crear tu proyecto con Quarto

### 1. Instalación
Primero, [descarga e instala quarto](https://quarto.org/docs/get-started/). Si eres como yo, preferirás utilizar la línea de comandos. Si usas macOS, Quarto está disponible con homebrew:
```bash
brew install --cask quarto
```
Revisa que se haya instalado correctamente:

```bash
quarto --version
```

### 2. Crea tu proyecto

Una vez instalado Quarto, dirígete a tu carpeta de trabajo para crear tu proyecto. Solo corre el siguiente comando
```bash
quarto create project website my-course 
cd my-course
```

¡Listo! Ya tienes un sitio con Quarto, puedes visualizarlo con el comando `preview`

```bash
quarto preview
```

#### 2.1 ¿Qué hizo Quarto al crear tu proyecto?

Al correr `quarto create project website my-course`, quarto creó la siguiente plantilla de inicio:
```
my-course/ 
	├── _quarto.yml # Archivo de configuración
	├── index.qmd # Página de Inicio (Quarto Markdown) 
	├── about.qmd # Página de ejemplo 
	└── styles.css # Opcional, para personalizar el sitio con CSS
```

A continuación, modificaremos el archivo .yml para configurar el sitio a nuestras necesidades.

### 3. Personaliza tu proyecto de Quarto

#### 3.1 Configura \_quarto.yml

Conozcamos el archio yaml de Quarto:

```yaml
project:
  type: website

website:
  title: "my-course"
  navbar:
    left:
      - href: index.qmd
        text: Home
      - about.qmd

format:
  html:
    theme: cosmo
    css: styles.css
    toc: true
```

Me parece que la plantilla es bastante intuitiva, pero igual explico lo básico.

En la parte de "website", podemos modificar el título de nuestra página y los elementos de la barra de navegación (navbar). `- href:` señala la dirección de la página. Si está en la carpeta base, como index y about, solo pones el nombre del archivo con su extensión. `text` modifica el texto que se muestra en la barra de navegación.

El tema del sitio se puede modificar en format. Si te gusta tener completo control de los detalles de diseño, crea tu propio archivo .css. Yo quería que mi sitio de Quarto se pareciera a la _landing page_ que creé para promover un curso, así que copié ese estilo ahí.

#### 3.2 Crea y modifica archivos .qmd

La extensión `.qmd` se refiere a un Quarto Markdown, que es similar a un markdown, pero con funciones extras. En la cabecera (_header_), puedes agregar metadata en formato yaml.

```markdown
---
title: "Título de la página"
date: "2025-23-10"
---
```

El texto se edita con markdown. Markdown es muy sencillo de aprender y usar. Si no conoces markdown, te dejo [esta guía](https://www.markdownguide.org/). 

Agrega código ejecutable de esta manera:
 
\`\`\`{r} 
x <- c(1, 2, 3, 4, 5) mean(x) 
\`\`\`

Y también incluye fórmulas matemáticas con LaTeX Math:

Ex. 
\$\$E = mc^2\$\$

$$E = mc^2$$

Le pedí a Claude que me hiciera dos archivos demo, unos con ejemplos de código en Python y otros para ofrecer ejemplos de cómo buscar en una base de datos SQL. Pueden ver esos demos en las siguientes páginas:

- [Python demo](https://hdl.juanpaulo.xyz/course/demo)
- [SQL demo](https://hdl.juanpaulo.xyz/course/sqlite-demo)

Y aquí está el código:
- [Pytho demo](https://github.com/Maclenn77/hdl/blob/main/course/demo.qmd)
- [SQL demo]([sqlite-demo.qmd](https://github.com/Maclenn77/hdl/blob/main/course/sqlite-demo.qmd "sqlite-demo.qmd"))

Ah, para utilizar Python, tuve que agregar `pyodide` en el proyecto. Tienes que correr este comando en tu terminal:
```bash
quarto add coatless-quarto/pyodide
```

También modifiqué mi configuración. En la parte del formato, quedó de esta manera:

\_quarto.yaml
```yaml
...
format:
  html:
    theme:
      - cosmo
      - brand
    css: styles.css
    toc: true
    toc-title: "En este capítulo"
    code-fold: false
    code-tools: true
    filters:
      - pyodide # <-- La parte importante
```

## ¿Por qué estoy haciendo todo esto?

Sí, me puse a crear una página web con Quarto en parte porque me pareció entretenido, pero también porque quiero tener un sitio que me ayude a mostrar ejercicios para una clase que quizá imparta el próximo semestre, si hay suficientes alumnos interesados en tomarla.

Me emociona poder dar la clase, pero también una parte de mí está nerviosa porque tengo muchos años sin estar al frente de un grupo, me implica hacer muchos cambios y temo que me estoy sobrecargando de actividades. Afortunadamente todavía tengo bastante tiempo para planearla. Quiero tener ordenado los materiales para los alumnos para que ellos puedan ser lo suficientemente independientes y así no requieran demasiado de mi guía.
