from ..utils.web_scraper import fetch_website_contents


class WebRag:
    def retrieve(self, url: str) -> str:
        return fetch_website_contents(url)
