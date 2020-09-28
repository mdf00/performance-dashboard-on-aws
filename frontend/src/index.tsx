import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Amplify from "aws-amplify";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "uswds/dist/css/uswds.css";
import "uswds/dist/js/uswds.js";
import "./index.css";

dayjs.extend(relativeTime);

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "BadgerApi",
        endpoint: process.env.REACT_APP_BADGER_API,
      },
    ],
  },
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_APP_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_DATASETS_BUCKET,
      region: process.env.REACT_APP_AWS_REGION,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();