---
title: Reunionweb
description: L'île de la Réunion à travers ses sites web
image:
keywords: Découverte, Reunion, blog, articles,
---

Découvrez le web réunionnais

{% set section = "section" %}
{% set loop = 0 %}
{% for post in collections.all %}
    {% if post.url.split("/")[1] === "decouverte" %}
      {% if post.url.split("/")[2] %}
{{loop.index}} [{{post.data.title}}]({{post.url}}) ·
      {% endif %}
    {% endif %}
{% endfor %}

{% for page in collections.article %}
  {% if (loop.index <= 2) %}
[{{page.data.title}}]({{page.url}})
{{ page.templateContent | safe | truncate(400) }}
  {% endif %}
{% endfor %}
