import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../src/Models/teams.js";

dotenv.config();

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const teams = await Team.find();
    console.log(`Found ${teams.length} teams`);

    for (const team of teams) {
      let updated = false;
      const newMembers = [];

      for (const m of team.members) {
        // OLD FORMAT: ObjectId
        if (mongoose.Types.ObjectId.isValid(m)) {
          newMembers.push({
            user: m,
            role: "user",
          });
          updated = true;
        }

        // NEW FORMAT: already correct
        else if (m?.user) {
          newMembers.push(m);
        }
      }

      if (updated) {
        team.members = newMembers;
        await team.save();
        console.log(`🔁 Migrated team: ${team.name}`);
      }
    }

    console.log("🎉 Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

runMigration();
