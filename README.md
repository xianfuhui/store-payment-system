
# Mobile Retail Store Application

## 1. Introduction

In today's digital era, technology plays a crucial role in improving shopping experiences. Consumers increasingly prefer convenient online platforms when purchasing technology products, especially mobile phones.

This application was developed using Node.js to provide an efficient and user-friendly system for managing and purchasing mobile devices. The platform allows users to easily search, explore, and select phones based on their individual needs. It supports a wide range of products, including the latest models and exclusive devices available through the store.

The system aims to provide a convenient and modern retail experience while improving product management and customer interaction.

---

## 2. Technologies Used

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- Mongoose

### Frontend
- HTML
- CSS
- JavaScript
- EJS Template Engine

### Database
- MongoDB (NoSQL)

### Main Libraries

- ejs ^3.1.9  
- express ^4.18.2  
- express-flash ^0.0.2  
- express-session ^1.17.3  
- jsonwebtoken ^9.0.2  
- mongoose ^8.0.1  
- multer ^1.4.5-lts.1  
- nodemailer ^6.9.7  
- path ^0.12.7  
- pdfkit ^0.14.0  

---

## 3. System Design

### Class Diagram
![Class Diagram](./README_images/class-diagram.png)

### Use Case Diagram
![Usecase Diagram](./README_images/usecase-diagram.png)

### Sequence Diagram
![Sequence Diagram](./README_images/sequence-diagram.png)

### Functional Decomposition Diagram
![Functional Decomposition](./README_images/function-diagram.png)

---

## 4. System Overview

### Project Structure

Main directories of the application:

- **.env** – Contains environment configuration variables.
- **app.js** – Main entry file responsible for initializing and running the application.
- **package.json** – Contains project dependencies and configuration information.
- **config/** – Database configuration files.
- **node_modules/** – Stores installed Node.js dependencies.
- **src/** – Contains the main source code of the system following the MVC architecture.

Subdirectories inside **src/**:

- **controllers/** – Handle requests from users and communicate with models and views.
- **middleware/** – Provide middleware functions for request processing and authentication.
- **models/** – Define database models used by the application.
- **public/** – Store static resources such as images, CSS, and JavaScript files.
- **routes/** – Define application routing logic.
- **views/** – User interface templates rendered by the server.

---

## 5. Deployment

### Step 1: Create GitHub Repository

Create a repository and push the source code to GitHub.

Repository link:  
https://github.com/xianfuhui/paymentshop-app

---

### Step 2: Configure MongoDB Atlas

Create a MongoDB Atlas cluster and update the connection string inside the `.env` file.

Example:

MONGO_URI=your_mongodb_connection_string

---

### Step 3: Deploy using Render

1. Go to https://render.com/
2. Select **Deploy a Web Service**
3. Connect the GitHub repository
4. Configure the deployment settings

Example configuration:

- Name: paymentshop-app  
- Region: Oregon (US West)  
- Branch: main  
- Runtime: Node  
- Build Command: yarn  
- Start Command: npm start  

---

### Step 4: Access the Application

After deployment, access the system via:

https://paymentshop-app.onrender.com/

---

## 6. Application Screenshots

### Admin Login
![Admin Login](./README_images/admin-login.png)

### Admin Profile
![Admin Profile](./README_images/admin-profile.png)

### Staff Management
![Staff List](./README_images/staff-list.png)

### Product Management
![Product List](./README_images/product-list.png)

### Cart
![Cart](./README_images/cart.png)

### Payment
![Payment](./README_images/payment.png)

---

## Author

Name: Tien Phu Huy  
Email: tphuyvvk@gmail.com  
GitHub: https://github.com/xianfuhui
