import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "appliepie-producer", brokers: ["localhost:9092"]});
const producer = kafka.producer();
await producer.connect();

export const sendEvent = async (topic: string, data: any) => {
    await producer.send({ topic, messages: [{ value: JSON.stringify(data) }] });
};

const consumer = kafka.consumer({ groupId: "applepie-consumer" });
await consumer.connect();
await consumer.subscribe({ topic: "user-events", fromBeginning: true });

consumer.run({
    eachMessage: async ({ message }) => {
        console.log("Processing event:", message.value?.toString());
    },
});