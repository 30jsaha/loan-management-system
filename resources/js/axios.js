import axios from "axios";

axios.defaults.baseURL = "https://agronew.adzgurupos.com";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export default axios;