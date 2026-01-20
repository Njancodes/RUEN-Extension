import {
    isEncryptedMessage,
    decryptMessage,
    decryptChatMessages
} from '../content.js';

describe('Content Script Tests', () => {

    beforeEach(()=>{
        jest.clearAllMocks();
        document.body.innerHTML = '';
    })

    describe('isEncryptedMessage function', () => {
        test('should identify encrypted messages', async () => {
            const el = document.createElement('div');
            el.textContent = 'ENC:cipher';

            expect(isEncryptedMessage(el)).toBe(true);
        })
        test('should return false for non-encrypted messages', () => {
            const element = document.createElement('div');
            element.textContent = 'Normal message';

            expect(isEncryptedMessage(element)).toBe(false);
        });
        test('should return false for empty messages', () => {
            const element = document.createElement('div');
            element.textContent = '';

            expect(isEncryptedMessage(element)).toBe(false);
        });
    })

    describe('decryptMessage', () => {
        test('should decrypt message and update DOM', async () => {
            const element = document.createElement('div');
            element.textContent = 'ENC:abc123';

            browser.runtime.sendMessage.mockResolvedValue({ plain: 'Hello World' });

            await decryptMessage(element, 'test-key');

            expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
                state: 'decrypt',
                clientMessage: 'abc123',
                inversekey: 'test-key'
            });
            expect(element.textContent).toBe('Hello World');
        });
        test('should handle decryption errors gracefully', async () => {
            const element = document.createElement('div');
            element.textContent = 'ENC:abc123';
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            browser.runtime.sendMessage.mockRejectedValue(new Error('Decryption failed'));

            await decryptMessage(element, 'test-key');

            // Message should remain unchanged on error
            expect(element.textContent).toBe('ENC:abc123');
            expect(consoleErrorSpy).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });
    })

    describe('decryptChatMessages', () => {
        test('should decrypt all encrypted messages', async () => {
            // Setup DOM
            document.body.innerHTML = `
                <div id="main">
                    <div data-scrolltracepolicy="wa.web.conversation.messages">
                        <div data-testid="selectable-text">ENC:cipher1</div>
                        <div data-testid="selectable-text">Normal message</div>
                        <div data-testid="selectable-text">ENC:cipher2</div>
                    </div>
                </div>
            `;

            browser.runtime.sendMessage
                .mockResolvedValueOnce({ plain: 'Decrypted 1' })
                .mockResolvedValueOnce({ plain: 'Decrypted 2' });

            await decryptChatMessages('test-key');

            expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(2);

            const messages = document.querySelectorAll('[data-testid="selectable-text"]');
            expect(messages[0].textContent).toBe('Decrypted 1');
            expect(messages[1].textContent).toBe('Normal message');
            expect(messages[2].textContent).toBe('Decrypted 2');
        });
        test('should handle no encrypted messages', async () => {
            document.body.innerHTML = `
                <div id="main">
                    <div data-scrolltracepolicy="wa.web.conversation.messages">
                        <div data-testid="selectable-text">Normal message 1</div>
                        <div data-testid="selectable-text">Normal message 2</div>
                    </div>
                </div>
            `;

            await decryptChatMessages('test-key');

            expect(browser.runtime.sendMessage).not.toHaveBeenCalled();
        });
        test('should handle empty message list', async () => {
            document.body.innerHTML = '<div id="main"></div>';

            await decryptChatMessages('test-key');

            expect(browser.runtime.sendMessage).not.toHaveBeenCalled();
        });
    });

})