const Redis = require("ioredis");

let redis;

try {
  // redis = new Redis();
  // redis.on("error", () => {
  //   console.log("Redis not connected ❌");
  // });
} catch (err) {
  console.log("Redis disabled");
}

module.exports = redis;
