const User = require('../models/userModel');

const messageReceiver = {
    INSTRUCTOR: "instructor",
    SUPPORT: "support",
}

//Find one user in the db with the provided Email
async function check_if_user_exist_with_Email(userEmail = "") {
    if (!userEmail) return false
    try {
        const response = await User.findOne({ email: userEmail });
        return response;
    } catch (error) {
        return error.message;
    }
}

//Fine one user in the db with the provided ID
async function check_if_user_exist_with_id(userId = "") {
    if (!userId) return false
    try {
        const response = await User.findOne({_id: userId });
        return response;
    } catch (error) {
        return error.message;
    }
}

//Fine one document in the db from the given model with the provided ID
async function check_if_document_exist_with_id(docId = "", ModelName) {
    if (!docId) return false
    try {
        const response = await ModelName.findOne({_id: docId });
        return response;
    } catch (error) {
        return error.message;
    }

}


module.exports = {
    check_if_user_exist_with_id,
    check_if_user_exist_with_Email,
    check_if_document_exist_with_id,
    messageReceiver
};



// import React, { useState, useEffect } from 'react';

// const useGeolocation = () => {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         position => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           });
//         },
//         error => {
//           setError(error.message);
//         }
//       );
//     } else {
//       setError('Geolocation is not supported by this browser.');
//     }
//   }, []);

//   return { location, error };
// };

// const App = () => {
//   const { location, error } = useGeolocation();

//   useEffect(() => {
//     if (location) {
//       // Send the location to the server for further processing
//       fetch('/api/location', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(location),
//       })
//       .then(response => response.json())
//       .then(data => {
//         // Handle data from the server
//         console.log(data);
//       });
//     }
//   }, [location]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>Welcome to the App</h1>
//       {/* Render other components */}
//     </div>
//   );
// };

// export default App;