Stock Prediction Bot

This repo contains both the frontend and backend for the project. The frontend is located in the `/stockbot` folder, where the components are located in `/src`. To open the web application, move into the `/stockbot` directory and open up a terminal. Run `npm start`, and a development server should open in your browser. If there are package dependancy issues, make sure that `package.json` is not empty, and run `npm install` to load all of the required packages. 

`App.js` is our main page for the frontend, and `app.py` (located in `/backend`) is where our API is located, and where we are making requests to. Backend requests are done through `axios`, and the responses are saved in `stockData`, `predicationData`, and `echoData` for each respective backend function. To test, click on one of the icons in the right-hand side panel, where a notification should show up that displays the response status.

While `grab_data` works with any date range, `future_pred` only works when the size of `stockData` is greater than 100, so for a test case, use 2023-01-01 to 2023-05-26 (or greater).

The stylesheets were made using scss, but almost all of the code would function the same as if we were using regular css, and we're mainly just using it for single line comments (//). Feel free to expirement with the main stylesheet `App.scss`, and any others you might want to change.

Currently, we still need to format the graph and clear some space, so it might not be a bad idea to create a section (not a new page) under the input form for our plot.
