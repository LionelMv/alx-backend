import { createClient, print } from "redis";

const client = createClient();

client
  .on("connect", () => {
    console.log("Redis client connected to the server");
  })
  .on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
  });

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print); // Use redis.print to log the result
};

const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (error, result) => {
    if (error) {
      console.error(`Error getting value for school "${schoolName}":`, error);
    } else {
      console.log(result);
    }
  });
};

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
