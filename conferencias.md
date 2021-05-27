---
layout: page
title: Conferencias · Curso 2020-2021
author:
  name: Máster
  twitter: mipumh
  gplus:  
  bio: 
  image: logo.jpg
  link: https://twitter.com/mipumh
permalink: /conferencias/
---

{% for conferencias in site.conferencias reversed %}

<h2><a href="{{ conferencias.title | downcase }}.html">{{ conferencias.name }}</a> - {{ conferencias.position }}</h2>
<p class="lead">{{ conferencias.fecha }} a las {{ conferencias.hora }}</p>

<hr>

{% endfor %}
