const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const User = require('../models/User');
const Moderator = require('../models/Moderator');
const Company = require('../models/Company');



//CSV Handlers
const { receiveManagerCSV } = require('../csv_handlers/users/addManagerCSV');
const { sendManagerCSV } = require('../csv_handlers/users/sendManagerCSV');
const { receiveModeratorCSV } = require('../csv_handlers/users/addModeratorCSV');
const { sendModeratorCSV } = require('../csv_handlers/users/sendModeratorCSV');

//CSV Caller
exports.receiveManagerCSV = receiveManagerCSV;
exports.sendManagerCSV  = sendManagerCSV;
exports.receiveModeratorCSV = receiveModeratorCSV;
exports.sendModeratorCSV  = sendModeratorCSV;

// Admin methods
exports.registerAdmin = async (req, res) => {
  const { profileId, adminName, role, department, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    admin = new Admin({ profileId, adminName, role, department, email, password });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    const payload = { admin: { id: admin.id } };

    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  console.log("login req as admin", req.body)

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { admin: { id: admin.id } };

    jwt.sign(payload,"7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      const { profileId, adminName, email, role, department } = admin;
      console.log({ token, admin: { profileId, adminName, email, role, department }});
      res.json({ token, admin: { profileId, adminName, email, role, department } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateAdmin = async (req, res) => {
  const { adminName, role, department, email, password } = req.body;

  const updateFields = { adminName, role, department, email, password };

  try {
    let admin = await Admin.findById(req.params.id);

    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    admin = await Admin.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Admin removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Manager methods
exports.registerManager = async (req, res) => {
  console.log(req.body);
  const {managerId, managerName, password, designation, section, appointment, allProductReport, demandReceived, issueProduct} = req.body;

  try {
    let manager = await Manager.findOne({ managerId });

    if (manager) {
      return res.status(400).json({ msg: 'Manager already exists' });
    }

    manager = new Manager({managerId, managerName, password, designation, section, appointment, allProductReport, demandReceived, issueProduct});

    // const salt = await bcrypt.genSalt(10);
    // manager.password = await bcrypt.hash(password, salt);

    await manager.save();

    const payload = { manager: { id: manager.id } };

    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({success:true});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginManager = async (req, res) => {
  const { managerId, password } = req.body;

  console.log("login req as manager", req.body)

  try {
    let manager = await Manager.findOne({ managerId });

    if (!manager) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }


    if (manager.password !== password) {
      console.log(manager.password,"not matched with",password);
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { manager: { id: manager.id } };

    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      const { managerId, managerName, password, designation, section, appointment, allProductReport, demandReceived, issueProduct } = manager;
      res.json({ token,success:true, managerData: { managerId, managerName, password, designation, section, appointment, allProductReport, demandReceived, issueProduct } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    // console.log(req.body);
    const managers = await Manager.find();
    res.json(managers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getManagerById = async (req, res) => {
  try {
    // console.log(req.body);
    const manager = await Manager.findById(req.params.id);
    if (!manager) return res.status(404).json({ msg: 'Manager not found' });
    res.json(manager);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateManager = async (req, res) => {

  console.log(req.body);

  const {
    managerId,
    managerName,
    password,
    designation,
    section,
    appointment,
    allProductReport,
    demandReceived,
    issueProduct,
  } = req.body;

  const updateFields = {
    managerId,
    managerName,
    password,
    designation,
    section,
    appointment,
    allProductReport,
    demandReceived,
    issueProduct,
  };

  try {
    let manager = await Manager.findOne({ managerId: updateFields.managerId });

    if (!manager) {
      console.log("Manager not found")
      return res.status(404).json({ msg: 'Manager not found' });
    }

    // Update the manager document with the new fields
    manager = await Manager.findOneAndUpdate(
      { managerId: updateFields.managerId },
      { $set: updateFields },
      { new: true }
    );

    res.json({manager,success:true});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteManager = async (req, res) => {
  const { managerId } = req.body;  // Assuming the managerId is sent in the body

  try {
    const manager = await Manager.findOneAndDelete({ managerId });

    if (!manager) {
      console.log("Manager not found");
      return res.status(404).json({ msg: 'Manager not found' });
    }

    res.json({ msg: 'Manager removed successfully', success:true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// User methods
exports.registerUser = async (req, res) => {
  const { userId, userName, password, designation, section, appointment } = req.body;

 

  try {
    let user = await User.findOne({ userId });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ userId, userName, password, designation, section, appointment });

    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token ,success:true});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;

  console.log("login req as user", req.body)

  // const userId=email;


  try {
    console.log("finding USER ID: ",userId)
    let user = await User.findOne({ userId });
    console.log("USER FOUND")


    if (!user || user.password !== password) {
      console.log(user.password,"not matched with",password);
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload, 
      "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", 
      { expiresIn: 3600 }, 
      (err, token) => {
        if (err) throw err;
        const { userId, userName, designation, section, appointment } = user;
        res.json({ token, user: { userId, userName, designation, section, appointment },success:true });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUser = async (req, res) => {
  console.log(req.body);

  const {
    userId, userName, password, designation, section, appointment,
  } = req.body;

  const updateFields = {
    userId, userName, password, designation, section, appointment,
  };

  try {
    let user = await User.findOne({ userId: updateFields.userId });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user document with the new fields
    user = await User.findOneAndUpdate(
      { userId: updateFields.userId },
      { $set: updateFields },
      { new: true }
    );

    res.json({ user, success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body; 

  try {
    const user = await User.findOneAndDelete({ userId });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User removed successfully', success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


//Moderator 
exports.registerModerator = async (req, res) => {
  const { moderatorId, moderatorName, password, designation, section, appointment } = req.body;

  console.log("Req to register new modertor")

  try {
    let moderator = await Moderator.findOne({ moderatorId });

    if (moderator) {
      return res.status(400).json({ msg: 'Moderator already exists' });
    }

    moderator = new Moderator({ moderatorId, moderatorName, password, designation, section, appointment });
    await moderator.save();
    const payload = { moderator: { id: moderator.id } };
    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({success:true});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginModerator = async (req, res) => {
  const { moderatorId, password } = req.body;

  console.log("login req as Moderator", req.body)

  try {
    console.log("finding Moderator: ",moderatorId)
    let moderator = await Moderator.findOne({ moderatorId });
    console.log("Moderator FOUND")


    if (!moderator || moderator.password !== password) {
      console.log(moderator.password,"not matched with",password);
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { moderator: { id: moderator.id } };

    jwt.sign(
      payload, 
      "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", 
      { expiresIn: 3600 }, 
      (err, token) => {
        if (err) throw err;
        const { moderatorId, moderatorName, designation, section, appointment } = moderator;
        res.json({ token, moderator: { moderatorId, moderatorName, designation, section, appointment },success:true });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllModerator = async (req, res) => {
  try {
    console.log("Receive req for moderators")
    const moderators = await Moderator.find();
    console.log("RESPONSE: ",moderators)
    res.json(moderators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateModerator = async (req, res) => {
  console.log(req.body);

  const {
    moderatorId, moderatorName, password, designation, section, appointment,
  } = req.body;

  const updateFields = {
    moderatorId, moderatorName, password, designation, section, appointment,
  };

  try {
    let moderator = await Moderator.findOne({ moderatorId: updateFields.moderatorId });

    if (!moderator) {
      console.log("Moderator not found");
      return res.status(404).json({ msg: 'Moderator not found' });
    }

    // Update the moderator document with the new fields
    moderator = await Moderator.findOneAndUpdate(
      { moderatorId: updateFields.moderatorId },
      { $set: updateFields },
      { new: true }
    );

    res.json({ moderator, success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteModerator = async (req, res) => {
  const { moderatorId } = req.body; 

  try {
    const moderator = await Moderator.findOneAndDelete({ moderatorId });

    if (!moderator) {
      console.log("Moderator not found");
      return res.status(404).json({ msg: 'Moderator not found' });
    }

    res.json({ msg: 'Moderator removed successfully', success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


//COMPANY 

exports.registerCompany = async (req, res) => {
  const { companyId, companyName, email, alternativeEmail, contact_1, contact_2 ,password } = req.body;

  try {
    let company = await Company.findOne({ companyId });

    if (company) {
      return res.status(400).json({ msg: 'Company already exists' });
    }

    company = new Company({ companyId, companyName, email, alternativeEmail, contact_1, contact_2 ,password});

    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(password, salt);

    await company.save();

    const payload = { company: { id: company.id } };

    jwt.sign(payload, "7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;

  console.log("login req as company", req.body)

  try {
    let company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = { company: { id: company.id } };

    jwt.sign(payload,"7583d88d1f4614edf7e3d4b52e496a0fb02fbc1885bb64b06d62257549ee0a1929fa5a52e14e979587536fee27e7f20980719862c1c1664b3461e3eaa9c9f9c1", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      const { companyId, companyName, email, contact_1 } = company;
      console.log({ token, company: { companyId, companyName, email, contact_1 }});
      res.json({ token,success:true, company: { companyId, companyName, email, contact_1 } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateCompany = async (req, res) => {

  const {
    companyId,
    companyName,
    email,
    alternativeEmail,
    contact_1,
    contact_2,
  } = req.body;

  const updateFields = {
    companyId,
    companyName,
    email,
    alternativeEmail,
    contact_1,
    contact_2,
  };

  try {
    let company = await Company.findOne({ companyId: updateFields.companyId });

    if (!company) {
      console.log("Company not found")
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Update the company document with the new fields
    company = await Company.findOneAndUpdate(
      { companyId: updateFields.companyId },
      { $set: updateFields },
      { new: true }
    );

    res.json({company,success:true});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteCompany = async (req, res) => {
  const { companyId } = req.body;  // Assuming the companyId is sent in the body

  try {
    const company = await Company.findOneAndDelete({companyId });

    if (!company) {
      console.log("Company not found");
      return res.status(404).json({ msg: 'Company not found' });
    }

    res.json({ msg: 'Company removed successfully', success:true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};