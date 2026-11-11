jest.mock('../../src/content_scripts/common/runtime.js', () => {
    const actual = jest.requireActual('../../src/content_scripts/common/runtime.js');
    return {
        ...actual,
        RUNTIME: jest.fn(),
    };
});
jest.mock('../../src/content_scripts/ui/llmchat.js', () => jest.fn(() => ({})));

describe('search alias icons', () => {
    let RUNTIME;
    let omnibar;
    let front;

    beforeEach(() => {
        jest.resetModules();
        localStorage.clear();
        document.body.replaceChildren();
        const ui = document.createElement('div');
        ui.id = 'sk_omnibar';
        const searchArea = document.createElement('div');
        searchArea.id = ['sk', 'omnibarSearchArea'].join('_');
        searchArea.innerHTML = '<span class="prompt"></span><span class="resultPage"></span>';
        const results = document.createElement('div');
        results.id = ['sk', 'omnibarSearchResult'].join('_');
        ui.append(searchArea, results);
        document.body.append(ui);

        RUNTIME = require('../../src/content_scripts/common/runtime.js').RUNTIME;
        const createOmnibar = require('../../src/content_scripts/ui/omnibar.js').default;
        front = {
            _actions: {},
            topOrigin: 'https://page.example',
            contentCommand: jest.fn(),
            hidePopup: jest.fn(),
        };
        omnibar = createOmnibar(front, {write: jest.fn()});
    });

    test('does not fetch a favicon just because an alias is registered', () => {
        front._actions.addSearchAlias({
            alias: 'g',
            prompt: 'Google',
            url: 'https://www.google.com/search?q=',
        });

        expect(RUNTIME).not.toHaveBeenCalledWith('requestImage', expect.anything(), expect.anything());
        expect(omnibar.searchAliases().g.prompt).toContain('Google');
    });

    test('fetches a favicon only when the user explicitly configures one', () => {
        front._actions.addSearchAlias({
            alias: 'custom',
            prompt: 'Custom',
            url: 'https://search.example/?q=',
            options: {favicon_url: 'https://icons.example/custom.png'},
        });

        expect(RUNTIME).toHaveBeenCalledWith(
            'requestImage',
            {url: 'https://icons.example/custom.png'},
            expect.any(Function),
        );
    });
});
