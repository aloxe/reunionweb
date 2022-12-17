---
title: Tous les Articles
image:
---

 Le principe du site est de faire un article par mois sur l'île de la Réunion. Certaines années en présentent un peu moins que prévu parce qu'on ne fait pas toujours ce qu'on veut, que voulez-vous. Cela vous laisse quand même un peu de lecture si vous remontez jusqu'à 1997.

## La liste:
{% set year = "year" %}
{% for page in collections.article.reverse() %}
  {% if year === page.date.getFullYear() %}{% else %}{% set year = page.date.getFullYear() %}
    ## {{year}}
  {% endif%}
- [{{page.data.title}}]({{page.url}})<br>
{{page.data.description}}
{% endfor %}
