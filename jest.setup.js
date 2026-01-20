// Mock the browser API
global.browser = {
    runtime: {
        sendMessage: jest.fn(),
        onMessage: {
            addListener: jest.fn()
        }
    },
    tabs: {
        query: jest.fn(),
        sendMessage: jest.fn()
    },
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn()
        }
    }
};

// Also mock for Chrome compatibility
global.chrome = global.browser;