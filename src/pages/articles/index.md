---
title: Un lien par mois vers la Réunion
description: "Chaque mois un nouveau site ou un nouveau lien en rapport avec la Réunion vous est présenté et décortiqué."
notitle: true
image:
tags: none
permalink: "/articles/"
---

_Le principe de ce site est de présenter un ou plusieurs site web en rapport avec l'île de la Réunion chaque mois. Certaines années affichent un peu moins d'articles que prévu parce qu'on ne fait pas toujours ce qu'on veut, que voulez-vous. Au fil du temps les articles se sont donc clairsemés mais en contre-partie, ils se sont étoffés. Aujourd'hui j'essaye d'offrir un éclairage complet sur un thème choisi._

{% set year = "year" %}
{% for post in collections.article.reverse() %}
  {% if year === post.date.getFullYear() %}{% else %}{% set year = post.date.getFullYear() %}
<h2 class="clear articles">{{year}}</h2>
  {% endif%}
<h3 class="clear center"><a href="{{post.url}}">{{post.data.title}}</a></h3>
<div class="snipet clear"><p>
<span class="h140"><a href="{{post.url}}">{% thumb post, 250 %}</a></span>
<a href="{{post.url}}">{{post.data.description}}</a>
</p></div>
{% endfor %}
