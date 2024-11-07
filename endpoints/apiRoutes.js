const express = require('express'); // Import Express
const router = express.Router(); // Create a new router instance

// Import the controller functions from the correct path
const {
  getPracticeDataController,
  getCustomerDataController,
  insertPracticeDataController,
  updatePracticeDataController,
  deletePracticeDataController,
  addUserDataController,
  loginUser,
  reserveSlot,
  resetAllSlotsController,
} = require('../handlers/dataController'); // Adjust this path if necessary

// Define routes for Practice data
router.get('/practice', getPracticeDataController); // GET /api/practice
router.post('/practice', insertPracticeDataController); // POST /api/practice
router.put('/practice', updatePracticeDataController); // PUT /api/practice
router.delete('/practice/:custname', deletePracticeDataController); // DELETE /api/practice/:custname

// Define routes for Customer data
router.get('/customer', getCustomerDataController); // GET /api/customer

// Define routes for User registration and login
router.post('/register', addUserDataController); // POST /api/register
router.post('/login', loginUser); // POST /api/login

// Define routes for slot reservation
router.post('/reserve-slot', reserveSlot); // POST /api/reserve-slot

// Define route for resetting all slots
router.post('/reset-slots', resetAllSlotsController); // POST /api/reset-slots

module.exports = router; // Export the router
