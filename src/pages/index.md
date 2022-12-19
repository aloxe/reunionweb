---
title: Reunionweb
description: L'île de la Réunion à travers ses sites web
image: "/img/tete-2006.png"
keywords: Découverte, Reunion, blog, articles,
---

{% for page in collections.article %}
  {% if (loop.index < 2) %}
# [{{page.data.title}}]({{page.url}})
{{ page.templateContent | safe | truncate(400) }}
  {% endif %}
{% endfor %}
…[lire la suite]({{page.url}})

[tous les articles]({{ "articles" | url }})

# Découvrez l'île de la Réunion

<div class="twocolumns">
{% for post in collections.all %}
    {% if post.url.split("/")[1] === "decouverte" and post.url.split("/")[2] and not post.url.split("/")[3] %}
__[{{post.data.hometitle}}]({{post.url}})__<br>{{post.data.homedesc}}
    {% endif %}
{% endfor %}
</div>

<div class="clear"></div>
