import axios from 'axios';

export const sendWebhook = async (url: string, data:object) => {
    try {
        await axios.post(url, data);
    } catch (error:any) {
        console.error("Webhook failed", error);
    }
};