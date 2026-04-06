# Crowdfunding Front End
author: Maria Alistratova

The name of the project is **Generousource**
Deployment link (Netlify): https://generousource.netlify.app/

#### About the project 
This project is a web platform that allows registered users to create fundraising initiatives for various causes and support other users’ initiatives through monetary donations. Users can make donations in any amount, provided that the total pledged amount does not exceed the fundraising target.

#### Intended Audience
The platform is intended for individuals who wish to raise funds for personal, social, or community causes, as well as for users who want to contribute financially to initiatives created by others.
It can also be integrated into a company’s internal processes, allowing employees to create fundraising initiatives for their needs.

#### Key features
##### User Features:
- User Authentication - Registration and Login system with token-based authentication
- Browse Fundraisers - View all active fundraisers on the homepage, organized by category:
    - My Fundraisers (created by the user)
    - Supported Fundraisers (ones the user has pledged to)
    - Open Fundraisers (available to support)
    - Completed Fundraisers (reached their funding goal)
- Create Fundraisers - Users can start new fundraising campaigns with goals and descriptions
- Make Pledges - Users can donate/pledge money to fundraisers
- View Fundraiser Details - Full details of each campaign including progress, pledges, and contributions
- Edit Fundraisers - Owners can modify their fundraiser details
- Delete Fundraisers - Soft delete functionality (can be restored by admins)
- Profile Management - Users can view and edit their profile (name, email, username, password)
- Delete Account - Users can delete their own account
##### Admin Features:
- Fundraiser Management - View, search, and manage all fundraisers; restore deleted ones
- User Management - View, search, and manage all users; restore deleted users
- Activity Logs - Track system activities
- Deleted Items Recovery - Restore deleted fundraisers and users
- Search Functionality - Search fundraisers and users
##### Technical Features:
- Modal notifications for user feedback (success, confirmation, error messages)
- Responsive navigation bar
- Role-based access control (admin vs regular users)


