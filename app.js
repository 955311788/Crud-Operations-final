require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const certificates = require('./certificate_model.js');
const planes = require('./plane_model.js');
const members = require('./member_model.js');
const rentals = require('./rental_model.js');


const app = express();

const PORT = process.env.PORT;

app.use(express.static('public'));

// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// creates the certficate table based on the provided attributes. 
app.get("/create", asyncHandler(async (req, res) => {
    const { certificateNumber, name, Address, nationality, dob } = req.query;

    const certificate = await certificates.createUserCertificate(
        certificateNumber,
        name,
        Address,
        nationality,
        dob)

        certificate;

    res.send(certificate)

}))


// retrieves all certificates base on the certificate id to populate a drop down
app.get("/retrieveAll", asyncHandler(async (req, res) => {
  const result = await certificates.findAllCertificates(); 

    if (result.length === 0) {
        return res.status(404).json({ Error: "No certificates found" });
    }

    const certificateIDs = result.map(certificate => certificate.certificateNumber)


    res.send(certificateIDs);

    }));
// retrieves a single certificate with all its attributes
app.get("/retrieve", asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.certificateNumber !== undefined) {
      filter.certificateNumber = req.query.certificateNumber;
    }
  
    const result = await certificates.findUserCertificate(filter);
  
    if (result.length === 0) {
      return res.status(404).json({ Error: "Certificate not found" });
    }
  
    const certificate = result[0]; // Assuming you only want to retrieve the first matching certificate
  
    // Prepare the data to be populated in the form fields
    const formData = {
      certificateNumber: certificate.certificateNumber,
      name: certificate.name,
      Address: certificate.Address,
      nationality: certificate.nationality,
      dob: certificate.dob.toISOString().split("T")[0], // Format the date as yyyy-mm-dd
    };
  
    res.send(formData);
  }));
// updates the certificate based on the certificate id, any one feild can be updated
app.get("/update", asyncHandler(async (req, res) => {

    const certificateNumber = req.query.certificateNumber;

    const {name, Address, nationality, dob } = req.query;

    const existingCertificate = await certificates.findUserCertificate({ certificateNumber });
    if (existingCertificate.length === 0) {
      return res.status(404).json({ Error: "Certificate not found" });
    }
  
    const update = {
      name,
      Address,
      nationality,
      dob: new Date(dob),
    };
  
    const result = await certificates.updateUserCertificate({ certificateNumber }, update);
    res.send({ numOfCertificatesUpdated: result.modifiedCount });
  }));

// deletes the certificate based on certificate ID
app.get("/delete", asyncHandler(async (req, res) => {

    const filter = {};
    if (req.query.certificateNumber !== undefined) {
      filter.certificateNumber = req.query.certificateNumber;
    }else{

    }
    if (req.query.name !== undefined) {
      filter.name = req.query.name;
    }
    if (req.query.Address !== undefined) {
      filter.Address = req.query.Address;
    }
    if (req.query.nationality !== undefined) {
      filter.nationality = req.query.nationality;
    }
    if (req.query.dob !== undefined) {
      filter.dob = req.query.dob;
    }
  
    const result = await certificates.deleteCertificate(filter);
    res.send({numOfCertificatesDeleted: result});
    

}))

// -----------------------------------------------------------------------------------------------------------------------------------------
// controller for addition of planes.
//------------------------------------------------------------------------------------------------------------------------------------------
// creates the plane table based on the provided attributes. 
app.get("/createPlane", asyncHandler(async (req, res) => {
  const { planeID, year, make, model, color, horsepower} = req.query;
  const vfr = req.query.vfr === "on" ? true: false; 

  const plane = await planes.createPlane(
      planeID,
      year,
      make,
      color,
      horsepower,
      vfr)
  res.send(plane)

}))

//-----------------------------------------------------------------
//to populate drop down list 
//--------------------------------------------------------------
app.get("/retrievePlanes", asyncHandler(async (req, res) => {
  const result = await planes.findAllPlanes();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No planes found" });
  }

  const planeIDs = result.map(plane => plane.planeID);

  res.send(planeIDs);
}));

//-------------------------------------------------------------------------------------------------------------------------
// retrieves planes
app.get("/retrievePlane", asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.planeID !== undefined) {
    filter.planeID = req.query.planeID;
  }

  const result = await planes.findPlaneID(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "plane not found" });
  }

  const plane = result[0];

  res.send(plane);


}));
// retrieves all plane makes to populate drop down to select available planes 
app.get("/retrievePlaneMakes", asyncHandler(async (req, res) => {
  const result = await planes.findAllPlanes();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No planes found" });
  }

  const planeMakes = result.map(plane => plane.make);

  res.send(planeMakes);
}));
// updates the plane based on the plane id, any one feild can be updated
app.get("/updatePlane", asyncHandler(async (req, res) => {

  const planeId = req.query.planeID;

  const {year, make, model, color, horsepower} = req.query;
  const vfr = req.query.vfr === "on" ? true: false;

  const existingPlane = await planes.findPlaneID({ planeID: planeId });
  if (existingPlane.length === 0) {
    return res.status(404).json({ Error: "Plane not found" });
  }

  const update = {
    year,
    make,
    color,
    horsepower,
    vfr
  };

  const result = await planes.updatePlane({ planeID: planeId }, update);
  res.send({ numOfPlanesUpdated: result.modifiedCount });
}));

// deletes the plane based on plane id
app.get("/deletePlane", asyncHandler(async (req, res) => {

  const filter = {};
  if (req.query.planeID !== undefined) {
    filter.planeID = req.query.planeID;
  }else{

  }
  if (req.query.year !== undefined) {
    filter.year = req.query.year;
  }
  if (req.query.make !== undefined) {
    filter.make = req.query.make;
  }
  if (req.query.color !== undefined) {
    filter.color = req.query.color;
  }
  if (req.query.horsepower !== undefined) {
      filter.horsepower = req.query.horsepower;
  }

  const result = await planes.deletePlane(filter);
  res.send({numOfPlanesDeleted: result});
  

}))

//--------------------------------------------------------------------------------------------------------------------------
// Member controller code
//-----------------------------------------------------------------------------
// creates the member table based on the provided attributes. 
app.get("/createMember", asyncHandler(async (req, res) => {
  const {memberID, certificateID, lastName, firstName, address, phoneNumber, email, dob} = req.query; 

  const member = await members.createMember(
      memberID,
      certificateID, 
      lastName, 
      firstName,
      address, 
      phoneNumber, 
      email,
      dob)


  res.send(member)

}))
// --- retrieve all members for update and delete
app.get("/retrieveMembers", asyncHandler(async (req, res) => {
  const result = await members.findAllMembers();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No members found" });
  }

  const memberIDs = result.map(member => member.memberID);

  res.send(memberIDs);
}));

// retrieves a single member by id and all the attributes
app.get("/retrieveMember", asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.memberID !== undefined) {
    filter.memberID = req.query.memberID;
  }

  const result = await members.findMember(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "Member not found" });
  }

  const member = result[0];

  const formData = {
    memberID: member.memberID, 
    lastName: member.lastName,
    firstName: member.firstName,
    address: member.address,
    phoneNumber: member.phoneNumber,
    email: member.email,
    dob: member.dob.toISOString().split("T")[0], // Format the date as yyyy-mm-dd
  };

  res.send(formData);


}));
//-------------------------------------------------------------
app.get("/retrieve", asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.certificateNumber !== undefined) {
    filter.certificateNumber = req.query.certificateNumber;
  }

  const result = await certificates.findUserCertificate(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "Certificate not found" });
  }

  const certificate = result[0]; // Assuming you only want to retrieve the first matching certificate

  // Prepare the data to be populated in the form fields
  const formData = {
    certificateNumber: certificate.certificateNumber,
    name: certificate.name,
    Address: certificate.Address,
    nationality: certificate.nationality,
    dob: certificate.dob.toISOString().split("T")[0], // Format the date as yyyy-mm-dd
  };

  res.send(formData);
}));
//--------------------------------------------------------------------------


// updates the member based on the member id, any one feild can be updated
app.get("/updateMember", asyncHandler(async (req, res) => {

  const memberId = req.query.memberID;

  const {lastName, firstName, address, phoneNumber, email, dob} = req.query;
  

  const existingMember = await members.findMember({ memberID: memberId });
  if (existingMember.length === 0) {
    return res.status(404).json({ Error: "Member not found" });
  }

  const update = {
    lastName,
    firstName, 
    address,
    phoneNumber, 
    email,
    dob
  };

  const result = await members.updateMember({ memberID: memberId }, update);
  res.send({ numOfMembersUpdated: result.modifiedCount });
}));

// deletes the member based on member ID
app.get("/deleteMember", asyncHandler(async (req, res) => {

  const filter = {};
  if (req.query.memberID !== undefined) {
    filter.memberID = req.query.memberID;
  }else{

  }
  if (req.query.lastName !== undefined) {
    filter.lastName = req.query.lastName;
  }
  if (req.query.firstName !== undefined) {
    filter.firstName = req.query.firstName;
  }
  if (req.query.address !== undefined) {
    filter.address = req.query.address;
  }
  if (req.query.phoneNumber !== undefined) {
    filter.phoneNumber = req.query.phoneNumber;
  }
  if (req.query.email !== undefined) {
      filter.email = req.query.email;
  }

  const result = await members.deleteMember(filter);
  res.send({numOfMembersDeleted: result});
  

}))


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

// -----------------------------------------------------------------------------------------------------------------------
//Rental Controller Code 
// -----------------------------------------------------------------------------------------------------------------------
// creates the rental table based on the provided attributes. 
app.get("/createRental", asyncHandler(async (req, res) => {
  const { rentalID, memberID, rentalDate, hoursPlanned, planeChoice, estimatedCost} = req.query;

  console.log("Received rental data:", rentalID, memberID, rentalDate, hoursPlanned, planeChoice, estimatedCost);

  const rental = await rentals.createRental(
      rentalID,
      memberID,
      rentalDate,
      hoursPlanned,
      planeChoice,
      estimatedCost
      );
      
  res.send(rental)

}))

//-----------------------------------------------------------------
//to populate drop down list 
//--------------------------------------------------------------
app.get("/retrieveRentals", asyncHandler(async (req, res) => {
  const result = await rentals.findAllRentals();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No rentals found" });
  }

  const rentalIDs = result.map(rental => rental.rentalID);

  res.send(rentalIDs);
}));


app.get("/retrieveRental", asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.rentalID !== undefined) {
    filter.rentalID = req.query.rentalID;
  }

  const result = await rentals.findRentalID(filter);

  if (result.length === 0) {
    return res.status(404).json({ Error: "Rental not found" });
  }

  const rental = result[0];
  

  const formData = {
    rentalID: rental.rentalID,
    memberID: rental.memberID,
    rentalDate: rental.rentalDate.toISOString().split("T")[0],
    hoursPlanned: rental.hoursPlanned,
    planeChoice: rental.planeChoice,
    estimatedCost: rental.estimatedCost
  }

  res.send(formData)
  
}));

app.get("/retrieveRentalMembers", asyncHandler(async (req, res) => {
  const result = await members.findAllMembers();

  if (result.length === 0) {
    return res.status(404).json({ Error: "No members found" });
  }

  const memberIDs = result.map(member => member.memberID);

  res.send(memberIDs);
}));

// updates the rental based on the rental id, any one feild can be updated
app.get("/updateRental", asyncHandler(async (req, res) => {

  const rentalId = req.query.rentalID;


  const {memberID, rentalDate, hoursPlanned, planeChoice, estimatedCost} = req.query;
  

  const existingRental = await rentals.findRentalID({ rentalID: rentalId });
  if (existingRental.length === 0) {
    return res.status(404).json({ Error: "Rental not found" });
  }

  const update = {
    memberID,
    rentalDate,
    hoursPlanned,
    planeChoice,
    estimatedCost
  };

  const result = await rentals.updateRental({ rentalID: rentalId }, update);
  res.send({ numOfRentalsUpdated: result.modifiedCount });
}));

// deletes the rental based on rental ID
app.get("/deleteRental", asyncHandler(async (req, res) => {

  const filter = {};
  if (req.query.rentalID !== undefined) {
    filter.rentalID = req.query.rentalID;
  }else{

  }
  if (req.query.memberID !== undefined) {
    filter.memberID = req.query.memberID;
  }
  if (req.query.rentalDate !== undefined) {
    filter.rentalDate = req.query.rentalDate;
  }
  if (req.query.hoursPlanned !== undefined) {
    filter.hoursPlanned = req.query.hoursPlanned;
  }
  if (req.query.planeChoice !== undefined) {
    filter.planeChoice = req.query.planeChoice;
  }
  if (req.query.estimatedCost !== undefined) {
      filter.estimatedCost = req.query.estimatedCost;
  }

  const result = await rentals.deleteRental(filter);
  res.send({numOfRentalsDeleted: result});
  

}))
