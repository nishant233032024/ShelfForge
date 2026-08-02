require("dotenv").config();

const createApp = require("./app");
const connectDatabase = require("./config/connectDatabase");

async function startServer() {
  const requiredEnvironmentVariables = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLIENT_URL",
  ];

  const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`
    );
  }

  await connectDatabase(process.env.MONGODB_URI);

  const app = createApp();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`ShelfForge API listening on port ${port}`);
  });
}

startServer().catch((startupError) => {
  console.error("Failed to start ShelfForge API", startupError);
  process.exit(1);
});
