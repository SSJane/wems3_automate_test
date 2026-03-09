import { ConsoleMessage, Page } from "@playwright/test";

export async function expectNoConsoleErrors(page: Page, callback: () => Promise<void>) {
    const errors: string[] = [];

    const consoleListener = (msg: ConsoleMessage) =>{
        if (msg.type() === 'error' || msg.type() ==='warning'){
            errors.push(`Console ${msg.type()} : ${msg.text()} (${msg.location().url}:${msg.location().lineNumber})`)
        }
    };

    const pageErrorListener = (error: Error) => {
        errors.push(`Uncaught exception: ${error.message}\n${error.stack}`);
    }

    page.on('console', consoleListener);
    page.on('pageerror', pageErrorListener);

    try {
       await callback(); 
    } catch (error) {
        if (errors.length > 0) {
            throw new Error(`Found ${errors.length} console errors/warnings:\n` + errors.join('\n'));
        }
    } finally {
        page.removeListener('console', consoleListener);
        page.removeListener('pageerror', pageErrorListener);
    }
}