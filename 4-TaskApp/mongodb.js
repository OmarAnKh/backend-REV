
// import { MongoClient, ObjectId } from "mongodb"
// import mongodb from "mongodb"

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {})
    .then(client => {
        console.log('Connected correctly');
        const db = client.db(databaseName);
        // db.collection('users').findOne({ firstName: 'Omar ', lastName: "Khalili" }).then(user => {
        //     console.log(user.firstName)
        // }).catch(error => {
        //     console.log(error)
    })

// db.collection('users').find({ firstName: 'Omar ', lastName: "Khalili" }).toArray().then(user => {
//     console.log(user[0].firstName)
// }).catch(error => {
//     console.log(error)
// })
// db.collection("tasks").insertMany([
//     {
//         description: "Learn node js",
//         completed: true
//     },
//     {
//         description: "Learn SW",
//         completed: true
//     },
//     {
//         description: "Learn AI",
//         completed: false
//     }
// ]).then((error, result) => {
//     if (error) {
//         return console.log(error)
//     }
//     console.log(result.ops)
// }).catch(error => {
//     console.log(error)
// })

// db.collection("tasks").find({ completed: true }).toArray().then(task => {
//     console.log(task)
// }).catch(error => {
//     console.log(error)
// })




//         db.collection('tasks').updateMany({ completed: false }, {
//             $set: {
//                 completed: true
//             }
//         }).then(result => {
//             console.log(result)
//         }).catch(error => {
//             console.log('Unable to connect to database!', error);
//         });



//         db.collection('tasks').updateOne({ _id: new ObjectId('65dcf20d53de356e5e94c572') }, {
//             $set: {
//                 completed: false
//             }
//         }).then(result => {
//             console.log(result)
//         }).catch(error => {
//             console.log('Unable to connect to database!', error);
//         });


//         db.collection('users').deleteMany({ firstName: "Amjad " }).then(result => {
//             console.log(result)
//         }).catch(error => {
//             console.log(error)
//         })

//     })
//     .catch(error => {
//         console.log('Unable to connect to database!', error);
//     });