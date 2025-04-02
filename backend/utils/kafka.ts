import { Kafka } from "kafkajs";

// Create Kafka instance and producers/consumers
const kafka = new Kafka({ clientId: "appliepie-producer", brokers: ["localhost:9092"] });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "applepie-consumer" });

// 1) An init function to connect producer & consumer
export async function initKafka() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "user-events", fromBeginning: true });
  consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Processing event:", message.value?.toString());
    },
  });
}

// 2) A function to send events using the connected producer
export async function sendEvent(topic: string, data: any) {
  await producer.send({ topic, messages: [{ value: JSON.stringify(data) }] });
}
