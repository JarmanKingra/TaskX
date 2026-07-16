// export const isAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only admins can do this" });
//   }
//   next();
// };

import Team from "../Models/teams.js";

export const isTeamAdmin = async (req, res, next) => {
  try {
    console.log("entered in middleware backend")
    const userId = req.user._id;
    const teamId = req.params.teamId;
    console.log("userId", userId);
    console.log("teamId", teamId);

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required in backend" });
    }

    const team = await Team.findOne({
      _id: teamId,
      members: {
        $elemMatch: {
          user: userId,
          role: "admin",
        },
      },
    });

    if (!team) {
      return res.status(403).json({ message: "Only team admins can do this" });
    }

    next();
  } catch (error) {
    console.error("ADMIN CHECK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
