import jwt from 'jsonwebtoken';
import Invite from '../models/Invitation.model.js'; // assuming this exists
import { sendEmail } from '../lib/sendEmail.js'; // your email service
import Project from '../models/Project.model.js';
import User from '../models/User.model.js'

export const sendInvite = async (req, res) => {
  const { email, role, projectId } = req.body;

  //token with 1 day expiry
  const token = jwt.sign(
    { email, role, projectId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  //Construct Invite link
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${token}`;
  const project = await Project.findById(projectId).select("name");


  // Send email
  await sendEmail(
    email,
    `You’ve been invited to join the ${project.name}!`,
    `<p>Click <a href="${inviteLink}">here</a> to join the project.</p>`
  );
  

  // save to DB for tracking
  await Invite.create({ email, token, role, project: projectId });

  console.log("Signing token with secret:", process.env.JWT_SECRET);
  console.log("Generated token:", token);


  res.status(200).json({ message: 'Invite sent' });
};

export const acceptInvite = async (req, res) => {
  const { token } = req.params;
  const userId = req.user._id;

  try {
    console.log("Verifying token with secret:", process.env.JWT_SECRET);
    console.log("Token being verified:", token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role, projectId } = decoded;

    console.log("decoded", decoded);

    if (req.user.email !== email) {
      return res.status(403).json({ message: "This invite doesn't match your account." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const alreadyInTeam = project.team.some(member => member.user.equals(userId));
    if (alreadyInTeam) {
      return res.status(400).json({ message: "Already part of the team." });
    }

    project.team.push({ user: userId, role });
    await project.save();

    const inviteDeleted = await Invite.findOneAndDelete({ token });
    if (!inviteDeleted) {
      return res.status(404).json({ message: "Invite record not found or already used." });
    }

    return res.status(200).json({ message: 'Successfully joined the project!' });
  } catch (err) {
    console.error("JWT verification or processing failed:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: 'Invite token has expired.' });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: 'Invalid invite token.' });
    }
    // fallback
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};



export const getInviteInfo = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role, projectId } = decoded;

    const user = await User.findOne({ email });

    const hasAccount = !!user; // returns true or false
    const project = await Project.findById(projectId).select("name");


    res.status(200).json({
      email,
      role,
      projectId,
      projectName: project?.name || "",
      hasAccount,
    });
  } catch (err) {
    console.error("Invalid invite token:", err.message);
    res.status(400).json({ message: 'Invalid or expired invite link.' });
  }
};
