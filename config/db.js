const mongoose = require('mongoose');
mongoose.set('strictQuery', false);



const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ayushkothari610:N1YgIuqhocR4WOMy@ayush.wovezqc.mongodb.net/?retryWrites=true&w=majority&appName=Ayush", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};



module.exports = connectDB;
