// Import React and ReactDOM
import React from "react";
import ReactDOM from "react-dom";

// Polyfills
import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "babel-polyfill";

// Import main App component
import App from "./App";

// Mount React App
ReactDOM.render(<App />, document.getElementById("app"));
