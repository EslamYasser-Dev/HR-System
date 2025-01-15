import "dotenv/config.js";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";
import dBConnection from "./services/MongoDBConnection.js";
import employeesRouter from "./routes/employeesRoutes.js";
import userConfigRouter from "./routes/configRoutes.js";
import deviceRouter from "./routes/deviceRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import compression from "compression";

const app = express();
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ limit: "6mb", extended: true }));
app.use(cors({ origin: "*" }));
app.use(compression());

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Up & Running");
});

io.on("connection", () => {
  console.log("A new connection has been established");
});

// Database connection
(async () => {
  try {
    await dBConnection();
    console.log("✅ Database working");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

// API routes
app.use("/v1/api/employees", employeesRouter);
app.use("/v1/api/config", userConfigRouter);
app.use("/v1/api/devices", deviceRouter);
app.use("/v1/api/attendance", attendanceRouter);

// Start server
const port = process.env.PORT || 3362;
httpServer.listen(port, () => {
  console.log(
    `🟢 Server is running on:\n\thttp://localhost:${port}\n=============================================================================\n`
  );
});
