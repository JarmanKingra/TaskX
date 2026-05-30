import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Team from "../src/Models/teams.js";

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const teams = await Team.find();

    for (const team of teams) {
      team.members.forEach((member) => {
        if (member.role === "user") {
          member.role = "member";
        }
      });

      await team.save();
      console.log(team);

    //   console.log(`Updated team: ${team.name}`);
    }

    console.log("Migration completed");
    process.exit(0);
  } 
  catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();


// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import Team from "../src/Models/teams.js";

// async function migrate() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     const result = await Team.collection.updateMany(
//       {},
//       {
//         $unset: {
//           admin: "",
//         },
//       }
//     );

//     console.log(result);

//     process.exit(0);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }

// migrate();