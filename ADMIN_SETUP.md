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
   - Click "Create Account"

2. **Verify your email** (if email confirmation is enabled in Supabase)

3. **Manually set admin role**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/otfouzqwwlgcbbemsegh/editor)
   - Navigate to **Table Editor** → **profiles**
   - Find the user row with email `hacker@demo.com`
   - Edit the `role` column and change it from `user` to `admin`
   - Click Save

4. **Access the Admin Panel**:
   - Log in with your credentials
   - Click on your profile icon in the header
   - Select "Admin Panel" from the dropdown

### Alternative Method (SQL Query):

You can also set admin role using SQL:

1. Go to [SQL Editor](https://supabase.com/dashboard/project/otfouzqwwlgcbbemsegh/sql/new)
2. Run this query:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'hacker@demo.com';
   ```

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
