"""Собирает index.html (самостоятельная страница для любого хостинга) из page.html."""
from pathlib import Path

here = Path(__file__).parent
body = (here / "page.html").read_text(encoding="utf-8")
head_end = body.index("</style>") + len("</style>")
html = (
    '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + body[:head_end] + "\n</head>\n<body>\n" + body[head_end:].strip() + "\n</body>\n</html>\n"
)
(here / "index.html").write_text(html, encoding="utf-8")
print("index.html готов:", len(html), "байт")
