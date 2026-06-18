---
layout: post
title: "Daniele Grasso, periodista de datos en El País: «La IA aplicada a la
  programación me ha dado superpoderes. Bien utilizada, sirve para hacer mejor
  periodismo»"
author:
  name: Félix Arias
---
Daniele Grasso (Milán, 1987) lleva más de una década en la intersección entre investigación, datos y tecnología. En EL PAÍS, coordina la sección de Narrativas Visuales y Datos, liderada por [Kiko Llaneras](https://elpais.com/autor/francisco-llaneras-estrada/). Ahí ha explotado grandes volúmenes de información para explicar conflictos, claves económicas, movimientos poblacionales o avances tecnológicos. Miembro del Consorcio Internacional de Periodistas de Investigación (ICIJ), ha participado en investigaciones internacionales como los Panama Papers, Pandora Papers, Uber Files o Implant Files. 

![]({{site.baseurl}}/images/001/imagen1.png)
<sup> Imagen retocada con IA a partir de fotografía original

Conversamos ya con él en esta revista [sobre innovación](https://mip.umh.es/blog/2017/03/12/daniele-grasso-periodismo-datos-el-confidencial/) y [la importancia de los datos para la credibilidad](https://mip.umh.es/blog/2018/05/02/daniele-grasso-periodismo-datos-el-confidencial/) cuando todavía era coordinador de la unidad de datos de El Confidencial. Ahora, mientras piensa en los nuevos contenidos para nuestro máster, analiza la aplicación de la Inteligencia Artificial (IA) generativa a la programación de código informático. Porque concibe esta tecnología no como atajo para publicar más, sino como una forma de explorar bases de datos, prototipar visualizaciones, extraer información y revisar errores. Considera que la programación asistida, bien desde el denominado *vibe coding* (con más supervisión del código) o IA agéntica (más automatizada), le ha abierto nuevas posibilidades. Es consciente de los límites que exige su uso, pero sobre todo está convencido de que bien empleada, esta tecnología puede ayudar a hacer mejor periodismo sin sustituir la parte más importante: el pensamiento crítico.

**P. ¿Cómo empleas la IA para programar en tu día a día?**

**R.** La programación asistida con IA es una herramienta maravillosa para explorar conjuntos de datos que de otro modo me llevaría mucho rato analizar. Me sirve para dar una primera ojeada, ver si hay algo interesante dentro y decidir si merece la pena empezar un proyecto con eso o no. También es excelente, en la fase de creación de una historia, para hacer un primer prototipo, aunque no sea del todo funcional. Siempre he trabajado mucho con programadores, pero no sé programar como tal. Ahora estoy descubriendo que puedo hacer algunas cosas solo. 

Por ejemplo, en un proyecto con datos públicos en el que estamos trabajando ahora, tenía mis datos recopilados en una hoja de cálculo. En lugar de hacer un gráfico de cero para una primera visualización de consumo interno, se los pasé a Claude y le pedí que me hiciera un buscador. En minutos, fui capaz de explorar mis datos de una manera mucho más visual y sencilla. Y pude enseñarlo casi al instante a un compañero de otra sección del periódico con el que estaba preparando el tema. Ya no tuve que explicarle una tabla de Excel, sino un gráfico. Habría podido hacerlo antes, pero me habría llevado mucho más tiempo. 

**P. Hablemos de esos proyectos a largo plazo, donde quizás la IA tiene un papel aún mayor.**

**R.**  En este momento, en los proyectos que incluyen análisis de datos y visualizaciones, suelo moverme a dos o tres bandas. Utilizo el chat de Claude para razonar el proyecto, prepararlo, plasmarlo y ver hasta dónde puedo llegar. Cuando lo tengo claro, me muevo a Claude Code o a Cursor, dependiendo de las necesidades de cada proyecto. Si de ese mismo proyecto tengo que hacer visualizaciones, prefiero hacerlas en Cursor porque su interfaz me permite ver más código directamente. Últimamente he realizado visualizaciones de datos bastante complejas que jamás me habría planteado hacer solo. Cursor trabaja directamente sobre el código con una interfaz de chat lateral y el código en el centro. Ves todo el rato lo que hace, lo tienes muy a mano y te anima a tocar el código directamente. La IA se encarga del grueso del trabajo y de la estructura compleja, esa parte que siempre genera problemas. Y tú te dedicas a afinar los detalles.

> «La IA agéntica sirve para explorar datos que antes requerían mucho tiempo. Además, ahora puedo hacer solo visualizaciones que jamás me habría planteado»

**P. Hemos tratado el análisis preliminar y el apoyo a la visualización de datos. ¿Para la extracción de información también estás usando esta tecnología?**

**R.** Un ejemplo de algo que hace muy bien Claude es encontrar, dentro del código de una página web, una API (un servicio de datos al que se le hacen peticiones). A veces los desarrolladores no ponen esos datos a disposición de todo el mundo mediante un botón de descarga, pero Claude es capaz de meterse en el código, por ejemplo en un mapa interactivo, para que tú puedas hacer las peticiones directamente si los datos están abiertos. Esto ha sido un avance tremendo, porque antes era posible, sí; pero tras horas de desarrollo. Más allá de la rapidez con la que funciona el programa final, lo bestial es la velocidad con la que escribes el código para crearlo. Además, cuando se encuentra con errores, la IA es capaz de buscar sus propias soluciones alternativas. Esto permite realizar tareas que antes ni me habría planteado porque el beneficio no compensaba el tiempo requerido.

Para el *scraping* puro y duro (automatizar la extracción de datos contenidos en páginas web o documentos) me he encontrado muy bien con Claude Cowork. Le pido que haga el script en Python o R, principalmente para ver exactamente lo que hace. Esta herramienta además organiza el flujo de trabajo de forma ideal para tareas recurrentes.

**P. ¿Cómo consigues calibrar la fiabilidad de lo que genera?**

**R.** Estamos aprendiendo mucho sobre esto. Para empezar, intentamos trabajar con lenguajes de programación que controlemos (como R para casi todo) y alimentamos a la IA con modelos y códigos propios para que aprenda de ellos. En mis proyectos de Claude, tengo conectada la carpeta con todos nuestros proyectos de R. Así la IA sabe qué librerías uso, cómo organizo los proyectos y que suelo comentar cada ciertas líneas. 

En el análisis de datos es más difícil. Por eso fuerzo a la IA a razonar mucho. No le digo simplemente "haz esto", sino "tengo pensado hacerlo de esta forma o de esta otra; dime qué te parecen estas opciones y cuéntame otra alternativa". Mantengo una larga conversación previa para que me explique cómo lo va a hacer antes de ejecutarlo, para entenderlo bien y saber qué está pasando en todo momento.

A esto se suma el uso de un archivo Markdown (que en mis proyecto llamo estado.md) que mantiene un resumen actualizado del proyecto y ayuda a ver fácilmente dónde están los fallos o los errores para reconducirlos. Sería ideal que cada uno hiciera estos resúmenes; pero, cuando llevas ocho horas trabajando en un proyecto, no te da la vida. Que la IA lo vaya actualizando mientras se desarrolla el proyecto es una gran ayuda.

**P. Usar una IA para corregir a otra IA…**

**R.** Eso es algo que estamos haciendo mucho últimamente: pasarle un proyecto hecho con IA a otra herramienta diferente para que lo revise. El fact-checking periodístico aplicado a las historias de datos, apoyado con esta tecnología, es algo que todavía está por explotar. El otro día estaba preparando un proyecto entero en Cursor porque tenía muchos mapas y me gusta tocarlos directamente. Antes de presentarlo a mis compañeros, le pasé el proyecto entero a Claude y le pedí que buscara errores. Y los encontró. No eran fallos estructurales, sino detalles, los típicos errores difíciles de detectar de otra forma. Utilizar una IA para chequear el trabajo de otra me parece una técnica muy potente.

> «Utilizar una IA para chequear el trabajo de otra es muy potente. El fact-checking periodístico aplicado a las historias de datos es algo que todavía está por explotar»

**P. ¿Cómo consigues formarte y estar al día de todos estos avances?**

**R.** Aprendo mucho hablando con mis compañeros. Tengo la suerte de estar en un equipo donde nos retroalimentamos entre todos y vamos aprendiendo sobre la marcha. Está claro que tener una base de código y saber qué preguntas hacer es clave. El enfoque de "hazme una cosa con esto" sin especificar no sirve para nada. Todo mi *expertise* previo sobre bases de datos, saber por dónde empezar, qué preguntas hacer, qué tiene sentido explorar y qué no me ha servido para aprovechar la herramienta. Literalmente me siento como si me hubiesen dado superpoderes, más que haber aprendido cosas nuevas. Las cosas que ya sabía hacer, ahora las hago sin obstáculos y me salen solas.

![]({{site.baseurl}}/images/001/captura-de-pantalla-2026-06-16-221112.png)

<sup>Captura del modelo de predicción del Mundial, uno de los últimos proyectos en los que el equipo de datos de EL PAÍS ha usado IA como apoyo para la programación </sup>

**P. ¿Estás convencido de que la IA aplicada a la programación sirve para hacer mejor periodismo?**

**R.** Tengo cero dudas, aunque hay que aprender a utilizarla. Estamos en un punto de inflexión similar a cuando no existía Excel y las cuentas había que hacerlas con la calculadora. Todo lo que hago con IA se podría hacer con código puro y duro, pero con la IA tienes más opciones y eres más rápido. Te ayuda a superar esos momentos en los que te chocas contra un obstáculo de código y no sabes cómo rodearlo, algo que antes a veces te llevaba a abandonar un proyecto.

Para nosotros, por ejemplo, es fundamental que las visualizaciones se vean bien en pantallas móviles: adaptar un gráfico interactivo a 200 píxeles de ancho era un dolor de cabeza tremendo de prueba y error. Ahora eso está tirado. Se ha abaratado muchísimo el coste de hacer versiones de un gráfico interactivo o estático. Claramente son superpoderes. Representa un salto de época. Si a las empresas les quitaran Excel hoy no podrían vivir. Con esto pasa igual.

> «Estamos en un punto de inflexión similar a cuando no existía Excel»

**P. Pero también hay riesgos y consecuencias negativas.**

**R.** Mis compañeros más cercanos y yo coincidimos en que no estamos trabajando menos, sino más, desde que está la IA. Primero, porque permite hacer varias cosas a la vez y asumir más proyectos. Te comprometes a sacar tres tareas para el viernes porque sabes que una de ellas probablemente la harás entera con IA, aunque requiera estar encima y revisarla.

También nos permite afinar un gráfico interactivo hasta el último detalle. Antes, por cuestiones de tiempo, igual habrías dejado una visualización tal y como estaba, pero ahora puedes mejorarla simplemente escribiendo un prompt sin tener que pelearte con 100 líneas de código. En algunos proyectos, gracias a la IA hemos llevado los gráficos a un nivel que de otro modo no habríamos alcanzado. Pero a costa de largas jornadas de trabajo.

Por otro lado, me preocupa que trabajar con IA te da la sensación de estar siendo productivo todo el rato. Cada vez que le pides algo a estas plataformas, te devuelven un resultado. Da igual que sea una basura; te genera la sensación de haber trabajado y creado un producto. Para mí eso es peligroso, porque una parte muy importante de nuestro trabajo como periodistas de datos, y en mi caso como coordinador de sección, consiste en pensar. Pensar es lo opuesto a producir de forma inmediata; mientras piensas, no puedes producir nada material, solo ideas o notas en una libreta. No hay que caer en la trampa de creer que por hacer muchas cosas con IA se está trabajando muchísimo. Esto puede llevar a un riesgo de *burnout* y de dependencia muy rápido por estar todo el rato creando productos de forma continua.

Esto conecta también con el concepto del *AI slop* (basura generada con IA). Ahora cualquiera puede lanzar un buscador interactivo en una web con un millardo de datos, pero un usuario normal accede a él y no sabe ni por dónde empezar. Los buscadores interactivos pueden ser súper útiles, pero no hay que perder el foco de que no se trata de vomitar un montón de datos puestos bonitos en una web; hay que pensarlos antes. Esa parte de reflexión se puede estimular conversando con Claude, lanzándole ideas para que busque ejemplos. Pero requiere tiempo.

**P. ¿Crees que la IA genera dependencia y atrofia la capacidad de pensar?**

**R.** No lo sé. Deberíamos hablar de esto dentro de 5 años. Por cómo la usamos nosotros, la sensación que tengo es que me ayuda a buscar respuestas a preguntas que antes ni me habría planteado porque el esfuerzo requerido habría sido excesivo. Me refiero a plantearme si unos datos se pueden mirar desde una perspectiva u otra. Lo que seguro que atrofiará es mi capacidad de escribir código desde cero. Pero la capacidad de pensar no creo que la atrofie; usada bien, sirve para estimular y buscar más respuestas. Sigo siendo muy analógico para la fase de diseño y plasmo mucho los proyectos sobre el papel. Y creo que esa parte se retroalimenta con la IA, no se atrofia.

> «Estamos trabajando más desde que está la IA. No hay que caer en la trampa de creer que por hacer muchas cosas se rinde más»

**P. ¿Cuáles crees que son las competencias más importantes para esto (saber escribir el prompt, saber programación, tener criterio…)?**

**R.** Saber escribir el prompt creo que ya no es la clave. Hubo mucho *hype* al principio con eso, pero hoy en día la IA te entiende perfectamente si aprendes a razonar con ella. Para proyectos grandes, la clave es saber ordenar bien un proyecto y tener la capacidad de decidir hasta dónde dejas trabajar a la IA sola y en qué punto intervienes tú. Es fundamental tener muy clara la infraestructura del proyecto. Ahí es donde aportamos más valor. También es vital saber qué preguntarle y determinar cuándo te puedes fiar del resultado y cuándo no. Esa capacidad de análisis me parece un valor tremendo y es el mismo criterio que aplicaba antes a las bases de datos. El punto de partida es el mismo, solo que ahora tengo en medio este superpoder que me lo hace todo mucho más rápido.

![]({{site.baseurl}}/images/001/chatgpt-image-17-jun-2026-21_15_18.png)
<sup> Imagen retocada con IA a partir de fotografía original

**P. Entonces, ¿consideras que tener conocimientos previos de programación no es un requisito indispensable?**

**R.** Ayuda muchísimo. Quizás no es la base estricta para empezar, pero es importante para desarrollar proyectos complejos con código. Si usas la IA para eso, normalmente es porque tienes nociones de programación; si no, el uso de código es una forma de resolver problemas que ni se te ocurre.

En mi caso, conozco la forma de utilizar Svelte para generar gráficos ágiles en móvil y escritorio mediante código porque se lo he visto hacer a mis compañeros antes de que existiera la IA. Ahora lo puedo ejecutar yo gracias a ella. Tenía ese *background* conceptual de que esa era una vía válida para resolver estas necesidades. Aún así, mis compañeros que tienen los conocimientos para visualizar datos con lenguaje de códigos siguen teniendo una enorme ventaja competitiva: pienso concretamente en [Laura Navarro](https://elpais.com/autor/laura-navarro-soler/), [José Antonio Iguacel](https://elpais.com/autor/jose-antonio-alvarez-iguacel/) o [Luís Sevillano](https://elpais.com/autor/luis-sevillano-pires/) para la parte de visualización de datos; a [Borja Andrino](https://elpais.com/autor/borja-andrino-turon/) para los análisis de grandes cantidades de datos; a [Jacob Vicente](https://elpais.com/autor/jacob-vicente-lopez/) para crear la infraestructura de proyectos automatizados. Los superpoderes que les da a ellos la IA se basarán sobre una base aún más sólida.

**P. ¿Y cómo ves la evolución de los costes y el consumo de tokens en código? ¿Tenderá a abaratarse o se convertirá en un entorno cerrado para unos pocos?**

**R.** Es complicado saberlo. La historia y la teoría económica dicen que, a mayor competencia, los precios bajan; pero es difícil de predecir. Anthropic acaba de sacar un modelo nuevo y han dicho que será gratis hasta el 22 de junio \[ahora mismo suspendido por orden de Estados Unidos, presuntamento por riesgos de seguridad]. Yo no lo he querido probar porque me han dicho que una vez que lo pruebas ya no hay vuelta atrás por el salto de calidad definitivo que supone. Hay mucha competencia, pero también es evidente que todos están copiando las funciones de Claude.

Por otro lado, se están realizando inversiones de capital bestiales y la tecnología depende de una infraestructura física real (centros de datos, energía, etc.). Hay quien defiende que esa base física es una señal de solidez de la industria, aunque también se podría argumentar que, en 2008, en España se construyeron muchas casas físicas que luego se quedaron a medias.
