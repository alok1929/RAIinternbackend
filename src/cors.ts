import cors from "cors";

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "your-production-domain.com",
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
