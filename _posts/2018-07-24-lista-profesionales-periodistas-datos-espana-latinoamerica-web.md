---
layout: post
title: Periodistas de datos, una lista para registrarlos a todos
excerpt: "Todo comenzó con una pregunta mental: ¿cómo puedo localizar a los periodistas de datos en España? Un primer rastreo me proporcionó alguna lista de Twitter, un grupo de trabajo en Meetup y algún artículo científico exploratorio. Las incógnitas se multiplicaron: ¿faltan nombres? ¿Están actualizados? ¿Hay forma de ponerse en contacto con ellos?."
author: arias
categories:
  - narrativas
---
Todo comenzó con una pregunta mental: ¿cómo puedo localizar a los periodistas de datos en España? Un primer rastreo me proporcionó alguna [lista de Twitter](https://twitter.com/calvoesperanza/lists/periodismo-de-datos/members), un [grupo de trabajo en Meetup](https://www.meetup.com/es-ES/Madrid-Periodismo-de-datos-Meetup/) y algún [artículo científico exploratorio](https://revistas.ucm.es/index.php/ESMP/article/viewFile/52594/48347). Las incógnitas se multiplicaron: ¿faltan nombres? ¿Están actualizados? ¿Hay forma de ponerse en contacto con ellos?

La respuesta parecía obvia: había que crear **un proyecto de periodismo de datos sobre periodistas de datos** (entiéndase la redundancia). El proceso tenía que seguir las fases habituales: [búsqueda, extracción, limpieza, análisis, visualización](http://mip.umh.es/blog/2014/05/08/recursos_datos_cinco/)… Y había que testar cuanto antes el proyecto. Así se lanzó [periodistasdedatos.com](http://periodistasdedatos.com/), un listado para visibilizar, estudiar y fomentar la colaboración entre los profesionales de esta especialidad que ya cuenta con 334 miembros.

### Dos meses, tres listas y nueve categorías

Pero me he saltado unos cuantos pasos intermedios. A principios de mayo le formulé la pregunta inicial a [Miguel Carvajal](https://twitter.com/mcarvajal_) y la cogió al vuelo sin dudar. Ya tenía desarrollador y compañero de fatigas. Sin pensarlo mucho más, tiré del hilo en Twitter a partir listas, búsquedas, etiquetas (#periodismodatos, #periodismodedatos, #ddj...) y proyectos formativos y periodísticos centrados en datos. El primer resultado fue **una lista de 219 miembros**:

<blockquote class="twitter-tweet" data-lang="es"><p lang="es" dir="ltr">Queremos reunir a todos los que hacen periodismo de datos en español. Y empezamos con una lista de Twitter con 219 miembros 👇<a href="https://t.co/zzLDIPdQXw">https://t.co/zzLDIPdQXw</a>  <br>Cualquier sugerencia será bienvenida 🧐</p>&mdash; Félix Arias Robles (@flxarias) <a href="https://twitter.com/flxarias/status/994512224462000129?ref_src=twsrc%5Etfw">10 de mayo de 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<br>

Llegaron las primeras sugerencias, pero el grueso de los nuevos registros se alcanzó gracias a un *scrapping* con [webscraper](http://webscraper.io/) de diversos grupos de Meetup de [Hacks/Hackers](https://hackshackers.com/) principalmente).

El dataset sobrepasó las 5.000 filas. Había llegado la hora de cribar. Y mucho. Fue un proceso algo artesanal basado en dos criterios: 

1. Que tuviera una cuenta en Twitter (la red más común en esta ámbito y una forma de verificar la información y mantenerla actualizada).

2. Que se acercara lo máximo posible a alguno de los ejes del periodismo de datos (vinculados a sus fases): investigación, transparencia (búsqueda), desarrollo (extracción), análisis y visualización

Al mismo tiempo, se añadieron profesionales de las secciones de investigación, visualización y datos de medios y proyectos periodísticos innovadores, incluidos los del [ranking de innovación periodística](http://mip.umh.es/ranking/).

Era el momento de volver a *scrapear*, esta vez con los perfiles de Twitter, campos como el nombre, el perfil o la ubicación. Y, por último, de añadir algunos campos adicionales como el sexo o **las categorías** (que son la parte más interpretativa y, por tanto, más subjetiva y polémica del proyecto). Estos los criterios empleados para etiquetar a los profesionales:

* **#redacción**: experiencia y habilidad para contar historias a partir de datos.

* **#academia**: estudio científico y formación en periodismo de datos.

* **#proyectos**: desarrollo de algún producto basado en la investigación periodística y los datos.

* **#desarrollo**: programación o escritura de código para facilitar las diferentes fases del trabajo periodístico.

* **#visualización**: diseño y confección de representaciones gráficas estáticas o interactivas. 

* **#verificación**: enfoque en certificar la autenticidad de información.

* **#transparencia**: especialización en legislación o procesos de solicitud de información de interés público para su posterior publicación.

* **#investigación**: periodismo más allá de declaraciones, de filtraciones y de unos pocos documentos.

* **#análisis**: conocimientos sobre estadística, minería de datos y todo ese universo. 

Mientras tanto, la web había empezado a germinar. Poco a poco, la librería de [Bootstrap](https://getbootstrap.com/) iba cobrando vida en [Github](https://github.com/) hasta dar forma a categorías, formularios y popups para los primeros 303 miembros de la lista.

<blockquote class="twitter-tweet" data-lang="es"><p lang="es" dir="ltr">Hoy estrenamos ⏩ <a href="https://t.co/GbhxYUtMIi">https://t.co/GbhxYUtMIi</a>, una lista que reúne a profesionales &quot;que ven en los datos la verdadera materia prima del <a href="https://twitter.com/hashtag/periodismo?src=hash&amp;ref_src=twsrc%5Etfw">#periodismo</a>&quot;, como dice <a href="https://twitter.com/flxarias?ref_src=twsrc%5Etfw">@flxarias</a>, impulsor del proyecto. Aporto mi granito de arena con el diseño y desarrollo web: <a href="https://twitter.com/hashtag/periodistasdedatos?src=hash&amp;ref_src=twsrc%5Etfw">#periodistasdedatos</a> <a href="https://t.co/L5epYfJiAW">pic.twitter.com/L5epYfJiAW</a></p>&mdash; Miguel Carvajal (@mcarvajal_) <a href="https://twitter.com/mcarvajal_/status/1019894378955976704?ref_src=twsrc%5Etfw">19 de julio de 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<br>

### Primeros resultados

Dos días después de presentar la primera versión de la web, habíamos recibido más de veinte peticiones. Ahora, cuando el proyecto apenas ha cumplido una semana, tenemos otras tantas en lista de espera. 

Tras la primera actualización se extrajeron los [primeros resultados](http://periodistasdedatos.com/graficos.html) demográficos. De los 334 miembros, un 51,05% son hombres y un 48,95%, mujeres. El 58,41% reside en España, el 11%, en Argentina y el 5,5%, en Estados Unidos.

<blockquote class="twitter-tweet" data-conversation="none" data-lang="es"><p lang="es" dir="ltr">Listado actualizado en ⏩ <a href="https://t.co/R6AmieeLHY">https://t.co/R6AmieeLHY</a> <br><br>Primer avance de datos demográficos:<br>170 hombres<br>163 mujeres<br><br>97 de Madrid<br>54 de Barcelona<br>37 de Argentina<br><br>¡Y muchos aún por registrar! ▶️ <a href="https://t.co/VDvLc8aOAS">https://t.co/VDvLc8aOAS</a><a href="https://twitter.com/hashtag/periodistasdedatos?src=hash&amp;ref_src=twsrc%5Etfw">#periodistasdedatos</a> 🔁 <a href="https://t.co/LrpRqlnlLr">pic.twitter.com/LrpRqlnlLr</a></p>&mdash; Félix Arias Robles (@flxarias) <a href="https://twitter.com/flxarias/status/1021340914718044160?ref_src=twsrc%5Etfw">23 de julio de 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<br>

Y esto es todo por ahora. Pero lo cierto es que **el proyecto no ha hecho más que empezar**. #Periodistasdedatos nace para ser una red especializada, actualizada y, sobre todo, abierta. Por eso animamos a que cualquiera aporte sus datos o los de cualquiera que conozca. Y si se le ocurre otra forma de colaborar, estaremos encantados de escucharle.

En los próximos meses, añadiremos mejoras como la posibilidad de registrarse y editar perfiles propios y ajenos, listados paralelos de proyectos y herramientas o un sistema de votaciones y otro de generación de colaboraciones. Porque nos proponemos visibilizar, estudiar y fomentar la colaboración entre periodistas de datos. Por eso lanzamos una lista para registrarlos a todos.

