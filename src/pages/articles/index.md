---
title: Tous les Articles
image:
---

## les classements:

{% for page in collections.article.reverse() %}
- [{{page.data.title}}]({{page.url}})
{{page.data.description}}
{% endfor %}
