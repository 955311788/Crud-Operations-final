const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

const rentalSchema = mongoose.Schema({
    rentalID: {type: Number, required:true},
    memberID: {type: Number, required: true},
    rentalDate: {type: Date, required: true},
    hoursPlanned:{type: Number, required: true},
    planeChoice:{type: String, required: true},
    estimatedCost: {type: Number, required: true},
   

})

const Rental = mongoose.model("Rental", rentalSchema);
 

const createRental = async (rentalID, memberID, rentalDate, hoursPlanned, planeChoice, estimatedCost) => {
    const rental = new Rental({
      rentalID:rentalID,
      memberID: memberID,
      rentalDate: rentalDate,
      hoursPlanned: hoursPlanned,
      planeChoice: planeChoice,
      estimatedCost: estimatedCost
    });
  
    try {
      const savedRental = await rental.save();
      return true;
    } catch (error) {
      // Handle any errors that occur during the save operation
      throw new Error(error.message);
    }
  };


const findRentalID = async (filter) => {

    const query = Rental.find(filter);
    return query.exec();
};
const findAllRentals = async () => {
    try {
      const rentals = await Rental.find();
      return rentals;
    } catch (error) {
      throw new Error("Failed to retrieve rentals");
    }
  };
const updateRental = async (filter, update) => {
    try {
      const result = await Rental.updateOne(filter, update);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };
const deleteRental = async (filter) => {
    const delResult = await Rental.deleteMany(filter);
    return true;
  }

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

module.exports = {createRental, findRentalID, updateRental, deleteRental, findAllRentals}; 
