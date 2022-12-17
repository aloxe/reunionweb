---
title: Tous les Articles
notitle: true
image:
---

_Le principe de ce site est de présenter un ou plusieurs site web en rapport avec l'île de la Réunion chaque mois. Certaines années affichent un peu moins d'articles que prévu parce qu'on ne fait pas toujours ce qu'on veut, que voulez-vous._

# Tous les Articles
{% set year = "year" %}
{% for page in collections.article.reverse() %}
  {% if year === page.date.getFullYear() %}{% else %}{% set year = page.date.getFullYear() %}
## {{year}}
  {% endif%}
- [{{page.data.title}}]({{page.url}})<br>
{{page.data.description}}
{% endfor %}
