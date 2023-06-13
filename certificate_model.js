const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

const certificateSchema = mongoose.Schema({
    certificateNumber: {type: Number, required:true},
    name: {type: String, required: true},
    Address: {type: String, required: true},
    nationality: {type: String, required: true},
    dob: {type: Date, required: true}

})

const Certificate = mongoose.model("Certificate", certificateSchema);
 

const createUserCertificate = async (certificateNumber, name, Address, nationality, dob) => {
    const userCertificate = new Certificate({
      certificateNumber:certificateNumber,
      name: name,
      Address: Address,
      nationality: nationality,
      dob: dob,
    });
  
    try {
      const savedCertificate = await userCertificate.save();
      return true;
    } catch (error) {
      // Handle any errors that occur during the save operation
      throw new Error(error.message);
    }
  };


const findUserCertificate = async (filter) => {

    const query = Certificate.find(filter);
    return query.exec();
}
const findAllCertificates = async () => {
  try {
    const certificates = await Certificate.find();
    return certificates;
  } catch (error) {
    throw new Error("Failed to retrieve certificates");
  }
};
const updateUserCertificate = async (filter, update) => {
    try {
      const result = await Certificate.updateOne(filter, update);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };
const deleteCertificate = async (filter) => {
    const delResult = await Certificate.deleteMany(filter);
    return true;
  }

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

module.exports = {createUserCertificate, findUserCertificate, updateUserCertificate, deleteCertificate,Certificate, findAllCertificates}; 



