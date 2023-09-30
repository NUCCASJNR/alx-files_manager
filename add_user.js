import dbClient from './utils/db'

// Function to test addUser
async function testAddUser() {
  try {
    // Define user data
    const email = 'user@example.com';
    const password = 'password123';

    // Add a new user
    const newUser = await dbClient.addUser(email, password);
    console.log('User added:', newUser);

    // Test findUser to retrieve the user
    const foundUser = await dbClient.findUser({ email });
    console.log('Found user:', foundUser);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the database connection
    dbClient.client.close();
  }
}

// Call the testAddUser function
testAddUser();
