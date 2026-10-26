---
layout: page
title: Conferencias · Archivo 2020-2021
author:
  name: Máster
  twitter: mipumh
  gplus:  
  bio: 
  image: logo.webp
  link: https://twitter.com/mipumh
permalink: /conferencias/
---

<p class="lead">Archivo de las conferencias de 2020/21. Todos los profesionales invitados al máster, por curso y asignatura, están en <a href="https://mip.umh.es/nos-visitan.html">Nos visitan</a>.</p>

{% for conferencias in site.conferencias reversed %}

<h2><a href="{{ conferencias.title | downcase }}.html">{{ conferencias.name }}</a> - {{ conferencias.position }}</h2>
<p class="lead">{{ conferencias.fecha }} a las {{ conferencias.hora }}</p>

<hr>

{% endfor %}
