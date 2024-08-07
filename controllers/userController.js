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
const { receiveUserCSV } = require('../csv_handlers/users/addUserCSV');
const { sendUserCSV } = require('../csv_handlers/users/sendUserCSV');
const { receiveCompanyCSV } = require('../csv_handlers/users/addCompanyCSV');
const { sendCompanyCSV } = require('../csv_handlers/users/sendCompanyCSV');
const { sendUserDemandCSV } = require('../csv_handlers/users/sendUserDemandCSV');
const { sendCompanyDemandCSV } = require('../csv_handlers/users/sendCompanyDemandCSV');


//CSV Caller
exports.receiveManagerCSV = receiveManagerCSV;
exports.sendManagerCSV  = sendManagerCSV;
exports.receiveModeratorCSV = receiveModeratorCSV;
exports.sendModeratorCSV  = sendModeratorCSV;
exports.receiveUserCSV = receiveUserCSV;
exports.sendUserCSV  = sendUserCSV;
exports.receiveCompanyCSV = receiveCompanyCSV;
exports.sendCompanyCSV  = sendCompanyCSV;
exports.sendUserDemandCSV  = sendUserDemandCSV;
exports.sendCompanyDemandCSV  = sendCompanyDemandCSV;


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

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
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

    jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
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
  const {managerId, managerName, email, password, designation, section, appointment, allProductReport, demandReceived, issueProduct} = req.body;

  try {
    let manager = await Manager.findOne({ managerId });

    if (manager) {
      return res.status(400).json({ msg: 'Manager already exists' });
    }

    manager = new Manager({managerId, managerName, email, password, designation, section, appointment, allProductReport, demandReceived, issueProduct});
    const salt = await bcrypt.genSalt(10);
    manager.password = await bcrypt.hash(password, salt);
    await manager.save();

    res.json({success:true});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    let manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(401).json({ msg: 'Invalid email' });
    }
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    const payload = { manager: { id: manager.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Token generation error');
      }

      const { managerId, managerName, email, designation, section, appointment, allProductReport, demandReceived, issueProduct } = manager;

      res.json({ token, success: true, managerData: { managerId, managerName, email, designation, section, appointment, allProductReport, demandReceived, issueProduct } });
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
  const { userId, userName, email, password, designation, section, appointment } = req.body;
  console.log(req.body);

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    user = new User({ userId, userName, email, password, designation, section, appointment });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token ,success:true});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("login req as user", req.body)

  try {

    let user = await User.findOne({ email });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid Password")
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    console.log("Valid password")

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: 3600 }, 
      (err, token) => {
        if (err) throw err;
        const { userId, userName, email, designation, section, appointment } = user;
        res.json({ token, user: { userId, userName, email, designation, section, appointment },success:true });
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
  const { moderatorId, moderatorName, email, password, designation, section, appointment } = req.body;

  console.log(req.body);

  try {
    let moderator = await Moderator.findOne({ email });

    if (moderator) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    moderator = new Moderator({ moderatorId, moderatorName, email, password, designation, section, appointment });

    const salt = await bcrypt.genSalt(10);
    moderator.password = await bcrypt.hash(password, salt);

    await moderator.save();
    return res.status(200).json({ success:true});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginModerator = async (req, res) => {

  const { email, password } = req.body;

  console.log(req.body);

  try {
    console.log("finding Moderator: ",email)
    let moderator = await Moderator.findOne({ email });
    console.log("Moderator FOUND")


    const isMatch = await bcrypt.compare(password, moderator.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const payload = { moderator: { id: moderator.id } };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: 3600 }, 
      (err, token) => {
        if (err) throw err;
        const { moderatorId, moderatorName, email, designation, section, appointment } = moderator;
        res.json({ token, moderator: { moderatorId, moderatorName, email, designation, section, appointment },success:true });
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

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token , success:true});
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

    jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
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
    res.json({companies,success:true});
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

