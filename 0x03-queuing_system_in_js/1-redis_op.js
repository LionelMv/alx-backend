import { createClient } from "redis";

const client = createClient();

client
  .on("connect", () => {
    console.log("Redis client connected to the server");
  })
  .on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
  });

const setNewSchool = (schoolName, value, callback) => {
  client.set(schoolName, value, (error) => {
    if (error) {
      console.error(`Error setting value for school "${schoolName}":`, error);
    } else {
      console.log("School");
      callback();
    }
  });
};

const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (error, result) => {
    if (error) {
      console.error(`Error getting value for school "${schoolName}":`, error);
    } else {
      console.log(`Reply: ${result}`);
    }
  });
};

setNewSchool("HolbertonSanFrancisco", "100", () => {
  displaySchoolValue("HolbertonSanFrancisco");
});
