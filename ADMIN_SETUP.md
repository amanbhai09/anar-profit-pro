# Admin Setup Instructions

## Creating an Admin User

To set up an admin user for the Anar Profit Calculator:

### Demo Admin Credentials:
- **Email**: hacker@demo.com
- **Password**: demo123 (or any password you choose)

### Steps to Create Admin User:

1. **Sign up for an account** using the credentials above:
   - Go to the `/auth` page
   - Click "Sign up"
   - Enter:
     - Full Name: Hacker Demo
     - Email: hacker@demo.com
     - Password: demo123
   - Complete the captcha verification
   - Click "Create Account"

2. **Verify your email** (if email confirmation is enabled in Supabase)

3. **The user will automatically become admin** because the migration has set the role for `hacker@demo.com`

4. **Access the Admin Panel**:
   - Log in with your credentials
   - Click on your profile icon in the header
   - Select "Admin Panel" from the dropdown

### Alternative Method (Direct Database):

If you want to manually set any user as admin:

1. Go to your Supabase project dashboard
2. Navigate to Table Editor > `profiles` table
3. Find the user's row
4. Update the `role` column to `admin`

## Admin Features:

Once logged in as admin, you can:
- View all user calculations
- See system-wide statistics
- Delete any calculation
- Export all data to CSV
- Monitor profit/loss trends across all users

## Security Notes:

- Admin access is controlled through the `profiles` table `role` column
- RLS policies ensure only admins can access admin functions
- Never share admin credentials
- Change the default password immediately after first login
