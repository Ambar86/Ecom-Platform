// TypeScript: Add type declaration for global.mongooseConn and global.mongoosePromise
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: typeof mongoose | null | undefined;
  var mongoosePromise: Promise<typeof mongoose> | null | undefined;
}
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
if (!global.mongooseConn) {
  global.mongooseConn = null;
}
if (!global.mongoosePromise) {
  global.mongoosePromise = null;
}

async function connectDB() {
  if (global.mongooseConn) {
    return global.mongooseConn;
  }
  if (!global.mongoosePromise) {
    const opts = { bufferCommands: false };
    global.mongoosePromise = mongoose.connect(MONGODB_URI, opts);
  }
  try {
    global.mongooseConn = await global.mongoosePromise;
  } catch (e) {
    global.mongoosePromise = null;
    throw e;
  }
  return global.mongooseConn;
}

export default connectDB;
