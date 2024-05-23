'use strict'
import mongoose from 'mongoose'
import config from '@/config/app.config';
import { countConnect } from "@/utils/function";

const { db: { scheme, username, password, host, database, port, options } } = config;
const getMongodbUri = () => {
    if (scheme === 'mongodb+srv' && !!username && !!password) {
        return `mongodb+srv://${username}:${password}@${host}/${database}${!!options ? options : ''}`
    }
    if (!!username && !!password && port) {
        return `mongodb://${username}:${password}@${host}:${port}/${database}${!!options ? options : ''}`
    }
    return `mongodb://${host}:${port}/${database}${!!options ? options : ''}`
}

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(getMongodbUri());
            console.log('Connected to the database');
            console.log(`Number of connections:: ${countConnect()}`)
        } catch (error) {
            console.error('Error connecting to the database:', error.message);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;