# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

## Development server

backend npm install && node index.js

Frontend:
npm install
Run `ng serve --ssl true --ssl-key ssl/key.pem --ssl-cert ssl/cert.pem` for a dev server. Navigate to `https://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

This project includes a Node.js backend (Express) that serves data over HTTPS using a self-signed SSL certificate.

To start the backend server, run: nodemon index.js

Make sure your SSL certificate and key are correctly configured in index.js. The server will be available at:
https://localhost:3000/

If everything is working, visiting that URL should return:
API radi! Dobrodošao na početnu rutu.

roject Description
This is a tourism booking platform where users can explore destinations, view galleries, and make reservations. The site includes:

A homepage with inspirational travel quotes and visuals

A gallery of amazing places

A services section offering hotels, food, guides, and global travel options

Destinations
The platform features a rich catalog of destinations, categorized by geographic regions and travel themes. Each category includes current offers tailored to that region, such as: 
    *Cities
    *Seas
    *Winter
    *Adventures
Registered users can:
   *Make secure reservations directly from the site
    *Track and manage their bookings via their user dashboard

Admin login info
email: admin@example.com
password: adminadmin

Admins have full access to all bookings and destinations and can manage offers per category.

User & Admin Pages
Upon logging in, users are redirected to personalized pages based on their role:

Users can:

Browse categorized destinations
    Book current offers
    Make and manage their own bookings

Admins have access to:
    All user bookings
    Book current offers
    Administrative dashboard for managing offers and destinations

Secure login with JWT authentication

Role-based access: users can manage their own bookings, admins can view all

Automatic token refresh for active users, and logout for idle ones

Fully responsive frontend built with Angular

Backend served over HTTPS with self-signed SSL

You can preview the frontend at https://localhost:4200 and the backend at https://localhost:3000.