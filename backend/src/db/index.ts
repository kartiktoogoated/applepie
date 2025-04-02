import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "testdb",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: ["src/db/migrations/*.ts"],
});

export async function initDB() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");
    }   catch (error) {
        console.log("Error during Data source initialization:", error);
    }
}