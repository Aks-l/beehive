export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return
    }

    const { installJsonConsoleLogger } = await import('./utils/jsonLogger')
    installJsonConsoleLogger()
}
