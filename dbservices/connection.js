
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Smart321&&',
  port: 5432,
});

// Do it with according to function one
const getTableData = async (tableName) => {
  try {
    const result = await pool.query(`SELECT * FROM "${tableName}"`);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const insertTableData = async (tableName, data) => {
  try {
    const columns = Object.keys(data).join(', '); // column1, column2
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', '); // $1, $2

    const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(query, values); // Execute the INSERT query
    return result.rows[0]; // Return the inserted row
  } catch (err) {
    throw err;
  }
};

const updateTableData = async (table, custname, { newAdress, newSalary }) => {
  try {
    const query = `UPDATE "${table}" SET adress = $1, salary = $2 WHERE custname = $3 RETURNING *`;
    const values = [newAdress, newSalary, custname];
    const result = await pool.query(query, values);

    return result.rows[0]; // Return the updated row
  } catch (err) {
    console.error('Update failed:', err);
    throw err; // Propagate the error
  }
};
const deleteTableData = async (table, custname) => {
  try {
    const query = `DELETE FROM "${table}" WHERE custname = $1 RETURNING *`;
    const values = [custname];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (err) {
    console.error('Delete failed:', err); // Log the error for debugging
    throw err; // Propagate the error
  }
};
const addUserData = async (tableName, { username, password, email }) => {
  const query = `INSERT INTO ${tableName} (username, password, email) VALUES ($1, $2, $3) RETURNING *`;
  const values = [username, password, email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Return the inserted user
  } catch (err) {
    throw new Error('Database insert failed: ' + err.message);
  }
};


// Function to check if a slot is available
const checkSlotAvailability = async (slotId) => {
  const query = 'SELECT is_booked FROM slots WHERE id = $1';
  const result = await pool.query(query, [slotId]);
  return result.rows.length > 0 && !result.rows[0].is_booked; // Returns true if the slot is available
};

// Function to mark a slot as booked
const markSlotAsBooked = async (slotId) => {
  const query = 'UPDATE slots SET is_booked = true WHERE id = $1';
  await pool.query(query, [slotId]);
};

// Function to insert booking data
const insertBookingData = async (bookingData) => {
  const { customer_name, phone_number, car_type, slot_id, booking_date } = bookingData;
  const query = `
    INSERT INTO slot_bookings (customer_name, phone_number, car_type, slot_id, booking_date)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const result = await pool.query(query, [customer_name, phone_number, car_type, slot_id, booking_date]);
  return result.rows[0]; // Return the inserted booking
};
const resetAllSlots = async () => {
  try {
    // Correct column name 'is_booked'
    const query = 'UPDATE slots SET is_booked = false'; // Reset all slots to not booked
    await pool.query(query);
    console.log('All slots have been reset to available.');
  } catch (err) {
    console.error('Resetting all slots failed:', err);
    throw new Error('Resetting all slots failed: ' + err.message);
  }
};


module.exports = { getTableData, insertTableData, updateTableData, deleteTableData, addUserData, checkSlotAvailability, markSlotAsBooked, insertBookingData, resetAllSlots }