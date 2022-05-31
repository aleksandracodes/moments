import axios from "axios";

axios.defaults.baseURL = 'https://moments-drf-api-ah.herokuapp.com/'
// we need the multipart because our application will be dealing with images as well as text in its requests
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// avoid any CORS errors when sending cookies
axios.defaults.withCredentials = true