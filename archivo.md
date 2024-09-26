---
layout: page
title: Archivo
author:
  name: Máster
  twitter: mipumh
  gplus:  
  bio: 
  image: logo.webp
  link: https://twitter.com/mipumh
permalink: archivo.html
---
<article>  
{% assign posts_by_year = site.posts | group_by_exp:"post", "post.date | date: '%Y'" %}
                
                {% for year in posts_by_year %}
                    <h2>{{ year.name }}</h2> <!-- Año de las publicaciones -->
                        {% for post in year.items %}
                                <h4 class="title"><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h4>
                                <p>
                                    <time pubdate datetime="{{ post.date | date: "%Y-%m-%d" }}" title="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%d/%m/%Y" }}</time>
                                </p>
                        {% endfor %}
                    <hr>
                {% endfor %}
</article>