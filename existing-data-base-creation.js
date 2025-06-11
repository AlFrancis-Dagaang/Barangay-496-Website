
const ExistingUserData = require("./model/pre-exisingDataResidentModel"); // Adjust path if needed

const defaultData = [
    {
      fullName: "DE JESUS, CIELO MARIE RECALDE",
      address: "1414 Crisostomo St., Barangay 496, Manila",
      birthdate: "19/06/1983", // Date as a string in day/month/year format
      sex: "female",
    },
    {
      fullName: "DEL POZO, ANDY CHRISTIAN DE JESUS",
      address: "1414 Crisostomo St., Barangay 496, Manila",
      birthdate: "03/09/2004", // String representation of the birthdate
      sex: "male",
    },
    {
      fullName: "DELA PAZ, KATRIZZ ARCELO",
      address: "1434 Crisostomo St., Barangay 496, Manila",
      birthdate: "01/04/1995",
      sex: "female",
    },
    {
      fullName: "DENOFRA, RUBY REGALA",
      address: "1443-A Crisostomo St., Barangay 496, Manila",
      birthdate: "02/09/1960",
      sex: "female",
    },
    {
      fullName: "ELLESCAS, ELJAY REY DELA PAZ",
      address: "1434 Crisostomo St., Barangay 496, Manila",
      birthdate: "20/05/1993",
      sex: "male",
    },
    {
      fullName: "FILOMENO, AVERRY MICAH LIZADA",
      address: "1433 Ibarra St., Barangay 496, Manila",
      birthdate: "07/02/2003",
      sex: "male",
    },
    {
      fullName: "PAANO, DARYLL LA MADRID",
      address: "2157 Maria Clara St., Barangay 496, Manila",
      birthdate: "08/06/2004",
      sex: "male",
    },
    {
      fullName: "SAN DIEGO, MICHAEL ANGELO SAMIA",
      address: "1416 Ibarra St., Barangay 496, Manila",
      birthdate: "06/02/2001",
      sex: "male",
    },
    {
      fullName: "SANCHEZ, JULIAN ANDREI ALLAM",
      address: "1411 Casanas, Barangay 496, Manila",
      birthdate: "07/08/2002",
      sex: "male",
    },
    {
      fullName: "DELA PAZ, KZYRELL ARCILO",
      address: "1434 Crisostomo St., Barangay 496, Manila",
      birthdate: "09/22/2004",
      sex: "male",
    },
  ];
  

async function initializeDefaultData() {
  try {
    const existingCount = await ExistingUserData.countDocuments();

    if (existingCount === 0) { // If no documents exist, insert the default data
      await ExistingUserData.insertMany(defaultData); // Insert the default data
      console.log("Default data has been initialized.");
    } else {
      console.log("Existing Data base is working");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
}

module.exports = initializeDefaultData;
