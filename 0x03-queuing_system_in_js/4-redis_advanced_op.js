const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (err) => {
  console.error("Redis client not connected to the server:", err);
});

// Define the hash object
const holbertonSchools = {
  Portland: 50,
  Seattle: 80,
  "New York": 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

// Function to set hash values using callbacks
const setHashValue = (key, field, value) => {
  client.hset(key, field, value, redis.print);
};

// Function to get all hash values using callbacks
const displayHashValues = (key) => {
  client.hgetall(key, (error, result) => {
    if (error) {
      console.error(`Error retrieving hash values for ${key}:`, error);
    } else {
      console.log(result);
      Object.entries(result).forEach(([field, value]) => {
        console.log(`${field}: ${value}`);
      });
    }
    client.quit(); // Close the Redis client connection
  });
};

// Clear existing data for the key before setting new values
client.del("HolbertonSchools", (err) => {
  if (err) {
    console.error("Error deleting key:", err);
  } else {
    // After clearing the key, store the hash values in Redis
    Object.entries(holbertonSchools).forEach(([field, value]) => {
      setHashValue("HolbertonSchools", field, value);
    });

    // Display the stored hash values from Redis
    displayHashValues("HolbertonSchools");
  }
});
