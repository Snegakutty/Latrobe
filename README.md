 Echom: Ecommerce website for visually impaired



 Features

 Customer Interface (Frontend)
- Responsive Design: Developed with React, echom offers a fully responsive interface that adapts to various devices, from desktops to mobile screens, ensuring an optimized user experience.
- voice based interaction: SpeechRecognition.
  
 Admin Panel
- User Management: Admins can view and manage user accounts, including customer and delivery personnel information.
- Menu and Restaurant Management: Easily add, edit, and delete items, categories to keep the offerings up to date.
- Order Tracking: Real-time monitoring of active and past orders, with controls to update the order status (e.g., received, in-progress, completed, delivered).
- Analytics: Track key metrics like popular items, order frequency, and user activity to make informed decisions and improve services.

 Backend (Server)
- API Development: Built with Express, the backend provides RESTful APIs to handle requests, manage authentication, and connect the frontend and admin panel to the MongoDB database.
- Data Storage: MongoDB is used for storing user profiles, order details, restaurant data, and items in a scalable and efficient manner.
- Real-Time Updates: With WebSockets, users receive live updates on their order status from the moment they place it until delivery.
- Security: Data protection and secure endpoints, with encrypted user information and secure payment processing via Stripe.

 Technology Stack
- Frontend: React, CSS3, Bootstrap/Material UI for styling, and Stripe integration for payment processing.
- Backend: Node.js with Express.js, and WebSockets for real-time updates.
- Database: MongoDB for efficient, scalable data storage.
- Payment Integration: Stripe for secure and seamless payment processing.

 Getting Started
1. Clone the Repository: `git clone <repo-url>`
2. Install Dependencies: 
   ```bash
   cd frontend
   npm install
   cd backend
   npm install
   ```
3. Set Up Environment Variables: Add environment variables for MongoDB, Stripe keys, and JWT secrets in a `.env` file.
4. Run the Application:
   - Start the frontend: `npm run dev` from the frontend folder.
   - Start the backend: `node server.js` from the backend folder.


 Contribution Guidelines
Feel free to contribute to echom by forking this repository, creating a new branch, and submitting a pull request. Please make sure to follow standard coding practices and add meaningful comments to your code.

Enjoy exploring the code and features of echom, and feel free to reach out for any questions or suggestions!
