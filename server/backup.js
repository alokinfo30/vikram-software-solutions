/**
 * MongoDB Backup Script
 * Exports all database collections to JSON files
 * 
 * Usage: node backup.js
 * 
 * Make sure MONGODB_URI is set in .env or environment variables
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const backupDir = path.join(__dirname, '..', 'db_backup');

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vikram-software';

async function backupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log('Database:', dbName);
    
    const collections = await db.listCollections().toArray();

    console.log(`Found ${collections.length} collections\n`);

    const backupData = {
      timestamp: new Date().toISOString(),
      database: dbName,
      collections: {}
    };

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Backing up: ${collectionName}...`);

      const documents = await db.collection(collectionName).find({}).toArray();
      
      backupData.collections[collectionName] = documents;
      
      // Also save individual collection files
      const filePath = path.join(backupDir, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2), 'utf8');
      
      console.log(`   ${documents.length} documents saved to ${collectionName}.json`);
    }

    // Save complete backup
    const backupFile = path.join(backupDir, `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');

    console.log(`\nBackup completed successfully!`);
    console.log(`Backup location: ${backupDir}`);
    console.log(`Complete backup: ${path.basename(backupFile)}`);

    // List all backup files
    console.log('\nAvailable backup files:');
    const files = fs.readdirSync(backupDir);
    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   - ${file} (${sizeKB} KB)`);
    });

  } catch (error) {
    console.error('Backup failed:', error.message);
  } finally {
    console.log('\nDisconnected from MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the backup
backupDatabase();
