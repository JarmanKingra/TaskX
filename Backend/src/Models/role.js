import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permissions",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Same role name can exist in different teams, but not twice in one team
roleSchema.index({ team: 1, name: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);
export default Role;
