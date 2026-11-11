# Privacy and network behavior

This fork does not send analytics or usage telemetry to its maintainers. It also removes the upstream uninstall survey URL. Review the source and workflow for each release; the Chromium ZIP is built from the tagged repository checkout and is not uploaded to a browser store.

## Findings from upstream issue review

- [Issue #1796](https://github.com/brookhong/Surfingkeys/issues/1796) documented a Chrome Web Store release that added a `smartwebfinders.com` search provider even though that change was not initially present in the repository. The current source manifest and Chromium build configuration contain no search-provider override or reference to that domain. This fork's release workflow builds its ZIP from the visible tag instead of publishing a separate store package.
- [Issue #712](https://github.com/brookhong/Surfingkeys/issues/712) discussed Google Analytics in an older manifest. The current source has no Google Analytics script, analytics CSP allowance, or analytics request. The bundled PDF.js code may dispatch internal telemetry events, but the bundled extension's `reportTelemetry` implementation is a no-op.
- [Issue #2448](https://github.com/brookhong/Surfingkeys/issues/2448) reported that registering search aliases fetched their favicons automatically, which could contact search providers on page load, including in private windows. This fork no longer derives or fetches favicons automatically. A remote icon is fetched only when a user explicitly supplies an HTTP(S) `favicon_url` in an alias configuration.
- [Issue #1917](https://github.com/brookhong/Surfingkeys/issues/1917) asked what browsing data the extension sends out. This fork does not collect or report browsing activity to its maintainers. Feature-driven requests still happen when users choose them, as described below.
- [Issue #2291](https://github.com/brookhong/Surfingkeys/issues/2291) reported that releasing a key in a newly selected tab can deliver a `keyup` event to that tab even when its page did not receive the matching `keydown`. This is an input-isolation bug, not telemetry; this fork does not change that behavior, so a page may trigger a shortcut from a key held while switching tabs.

## Requests that remain

- Search suggestions send the text entered into the omnibar to the suggestion URL configured for the selected search alias, after that alias is opened. Search navigation sends the query to the chosen search engine.
- LLM chat sends the page text or prompt needed for a request to the provider configured by the user, when the user starts a chat. Ollama requests can stay on the user's machine; hosted providers receive requests over their configured service.
- Users can configure remote settings, scripts, search engines, and favicons. Those destinations and any behavior in user-provided JavaScript are controlled by the user's configuration, not by this fork.
- Browser features such as opening a link, loading a PDF, or fetching a page requested by the user make the normal network requests needed for that action.

Surfingkeys needs broad access to pages and browser data to provide its navigation, tab, bookmark, history, and page tools. Only install a build you have reviewed and trust. The extension's permissions and user-configured JavaScript remain security-sensitive even when the fork has no maintainer telemetry.
