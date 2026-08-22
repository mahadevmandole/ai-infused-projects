import pytest

from app.ai.utils.web_scraper import WebsiteFetchError, _extract_readable_text, _normalize_url


def test_normalize_url_defaults_to_https() -> None:
    assert _normalize_url("example.com") == "https://example.com"


def test_normalize_url_rejects_empty_value() -> None:
    with pytest.raises(ValueError, match="required"):
        _normalize_url("   ")


def test_extract_readable_text_removes_noisy_tags() -> None:
    html = """
    <html>
      <head>
        <title>Example Page</title>
        <style>.hidden { display: none; }</style>
      </head>
      <body>
        <header>Menu</header>
        <main>
          <h1>Useful heading</h1>
          <p>Useful body text.</p>
        </main>
        <script>alert("noise")</script>
      </body>
    </html>
    """

    contents = _extract_readable_text(html)

    assert "Title: Example Page" in contents
    assert "Useful heading" in contents
    assert "Useful body text." in contents
    assert "alert" not in contents
    assert "Menu" not in contents


def test_extract_readable_text_rejects_empty_page() -> None:
    with pytest.raises(WebsiteFetchError, match="readable text"):
        _extract_readable_text("<html><body><script>noise</script></body></html>")
