# Pharmacy Management System - Project Flow

## Overview
This full-stack application is designed to help Pharmacies manage their day-to-day operations, primarily focusing on inventory tracking, supplier management, and point-of-sale (POS) billing.

## Technology Stack
- **Frontend**: React.js (Vite), Redux Toolkit (State Management), React Router, Axios, Vanilla CSS (Glassmorphism design).
- **Backend**: Java Spring Boot 3, Spring Data JPA, Spring Security (JWT), OpenPDF (Bill Generation).
- **Database**: MySQL.

## User Roles
The system is divided into two distinct roles:
1. **Admin**: Responsible for the back-office management. They handle data entry for suppliers and medicines, keeping track of what is in stock and what is expiring.
2. **Pharmacist**: Responsible for the front-office operations. They interact with customers, use the Point of Sale system to add medicines to a cart, check out, and generate PDF bills.

---

## Step-by-Step User Flow

### 1. User Registration & Authentication
- **Action**: Users navigate to the `/register` page to create an account. They can choose to register as an `ADMIN` or `PHARMACIST`.
- **Action**: After registration, users log in at `/login`.
- **Behind the scenes**: The backend verifies credentials using Spring Security. Upon success, it issues a **JSON Web Token (JWT)**, which the React frontend stores in `localStorage`. All subsequent API requests automatically attach this token via an Axios interceptor to verify the user's role.

### 2. Admin Flow: Setting Up Inventory
Once logged in as an **Admin**, the user is redirected to the `/admin` dashboard.
- **Manage Suppliers**: The Admin navigates to the "Manage Suppliers" tab and adds supplier details (Name, Contact Info).
- **Manage Medicines**: The Admin navigates to the "Manage Medicines" tab. They enter the medicine's name, price, expiry date, current stock quantity, and assign it to a previously created supplier.
  - *Note*: If a medicine's stock quantity drops below 10, the dashboard will display a red `(Low Stock)` warning to alert the Admin.

### 3. Pharmacist Flow: Point of Sale (POS)
Once logged in as a **Pharmacist**, the user is redirected to the `/pharmacist` dashboard.
- **Available Medicines**: The pharmacist sees a real-time list of all available medicines and their current stock fetched from the backend. They can click `Add` to drop items into the current cart.
- **Cart Management**: Inside the cart, the pharmacist can adjust quantities using the `+` and `-` buttons. The system prevents them from adding more items than are physically available in stock.
- **Checkout & Billing**: 
  - The pharmacist enters the Customer's Name.
  - Upon clicking **"Checkout & Print Bill"**, a request is sent to the backend `POST /api/sales` endpoint.
  - **Backend Processing**: 
    1. The backend verifies the stock exists.
    2. It deducts the sold quantities from the database inventory (auto-updating the stock).
    3. It creates a `Sale` and multiple `SaleItem` records in the database.
    4. Finally, it uses **OpenPDF** to construct a downloadable PDF binary of the receipt, returning it to the frontend.
  - **Frontend Processing**: The browser catches the raw PDF file from the API response and natively triggers a file download for the user. The cart is then cleared, and the updated stock quantities are fetched.

---

## Data Models (Database Entities)
- `User`: Stores credentials and role (`ADMIN`, `PHARMACIST`).
- `Supplier`: Stores vendor contact details.
- `Medicine`: Core inventory item, linked to a `Supplier`. Holds `stockQuantity`.
- `Sale`: Represents a single customer checkout transaction. Stores total amount and customer name, linked to the `User` (Pharmacist) who processed it.
- `SaleItem`: Line items for a specific `Sale`, documenting exactly which `Medicine` was sold, in what `quantity`, and at what `priceAtSale` (to preserve historical pricing).
