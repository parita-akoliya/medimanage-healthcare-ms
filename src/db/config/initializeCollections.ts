import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export const initializeCollections = async () => {
    const modelsPath = path.join(__dirname, '../models');
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.models.ts'));

    try {
        const existingCollections = await mongoose.connection.db.listCollections().toArray();
        const existingCollectionNames = existingCollections.map(col => col.name);

        for (const file of modelFiles) {
            const model = require(path.join(modelsPath, file));
            const modelName = Object.keys(model)[0];
            const mongooseModel = model[modelName];

            if (!existingCollectionNames.includes(mongooseModel.collection.name)) {
                await mongooseModel.createCollection();
                console.log(`Collection for ${modelName} created.`);
            } else {
                console.log(`Collection for ${modelName} already exists, skipping creation.`);
            }
        }
    } catch (error) {
        console.error('Error initializing collections:', error);
    }
};
