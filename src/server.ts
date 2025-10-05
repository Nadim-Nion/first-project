import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
// const mongoose = require('mongoose');
// const port = 5000;
import { Server } from 'http';
import seedSuperAdmin from './app/db';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    await seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`My first project listening on port ${config.port} 😊`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection is detected. Server is Shutting down... 😈');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught Exception is detected. Server is Shutting down... 😈');

  process.exit(1);
});

// Promise.reject();
// console.log(x);
