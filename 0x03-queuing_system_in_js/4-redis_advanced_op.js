const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (err) => {
  console.error("Redis client not connected to the server:", err);
});

const holbertonSchools = {
  Portland: 50,
  Seattle: 80,
  "New York": 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

const setHashValue = (key, field, value) => {
  return new Promise((resolve, reject) => {
    client.hset(key, field, value, (error, reply) => {
      if (error) {
        console.error(`Error setting value for ${field}:`, error);
        reject(error);
      } else {
        console.log(`Value set for ${field}:`, reply);
        resolve(reply);
      }
    });
  });
};

const getAllHashValues = promisify(client.hgetall).bind(client);

(async () => {
  try {
    const promises = Object.entries(holbertonSchools).map(([key, value]) =>
      setHashValue("HolbertonSchools", key, value)
    );

    await Promise.all(promises);

    const result = await getAllHashValues("HolbertonSchools");
    console.log("Hash values in Redis:", result);
    Object.entries(result).forEach(([field, value]) => {
      console.log(`${field}: ${value}`);
    });
  } catch (error) {
    console.error("Error during Redis operations:", error);
  } finally {
    client.quit();
  }
})();
