import axios from 'axios'
const appServerURL = "https://api.joinpomegranateapi.com";
// "http://api-pomegranate.ap-south-1.elasticbeanstalk.com";
// "https://api.joinpomegranateapi.com";
// "https://server-pomegranate.onrender.com";
//dev and prod

const ApiFetch = axios.create({
  baseURL: appServerURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// const ApiFetch = (config:any) => {
//   const token = "";
//   if (token != null) {
//     config.headers = {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': '*',
//       Authorization: 'Bearer ' + token,
//     };
//   }

//   axios.interceptors.response.use(
//     response => {
//       return response;
//     },
//     function (error) {
//       if (!error.response) {
//         error.response = {
//           data: 'INETRNAL SERVER ERROR',
//           status: 500,
//         };
//       }
//       if (error.response.status === 401) {
//         throw error;
//       }
//       return Promise.reject(error);
//     }
//   );
//   config.baseURL = appServerURL;
//   return axios(config);
// };

export default ApiFetch;