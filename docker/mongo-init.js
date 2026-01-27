// MongoDB initialization script
// This script runs when the MongoDB container is first created

// Switch to admin database to create users
db = db.getSiblingDB('admin');

// Create application user for the edumee database
db = db.getSiblingDB('edumee');

db.createUser({
  user: 'edumee',
  pwd: 'edumee123',
  roles: [
    {
      role: 'readWrite',
      db: 'edumee',
    },
  ],
});

// Create initial collections with validation schemas
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'Email is required and must be a string',
        },
        password: {
          bsonType: 'string',
          description: 'Password is required',
        },
        firstName: {
          bsonType: 'string',
        },
        lastName: {
          bsonType: 'string',
        },
        role: {
          enum: ['user', 'admin', 'mentor', 'employer'],
          description: 'Role must be one of the allowed values',
        },
        isVerified: {
          bsonType: 'bool',
        },
        createdAt: {
          bsonType: 'date',
        },
        updatedAt: {
          bsonType: 'date',
        },
      },
    },
  },
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

print('MongoDB initialization completed successfully!');
