import dbClient from './utils/db';

async function testFindFolderWithoutQuery(parentId) {
  try {
    // Call the findFolder function without a query
    const result = await dbClient.findFolder(parentId);
    if (result) {
      console.log('Found folder without query:', result);
    } else {
      console.log('Folder not found without query.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testFindFolderWithQuery(parentId) {
  try {
    // Define a query
    const query = { type: "folder" }; // Replace with your query conditions

    // Call the findFolder function with a query
    const result = await dbClient.findFolder(parentId, query);
    if (result) {
      console.log('Found folder with query:', result);
    } else {
      console.log('Folder not found with query.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the database connection
    await dbClient.client.close();
  }
}

const parentId = "651acec1318129a02e468024";

testFindFolderWithoutQuery(parentId);
testFindFolderWithQuery(parentId);
