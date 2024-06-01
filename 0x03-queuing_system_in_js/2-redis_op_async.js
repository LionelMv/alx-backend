import { createClient, print } from "redis";
import { promisify } from "util";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (err) => {
  console.log("Redis client not connected to the server:", err.toString());
});

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

const getAsync = promisify(client.get).bind(client);

const displaySchoolValue = async (schoolName) => {
  try {
    const res = await getAsync(schoolName);
    console.log(res);
  } catch (error) {
    console.error("Error retrieving school value:", error);
  }
};

async function main() {
  await displaySchoolValue("Holberton");
  setNewSchool("HolbertonSanFrancisco", "100");
  await displaySchoolValue("HolbertonSanFrancisco");
}

client.on("connect", main);
