import User from "../Models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const register = async (req, res) => {
  try {
    const { fullName, email, password, requestedRole, adminCode } = req.body;

    let finalRole = "user";

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (requestedRole == "admin") {
      if (Number(adminCode) == Number(process.env.CodeForAdmin)) {
        finalRole = "admin";
      }
    }

    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
      role: finalRole,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await user.save();

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("SignUp Error: ---- ", err);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid Credentials" });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role  },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("login Error: ---- ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { register, login };
