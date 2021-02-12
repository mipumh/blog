---
layout: post
title: ¿Debe un periodista saber programar? Hacia una ecuación
author:
  name: Félix Arias
  twitter: cibermensaje
  gplus:  
  bio: Coordinador Nuevas Narrativas
  image: flx.jpg
  link: https://twitter.com/flxarias
---
Vamos a dejar a un lado [lo que están haciendo en la educación infantil de China](https://www.xataka.com/otros/china-incorpora-la-programacion-en-los-esquemas-educativos-de-ninos-a-partir-de-los-6-anos) desde hace años, [los avances de Argentina](https://www.infobae.com/educacion/2018/09/13/todas-las-escuelas-estaran-obligadas-a-ensenar-programacion-y-robotica/) y, aunque todavía sólo con cuentagotas, [los progresos en España](https://www.eldigitaldealbacete.com/2020/06/16/la-escuela-superior-de-ingenieria-informatica-de-albacete-ensena-a-estudiantes-de-secundaria-a-programar-desde-casa/). Vamos a olvidarnos también [de las modas](https://www.vogue.es/living/articulos/aprender-programar-hobby-informatica) y los debates enconados en el seno del periodismo, con [ataques de memes](https://www.theringer.com/tech/2019/1/29/18201695/learn-to-code-twitter-abuse-buzzfeed-journalists) y [de romanticismo](https://www.theatlantic.com/education/archive/2013/10/should-journalism-schools-require-reporters-to-learn-code-no/280711/#article-comments) incluidos. Y vamos a dejar para más adelante (aunque habrá referencias y no pocas) los listados de herramientas y recursos.

![]({{ site.baseurl }}/images/shots/foto-code.jpg)

<sup>Fuente: Data Journalism Handbook<sup>

La pregunta de este artículo no es ni mucho menos nueva, pero muchas respuestas han servido para poco. Sobre todo, porque como precisó el periodista Jorge González, no es posible encontrar una respuesta única para una profesión sumamente compleja y diversa (como todas si se mira de cerca, supongo). Por no hablar de generalizar sobre la programación cuando existen diversos lenguajes y múltiples enfoques y formas de aplicarlos.

<!--StartFragment-->

<blockquote class="twitter-tweet"><p lang="es" dir="ltr">¿Qué tipo de periodista? Redactor, reportero, editor, de datos, gráfico (fotógrafo), visual, online, offline...</p>&mdash; Jorge González (@tuitertuliano) <a href="https://twitter.com/tuitertuliano/status/1356609208217706497?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--EndFragment-->

Este análisis pretende acercarse a una respuesta más práctica. Y lo hará con el permiso de una herramienta clásica de la economía. En esta especie de fórmula, por un lado estarán los beneficios que la programación puede aportar al periodista; por otro, los costes (los recursos que implican aprender a dominar sus lenguajes). Cuando esté perfilada (porque esto es solo un punto de partida), espero que ayude a que un periodista valore si le compensa aprender a programar en función de las actividades que realice (o aspire a desarrollar).

# Beneficios

Para organizar las ideas, vamos a categorizar los beneficios en lo que podemos considerar las tres principales fases del trabajo del periodista: buscar, procesar y transmitir contenidos. Algo similar señalaban en Interhacktives, aunque limitando las fases al análisis y la visualización, en esta más que recomendable [guía para que los periodistas comiencen a picar código](http://www.interhacktives.com/2020/02/25/the-journalists-guide-to-coding-part-i/).

Además, nos vamos a centrar en los cinco lenguajes más comunes y asequibles entre los periodistas: HTML, CSS, Python, R y JavaScript. Si quieres empezar a dejarte convencer, al menos de la idoneidad de estos lenguajes, yo empezaría con esta [guía para que cualquier “periodista ordinario” se adentre en la programación](https://medium.com/@micco.markovic/the-guide-for-learning-programming-for-data-journalists-from-the-real-journalist-i-mean-no-geek-9fac6e427300) de Miodrag Marković.

## 1. Buscar

Qué periodista no sueña con encontrar temas y enfoques que destaquen sus contenidos por encima del resto. No hablamos de formatos (todavía), sino de historias exclusivas. Explotar el big data y la automatización, y ahí R y Python son clave, puede servir para descubrir decenas de contenidos que pasarían desapercibidos o se perderían en la superficialidad.

En la unidad de datos de El País, por ejemplo, con Daniele Grasso, Kiko Llaneras y Borja Andrino a la cabeza, es ya común trabajar con R en lugar de hojas de cálculo para sacar temas como [éste sobre el tráfico en Madrid](https://elpais.com/ccaa/2019/01/30/madrid/1548865629_320905.html?rel=mas). También en España, aunque en los márgenes de los medios, las mejores bases de datos sobre el coronavirus también utilizan scripts de R, como [ésta de Montera34](https://github.com/montera34/escovid19data) (en contraste con el [sonado colapso de los datos de Reino Unido por usar Excel](https://twitter.com/MaxCRoser/status/1313046638915706880)).

Paradójicamente, la tendencia de explotar estos lenguajes es más clara en las islas británicas. Proyectos [punteros en el periodismo local como The Reach, Bureau Local, BBC Shared Data Unit o Radar](https://mip.umh.es/blog/2019/03/05/periodismo-datos-localizado-reino-unido/) se basan en Python y R para sobresalir entre el resto. Más allá del charco, el repositorio de Fivethirtyeight en GitHub refleja cómo la gran mayoría de sus trabajos se basan en Jupyter Notebook, un proyecto que principalmente se basa en Python y R.

![](https://lh5.googleusercontent.com/sLaaAQUQwgaee1o0YfaporVnSeHazSt9JVe3-wlsfcjzUFQAXta77MnLSU7TuoOIglIDN8FX2ueeRRRJoV-wCblh9OMISCaEbaLlcQRd7g0TsQOmMSIFmiuucBmbOeCfREcK-RTy)

No podemos olvidarnos de [Bepolit](http://bepolit.es/), lanzado por nuestro Miguel Carvajal, un robot que rastrea, jerarquiza y publica miles de enlaces para reflejar los contenidos más relevantes en Twitter. [Está programado](https://twitter.com/mcarvajal_/status/1341157041130401794) con Jekyll (escrito en Ruby) y se basa en T-Hoarder, que Mariluz Congosto desarrolló con Python.

Además de estos casos concretos, aprender a programar puede aportar a un periodista (como a cualquiera) nuevas formas de pensar. Tim Cook dijo en su día que el código es [la segunda lengua más importante que puedes aprender, incluso por encima del inglés](https://www.baquia.com/empresas/directivos/tim-cook-mejor-aprender-programar-aprender-ingles-segundo-idioma). Su antecesor, Steve Jobs, repetía que todos debemos conocer algún lenguaje informático [porque permite pensar de otra manera](https://www.youtube.com/watch?v=XfamAqjFqJw). Esto puede resultar interesante para cualquier profesional, pero [más aún para el proceso creativo que radica en las primeras fases del trabajo periodístico](http://mediashift.org/2015/01/why-journalism-students-need-a-baseline-understanding-of-coding/).

Y no podemos olvidarnos de algo esencial, especialmente en estos tiempos tan complejos para la industria: buscar trabajo. Entre las últimas ofertas que les han llegado a periodistas como Alba Otero, al profesional de la información le piden conocer lenguajes como JavaScript. No es de extrañar si tenemos en cuenta que medios de la profundidad de The New Yorker [incluyen entre sus requisitos el conocimiento de HTML, CSS, JavaScript, R y Python](https://www.newyorker.com/home/about/data-journalist).

<!--StartFragment-->

<blockquote class="twitter-tweet"><p lang="es" dir="ltr">En relación con este tema, en el anuario de la <a href="https://twitter.com/aperiodistasalc?ref_src=twsrc%5Etfw">@aperiodistasalc</a> de este año he publicado un artículo acerca de ello. <a href="https://t.co/rQP75G5clf">pic.twitter.com/rQP75G5clf</a></p>&mdash; Alba Otero (@OteroAlba) <a href="https://twitter.com/OteroAlba/status/1356629556468330496?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--EndFragment-->

## 2. Procesar

Casi todo lo anterior se aplica a la que podemos llamar la segunda fase del proceso periodístico: la que da forma a las ideas y los datos hasta convertirlos en historias. 

Comencemos con lo más elemental. Con una librería de Python es posible [convertir un audio en texto de manera automática](https://programacionpython80889555.wordpress.com/2019/12/03/obteniendo-texto-de-un-archivo-de-audio-en-python-con-speechrecognition/) sin pasar por programas de pago como Trint o Happy Scribe. Con unos conocimientos un poco más avanzados, incluso es posible el proceso inverso: [crear un sintetizador de texto en audio](https://medium.com/@pilarsoledad/construyendo-un-sintetizador-de-texto-a-voz-usando-python-y-selecci%C3%B3n-de-unidades-a5dc2e11a091).

Pero eso es solo el principio. Python y R son dos de los principales lenguajes para la aplicación de la inteligencia artificial y el machine learning. De ahí parten gran parte de los [proyectos en este ámbito realizados en el periodismo](https://mip.umh.es/blog/2019/11/02/el-impacto-de-la-inteligencia-artificial-en-el-periodismo/) (y los que están por llegar). 

Quizás uno de los casos más ilustrativos sea el de Hanna and Ismail, un proyecto periodístico en el que BR Data and Spiegel Online automatizaron el envío de miles de correos para demostrar el racismo del mercado inmobiliario alemán. Lo explican con detalle en [su metodología](https://www.hanna-und-ismail.de/english/methodology.html) y profundizan en todo el [proceso de cálculo y codificación con lenguajes como R](https://br-data.github.io/2017-diskriminierung-mietmarkt-analyse/analyse.nb.html).  

![](https://lh6.googleusercontent.com/N8IxAma5kglFvmKuf9lYobc8t7rIAOmpBsO8PXGp50bmjQ2fbRPYOJH0SPevBSt1v6Ku6WEWV5MSdn2upzxYXaJfsVMTU4JfhdQLB9BNOU2m4fUQxWkfMzJHxUiGuC1ht3TaWolF)

## 3. Contar

Probablemente sea lo más evidente y relevante. Como señala el profesor Juan C. Camus, cuanto más se domina la programación, más formas de relatar tiene el periodista a su disposición.

<!--StartFragment-->

<blockquote class="twitter-tweet"><p lang="es" dir="ltr">Sí, el código es una herramienta que se debe aprender a usar y un puente con otras profesiones que se verán beneficiadas si sabes pedir adecuadamente lo que necesitas. La gracia es que mientras más conoces, más formas de relatar tienes a tu disposición.</p>&mdash; Juan C. Camus (@jccamus) <a href="https://twitter.com/jccamus/status/1356715967225737224?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--EndFragment-->

Cada vez son más frecuentes las visualizaciones de datos (gráficos y sobre todo mapas) que [se elaboran con R](https://pudding.cool/process/regional_smoothing/) y después, muchas veces “maquilladas” con programas de edición de imágenes, se publican en medios de comunicación. Pero sin duda aquí [el lenguaje estrella es JavaScript](https://code.likeagirl.io/code-and-journalism-today-ce8909628ce5).

Este lenguaje de programación está presente desde en grandes productos audiovisuales como [este webdoc del RTVE Lab sobre el descenso a una mina clandestina](http://lab.rtve.es/descenso-mina-clandestina/) hasta este [análisis cualitativo sobre los discursos y el Covid del New York Times](https://www.nytimes.com/interactive/2020/04/26/us/politics/trump-coronavirus-briefings-analyzed.html).

Probablemente dos de los mejores exponentes de los mejores exponentes del uso de JavaScript y otros lenguajes de programación en las nuevas narrativas periodísticas sean dos españoles que están brillando en el extranjero. [Martín González](https://martingonzalez.net/) es periodista visual en The Economist y, aunque se atreve con casi todo, seguramente su especialidad sea la visualización de datos con D3, una librería de JavaScript. [Adrián Blanco](http://adrianblancoramos.com/) es reportero gráfico en The Washington Post y [en su web](http://adrianblancoramos.com/), además de mostrar algunos de sus mejores trabajos, detalla los lenguajes que ha empleado en cada uno de ellos: 

![](https://lh4.googleusercontent.com/7vjgsI4y89zEh9OIil1ZWSIlDDfyxr0d9u382jLW9K0S33QeH1oZKeIacheGCtT3lvThqQ4lvGH_A7tdSCnnfkSpFzHdoxi2Sne4bGX1zxGswSr5etMj4pGBmhBFyutubQdX9rij)

# Costes

Programar es complejo y, casi siempre, frustrante. Sobre todo, al principio. Lo explica bastante bien la periodista Hannah Sinclair, quien afirma que [aprender código no puede doler](https://medium.com/the-walkley-magazine/should-journalists-learn-how-to-code-it-cant-hurt-ef04ce327fe4) y que ofrece muchas recompensas cuando se consiguen pequeñas victorias, pero también que invirtió dos meses en aprender solo las bases de la programación. A ella le salió gratis, pero también hay opciones de pago. Por eso vamos a clasificar los costes entre el tiempo y el dinero.

## 1. Dinero

El dinero no da la programación, pero ayuda. En teoría, es posible convertirse en un experto en cualquier código sin gastar un euro. Sobre todo, si además de escoger todas las opciones gratuitas, utilizas un equipo prestado (voluntariamente o por la fuerza), averiguas la contraseña del wifi del vecino y te enganchas a la red eléctrica exterior. Fuera bromas, vamos a intentar ver si invertir algo de recursos puede servir para que el complejo camino hacia el código sea algo más llevadero y de cuánto estamos hablando.

### Libros

La oferta de libros gratuitos es muy amplia. Es muy fácil encontrar buenas recopilaciones de manuales en PDF o web de [HTML y CSS](https://unaexperiencia20.com/libros-gratis-html-css-js/), de [JavaScript](https://ciberninjas.com/biblioteca-de-programacion-y-tecnologia/#libros-gratis-de-javascript), de [Python](https://openlibra.com/es/lists/id/EVaqYV) y de [R](https://openlibra.com/es/lists/id/EVaqYV). Para este último lenguaje, es especialmente recomendable [R para profesionales de los datos](https://www.datanalytics.com/libro_r/).

Pero si quieres tener libros en papel o encontrar algo más especializado, es probable que tengas que pasar por caja en una librería especializada o en Amazon. Yo acabo de hacerme con [Practical R for Mass Communication and Journalism](https://www.amazon.es/Practical-Mass-Communication-Journalism-Chapman/dp/1138726915/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=1612872870&sr=8-1) (aunque aún no he podido empezarlo).

### Tutoriales

La oferta aquí es todavía más amplia y pagar parece una opción poco necesaria. Para empezar con HTML o CSS, puede tener sentido ir al oficial de [W3Schools](https://www.w3schools.com/). 

También se puede acudir a [la web de Python](https://docs.python.org/es/3/tutorial/index.html) para empezar. Y si quieres encontrar vínculos entre ambos lenguajes, puedes seguir estas [instrucciones sencillas y al grano sobre HTML y Python](https://medium.com/@digidickinson/creating-gentle-introductions-to-coding-for-journalists-14a2e7d97ee1) de Andy Dickinson. Para profundizar un poco más sobre cómo aplicar Python en el periodismo, quizás lo más completo sea [esta guía de Alan Jones](https://towardsdatascience.com/python-for-data-journalists-get-your-data-from-the-web-c0cee664d17).

En R, en cambio, puedes arrancar con esta [guía para principiantes](https://conceptosclaros.com/instalar-r-primeros-pasos/). Pero si quieres profundizar, te recomiendo este [tutorial específico sobre cómo scrapear tuits con R](http://www.interhacktives.com/2017/01/25/scrape-tweets-r-journalists/) de Interhacktives. La oferta sobre JavaScript es más limitada, pero para introducirse en lo que es y en cómo funciona resulta muy útil [éste de la Berkeley University](https://multimedia.journalism.berkeley.edu/tutorials/javascript-journalists/).

### Cursos

En la formación más formal que proporcionan los cursos, el dinero sí tiene una mayor presencia. Entre las plataformas generalistas, el pago es más bien excepcional. [Khan Academy](https://es.khanacademy.org/), [Free Code Camp](https://www.freecodecamp.org/), y [Code.org](https://studio.code.org/courses) tiene todo su catálogo de manera gratuita. En [Code Academy](https://www.codecademy.com/pricing), en cambio, sí hay una versión premium (14 euros al mes) con contenido exclusivo y ventajas como más prácticas con el móvil, guías paso a paso y certificados.

Si buscas cursos específicamente pensados para periodistas, la cosa cambia un poco. DataJournalism.com ofrece [una más que interesante introducción a Python](https://datajournalism.com/watch), con vídeos y foros incluidos, de manera gratuita. El de [Investigative Reporters & Editors (IRE)](https://coding-for-journalists.readthedocs.io/en/latest/), también sobre Python, pero basado en texto, también es gratuito. Si quieres centrarte en HTML, CSS y JavaScript, probablemente el más recomendable (también sin pagar) es [Code Actually, de Cindy Royal](http://codeactually.com/).

Para profundizar en R y en otros aspectos de programación para periodismo (sobre todo de datos), la oferta es más exigente. El Centre for Investigative Journalism (CIJ) organiza [un curso online](https://tcij.org/scheduled-training/investigating-data-with-r-4/) que cuesta 119 libras o 70 si eres estudiante. La opción más completa probablemente sea [este curso presencial centrado en Python, en Estocolmo, de J++](https://jplusplus.org/en/academy/learn-coding-for-journalists/), que cuesta más de 4.000 euros. 

Pero también el Knight Center for Journalism in the Americas ofrece un completo programa formativo gratuito con vídeos y material en PDF que se puede ver en [la web oficial del curso](https://journalismcourses.org/course/intro-to-r-for-journalists-how-to-find-great-stories-in-data/) o en la [página específica](https://learn.r-journalism.com/en/) creada por el propio profesor, Andrew Ba Tran. Aunque de manera menos estructurada, también hay muchos y buenos recursos en [este blog de Rob Grant](http://rforjournalists.com/). y en [este listado de recursos](https://rddj.info/) de Timo Grossenbacher.

![](https://lh4.googleusercontent.com/zId9z_avPR0y82MiAM2B9-tgn1-qx8kqeznTAACBeURwVOz6yKBEipoz0_3nt_eftteTcMTzFkMDmOLE3lfSIA3-3vQUdVcPGnDNjyLBXsNQr6lb6jb628uyWpkK1K51pgN-WB_B)

Aunque no sean cursos, merece la pena nombrar también los eventos, todos (al menos, los que yo he visto) gratuitos. Destacan los que organiza Journocoders [sobre código, principalmente R y Python](https://journocoders.com/), y los del Knight Lab, [sobre datos, visualización y código](https://knightlab.northwestern.edu/community/).

## 2. Tiempo

Si el dinero es casi siempre una elección o un problema menor, el tiempo es probablemente el mayor contrapeso de esta ecuación. Es imposible calcular las horas que cada persona debe dedicar para aprender un lenguaje, porque depende de múltiples factores (conocimientos previos, motivación, enfoque, organización…). Pero sí hay algo claro: aprender a programar es un proceso lento y, aunque haya curvas de aprendizaje con más o menos pendiente, el camino siempre es cuesta arriba.

Para que nos hagamos una idea, solo los vídeos del citado curso introductorio de Python de DataJournalism.com duran más de cinco horas. Completar esa formación elemental, si intentas poner en práctica lo aprendido, puede multiplicar por dos o tres ese tiempo. La suma de la visualización de los vídeos y la lectura de los documentos del tutorial del Knight Center sobre R para periodistas puede superar las 50 horas. [Éste otro también del Knight Center sobre Python](https://www.classcentral.com/course/independent-python-for-data-journalists-analyzing-money-in-politics-9092) (ya no disponible) duraba cinco semanas bastante intensas.

Hannah Sinclair dedicó dos meses en un curso intensivo para tener también una visión general sobre la programación. Fenómenos de este mundo como los también nombrados probablemente dediquen gran parte de su jornada laboral a seguir aprendido, aunque sea para resolver problemas concretos, en un universo infinito. El curso del CIJ se desarrolla en tres mañana, con sesiones de hora y media y después trabajo autónomo tutorizado. El de J++ dura unas dos semanas, también alternando clases dirigidas y práctica individual. 

**¿Un balance?**

La respuesta más sensata a este debate tampoco es nueva: conviene al menos aprender lo esencial para saber hasta dónde se puede llegar y comunicarse con profesionales especializados, y después dar la opción de profundizar. Lo explica con claridad el profesor Chema Valero:

<!--StartFragment-->

<blockquote class="twitter-tweet"><p lang="es" dir="ltr">Yo creo que deben conocer ciertas lógicas de la programación y tener algunas nociones para ser capaces de colaborar con perfiles más técnicos sin que suene todo a chino, o incluso para que sirva como base si alguna vez se quiere hacer algo un poco más avanzado de forma autónoma.</p>&mdash; Chema Valero Pastor (@josvap) <a href="https://twitter.com/josvap/status/1356682190088716294?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--EndFragment-->

Pero esta respuesta abre otras muchas preguntas. Si tengo que elegir, ¿qué lenguajes me proporcionarían mayores ventajas? ¿Qué grado de profundidad debo alcanzar en el conocimiento de estos códigos? ¿De verdad me compensa introducirme en todo este mundo?

Como decía al principio, la fórmula todavía está en fase de desarrollo. Entre otras cosas, porque confío en ampliar sustancialmente los beneficios y los costes con las aportaciones a esta publicación. El resultado quizás se parezca a este simpático [quiz para saber si debes aprender a programar](https://www.buzzfeednews.com/article/katienotopoulos/should-you-learn-to-code) o a este [inspirador árbol de decisiones](http://franbarquilla.com/soy-periodista-deberia-aprender-a-programar/). Es probable que para seguir buscando y procesando información, pero sobre todo para transmitirla de la mejor manera posible, tenga que seguir aprendiendo a programar.

![](https://lh6.googleusercontent.com/-NN_NPpaGp0F8dGSrvzxlz9LYYSXscGyWvRmLsU4Yd6DH4ld_Hjoio2Fi1nVc98ZkZDomp5sGxDR5JJOj0f9wfJjIvxZ_V09jjXiQ_d5muEORmvBjbq6tZ_ndeyGO6maV3GqqR9H)