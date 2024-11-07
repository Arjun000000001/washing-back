
const { getTableData, insertTableData, updateTableData, deleteTableData, addUserData,checkSlotAvailability,markSlotAsBooked,insertBookingData,resetAllSlots} = require('../dbservices/connection');


const getPracticeDataController = async (req, res) => {
  try {
    const data = await getTableData('Practice');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Practice data' });
  }
};


const getCustomerDataController = async (req, res) => {
  try {
    const data = await getTableData('Customer');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Customer data' });
  }
};
const insertPracticeDataController = async (req, res) => {
  const { custname, adress, salary } = req.body; // Extracting data from the request body

  try {

    if (!custname || !adress || !salary) {
      return res.status(400).json({ error: 'Please provide custname, adress, and salary' });
    }


    const result = await insertTableData('Practice', { custname, adress, salary });


    res.status(201).json({ message: 'Data inserted successfully', result });
  } catch (err) {
    console.error('Failed to insert data:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to insert data', details: err.message });
  }
};
const updatePracticeDataController = async (req, res) => {
  const { custname, newAdress, newSalary } = req.body; // Extracting new data from the request body

  try {

    if (!custname || !newAdress || !newSalary) {
      return res.status(400).json({ error: 'Please provide custname, newAdress, and newSalary' });
    }


    const result = await updateTableData('Practice', custname, { newAdress, newSalary });


    if (result) {
      res.status(200).json({ message: 'Data updated successfully', result });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    console.error('Failed to update data:', err); // Log error for debugging
    res.status(500).json({ error: 'Failed to update data', details: err.message });
  }
};

const deletePracticeDataController = async (req, res) => {
  const { custname } = req.params;

  try {
    if (!custname) {
      return res.status(400).json({ error: 'Please provide custname' });
    }

    const deletedRow = await deleteTableData('Practice', custname);

    if (deletedRow) {
      res.status(200).json({ message: 'Record deleted successfully', data: deletedRow });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    console.error('Failed to delete data:', err);
    res.status(500).json({ error: 'Failed to delete data', details: err.message });
  }
};
const addUserDataController = async (req, res) => {
  const { username, password, email } = req.body; // Assuming these fields are in the form

  try {
    // Validate the request body
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Please provide username, password, and email' });
    }

    // Call the database function to insert the data
    const result = await addUserData('users', { username, password, email });

    res.status(201).json({ message: 'User registered successfully', result });
  } catch (err) {
    console.error('Failed to register user:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch all users from the database (consider optimizing this for large datasets)
    const users = await getTableData('users'); // Adjust the table name as needed

    // Find the user with the matching username and password
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const reserveSlot = async (req, res) => {
  const { customer_name, phone_number, car_type, slot_id, booking_date } = req.body;

  try {
    // Check if the slot is available
    const isAvailable = await checkSlotAvailability(slot_id);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Selected slot is not available.' });
    }

    // Mark the slot as booked
    await markSlotAsBooked(slot_id);

    // Insert booking information
    const bookingData = {
      customer_name,
      phone_number,
      car_type,
      slot_id,
      booking_date,
    };

    const newBooking = await insertBookingData(bookingData);

    return res.status(201).json({ message: 'Slot booked successfully!', booking: newBooking });
  } catch (err) {
    console.error('Error booking slot:', err);
    return res.status(500).json({ error: 'An error occurred while booking the slot.' });
  }
};

// Function to handle resetting all slots
const resetAllSlotsController = async (req, res) => {
  try {
    const result = await resetAllSlots(); // Call the resetAllSlots function from db.js
    res.status(200).json(result); // Send success response
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset all slots' });
  }
};


module.exports = { getPracticeDataController, getCustomerDataController, insertPracticeDataController, updatePracticeDataController, deletePracticeDataController, addUserDataController, loginUser,reserveSlot,resetAllSlotsController };
