import mongoose from "mongoose";

const drivedSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      unique: true,
      required: false
    },

    employeeName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: false,
    },

    site: {
      type: [String],
      required: false,
    },

    img: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate deviceId if not provided
drivedSchema.pre("save", async function (next) {
  if (!this.deviceId) {
    this.deviceId = `DEV${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export const EmployeesModel = mongoose.model("employees", drivedSchema);
