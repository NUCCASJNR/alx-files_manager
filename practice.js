const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://127.0.0.1:27017';


MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw new Error(err);
  }
  const db = client.db('test');
  db.createCollection('AlAreefCollection', (err, res) => {
    if (err) {
      throw err;
    }
    console.log('Collection created: AlAreefCollection');
  });
  const collection = db.collection('AlAreefCollection');
  const document = { name: 'AlAreef', Age: 17};
  collection.insertOne(document, (err, res) => {
    if (err) {
      throw new Error(err);
    }
    console.log(`${JSON.stringify(document)} has been successfully inserted into the collection`)

    const documents = [
      {name: 'John', address: 'Highway 71'},
      {name: 'Peter', address: 'Lowstreet 4'},
      {name: 'Amy', address: 'Apple st 652'},
      {name: 'Hannah', address: 'Mountain 21'},
      {name: 'Michael', address: 'Valley 345'},
      {name: 'Sandy', address: 'Ocean blvd 2'},
      {name: 'Betty', address: 'Green Grass 1'},
      {name: 'Richard', address: 'Sky st 331'},
      {name: 'Susan', address: 'One way 98'},
      {name: 'Vicky', address: 'Yellow Garden 2'},
      {name: 'Ben', address: 'Park Lane 38'},
      {name: 'William', address: 'Central st 954'},
      {name: 'Chuck', address: 'Main Road 989'},
      {name: 'Viola', address: 'Sideway 1633'}
    ];

    collection.insertMany(documents, (err, res) => {
      if (err) {
        throw new Error(err);
      }
      console.log('Successfully inserted multiple documents into the collection')
      console.log(res.insertedCount)
      client.close()
    })
  })
});