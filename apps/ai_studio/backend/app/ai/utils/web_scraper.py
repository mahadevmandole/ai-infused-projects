"""Utilities for safely fetching readable text from public web pages."""

from __future__ import annotations

import ipaddress
import socket
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

DEFAULT_TIMEOUT_SECONDS = 15
MAX_RESPONSE_BYTES = 1_000_000

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


class WebsiteFetchError(RuntimeError):
    """Raised when a website cannot be fetched or parsed safely."""


def fetch_website_contents(
    url: str,
    *,
    timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS,
    max_response_bytes: int = MAX_RESPONSE_BYTES,
) -> str:
    """Fetch a public web page and return clean text for summarization.

    The function is intentionally small and explicit:

    - missing schemes are treated as HTTPS URLs
    - only HTTP and HTTPS URLs are allowed
    - localhost, private IPs, and other non-public addresses are blocked
    - responses are capped to avoid downloading unexpectedly large pages
    - non-HTML responses are rejected
    - noisy tags such as scripts, styles, navigation, and forms are removed

    Args:
        url: Website URL to fetch. Values like ``example.com`` are normalized to
            ``https://example.com``.
        timeout_seconds: Network timeout for the fetch request.
        max_response_bytes: Maximum number of response bytes to read.

    Returns:
        A plain-text string containing the page title and cleaned page contents.

    Raises:
        ValueError: If the URL is empty, unsupported, or points to a non-public host.
        WebsiteFetchError: If the page cannot be fetched, is not HTML, or has no readable text.
    """

    normalized_url = _normalize_url(url)
    _ensure_public_http_url(normalized_url)

    html = _fetch_html(
        normalized_url,
        timeout_seconds=timeout_seconds,
        max_response_bytes=max_response_bytes,
    )
    return _extract_readable_text(html)


def _normalize_url(url: str) -> str:
    """Return a URL with a scheme so parsing and validation are predictable."""

    normalized = url.strip()
    if not normalized:
        raise ValueError("Website URL is required.")

    if not normalized.startswith(("http://", "https://")):
        normalized = f"https://{normalized}"

    return normalized


def _ensure_public_http_url(url: str) -> None:
    """Validate that the URL uses HTTP(S) and resolves to a public address."""

    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http:// and https:// URLs are supported.")

    if not parsed.hostname:
        raise ValueError("URL must include a hostname.")

    _ensure_public_hostname(parsed.hostname)


def _ensure_public_hostname(hostname: str) -> None:
    """Block localhost, private IPs, loopback IPs, and other non-public hosts."""

    if hostname.lower() == "localhost":
        raise ValueError("Localhost URLs are not allowed.")

    try:
        ip_addresses = [ipaddress.ip_address(hostname)]
    except ValueError:
        try:
            ip_addresses = [
                ipaddress.ip_address(result[4][0]) for result in socket.getaddrinfo(hostname, None)
            ]
        except socket.gaierror as exc:
            raise ValueError(f"Could not resolve hostname: {hostname}") from exc

    if any(not ip_address.is_global for ip_address in ip_addresses):
        raise ValueError("URL must resolve to a public internet address.")


def _fetch_html(url: str, *, timeout_seconds: int, max_response_bytes: int) -> str:
    """Download a bounded HTML response and decode it with the response charset."""

    request = Request(url, headers=HEADERS, method="GET")

    try:
        with urlopen(request, timeout=timeout_seconds) as response:
            content_type = response.headers.get("content-type", "")
            if "html" not in content_type.lower():
                raise WebsiteFetchError("URL did not return an HTML page.")

            raw_html = response.read(max_response_bytes + 1)
            if len(raw_html) > max_response_bytes:
                raise WebsiteFetchError("Website response is too large to summarize safely.")

            charset = response.headers.get_content_charset() or "utf-8"
            return raw_html.decode(charset, errors="replace")
    except HTTPError as exc:
        raise WebsiteFetchError(f"Website returned HTTP {exc.code}.") from exc
    except URLError as exc:
        raise WebsiteFetchError(f"Could not fetch website: {exc.reason}") from exc
    except TimeoutError as exc:
        raise WebsiteFetchError("Website fetch timed out.") from exc


def _extract_readable_text(html: str) -> str:
    """Parse HTML, remove noisy tags, and return compact readable page text."""

    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.get_text(" ", strip=True) if soup.title else "No title found"

    for tag in soup(
        [
            "script",
            "style",
            "noscript",
            "svg",
            "nav",
            "footer",
            "header",
            "aside",
            "form",
            "img",
            "input",
            "button",
        ]
    ):
        tag.decompose()

    lines = [line.strip() for line in soup.get_text(separator="\n").splitlines()]
    text = "\n".join(line for line in lines if line)

    if not text:
        raise WebsiteFetchError("Website page did not contain readable text.")

    return f"Title: {title}\n\nPage contents:\n{text}"
