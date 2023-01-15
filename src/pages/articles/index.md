---
title: Un lien par mois vers la Réunion
notitle: true
image:
---

_Le principe de ce site est de présenter un ou plusieurs site web en rapport avec l'île de la Réunion chaque mois. Certaines années affichent un peu moins d'articles que prévu parce qu'on ne fait pas toujours ce qu'on veut, que voulez-vous. Au fil du temps les articles se sont donc clairsemés mais en contre-partie, ils se sont étoffés. Aujourd'hui j'essaye d'offrir un éclairage complet sur le thème abordé._

# Tous les Articles
{% set year = "year" %}
{% for post in collections.article.reverse() %}
  {% if year === post.date.getFullYear() %}{% else %}{% set year = post.date.getFullYear() %}
## {{year}}
  {% endif%}
- [{{post.data.title}}]({{post.url}})<br>
{{post.data.description}}
{% endfor %}
