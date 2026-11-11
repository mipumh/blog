---
layout: page
title: Archivo
author:
  name: Máster
  twitter: mipumh
  image: logo.webp
  link: https://twitter.com/mipumh
permalink: archivo.html
---
{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% assign meses = "ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic" | split: "," %}


<nav class="archivo-anios" aria-label="Ir a un año">
{% for year in posts_by_year %}<a href="#a{{ year.name }}">{{ year.name }}</a>{% endfor %}
</nav>

<div class="archivo">
{% for year in posts_by_year %}
<details class="archivo-anio" id="a{{ year.name }}"{% if forloop.first %} open{% endif %}>
  <summary>
    <h2>{{ year.name }}</h2>
    <span class="archivo-n">{{ year.items | size }} artículos</span>
    <svg class="archivo-flecha" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
  </summary>
  <ol class="archivo-lista">
  {% for post in year.items %}{% assign m = post.date | date: "%-m" | minus: 1 %}
    <li>
      <time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%-d" }} {{ meses[m] }}</time>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ol>
</details>
{% endfor %}
</div>
