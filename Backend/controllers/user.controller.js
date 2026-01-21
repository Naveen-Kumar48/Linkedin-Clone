import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import { connections } from "mongoose";

//* function to convert user data to pdf
const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath =
    "uploads/" + crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream(outputPath);

  doc.pipe(stream);

  if (userData.userId?.profilePicture) {
    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
    });
  }

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Post: ${userData.currentPost}`);

  doc.fontSize(14).text(`Past Work Experience:`);

  userData.pastwork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name:${work.company}`);
    doc.fontSize(14).text(`Position:${work.position}`);
    doc.fontSize(14).text(`Years:${work.years}`);
  });

  doc.end();
  return outputPath;
};

//*Api to register user
export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();
    return res.json({ message: "User Created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//*Api to   log  in user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token: token });
    res.json({
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// *API  for the upload profile picture
export const uploadprofilepic = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;

    await user.save();
    res.json({
      message: "Profile picture uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// *Api to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await user.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res
          .status(400)
          .json({ message: "Username or email already Exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// *Api for getting user profile
export const getUserProfile = async (req, res) => {
  try {
    const { token } = req.query;
    // console.log(`Token:${token}`)
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default updateUserProfile;

//* Api for  update userProfile Data

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.json({ message: "Profile Data Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// *Api to get all the user data
export const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture"
    );
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// *Api to download the profile resume

export const downloadProfile = async (req, res) => {
  const user_Id = req.query.id;
  const userProfile = await Profile.findOne({ userId: user_Id }).populate(
    "userId",
    "name email username profilePicture"
  );

  let outputPath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputPath });
};




// *Api for the user Connection request

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User Not  Found" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({
        message: "Connection User is not found",
      });
    }
    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request Already  sent",
      });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    return res.json({ message: "Request Sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//*  Get my connection requests

export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({
      token: token,
    });
    if (!user) {
      return res.status(500).json({
        message: "User not Found ",
      });
    }
    const connection = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({
      connections,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const whatAreMyConnections = async (req, res) => {
  try {
    const { token } = req.body;
    if (!user) {
      return res.status(404).res.json({
        message: "User not found",
      });
    }
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json(connections);
  } catch (err) {
    return res.status(500).json({
      messasge: err.message,
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token })
    if (!user) return res.status(404).json({
      message: "User not found"
    })

    const connection = await ConnectionRequest.findOne({ _id: requestId })

    if (!connection) {
      return res.json(404).json({
        message: "Connection not found"
      })
    }
    if (action_type === "accept") {
      connection.status_accepted = true;

    } else {
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({
      message: "Request Updated"
    })
  } catch (error) {
    return res.status(500).json({
      message: err.message
    })
  }
};


//*Api for the Get user profile and user name based on the username
export const getUserProfileAndUserBasedOnUsername = async (req, res) => {

  const { username } = req.query;
  try {
    const user = await User.findOne({
      username
    })
    if (!user) {
      return res.status(404).json({
        message: "User Not found"
      })
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      'userId', "name username email profilePicture"
    )
    return res.json({
      "profile": userProfile
    })
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}