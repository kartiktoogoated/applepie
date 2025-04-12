export async function safeTransaction(task : () => Promise<void>) {
    for (let i = 0; i<3; i++) {
        try {
            await task();
            break;
        } catch (err:any) {
            if (err.code === 'P2034') {
                console.log(`⚠️ Deadlock occurred. Retrying attempt ${i + 1}`);
                continue;
            }
            throw err;
        }
    }
}