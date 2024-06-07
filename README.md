# [Echo NextJs](https://echo-next-js.vercel.app)

This is a social media project. User can register and manage their profile. Users can sign up and create posts and share their thoughts, like and repost other's posts. Users can also create a community and manage it like updating community info, send join invitation, accept join requests and kick any member. Other users can search communities and send join request. There is also a search page where users can search other useres and visit their profile and see their posts. NextJs server side rendering and server actions is heavily used in this project to take the full benefits if NextJs framework. NextJs built-in loading page and ReactJs suspense component is utilized to show loading states.

### [Visit Site](https://echo-next-js.vercel.app)

## Technology

1.  NextJs
2.  Mongoose
3.  React Hook Form
4.  Shadcn UI
5.  Tailwind CSS
6.  Zod
7.  Uploadthing
8.  TypeScript
9.  NodeMailer
10. React Intersection Observer
11. Jose
12. BcryptJs

### Highlighted Functionalities

1. Server Side Rendering
2. Server Actions for data fetching and form submission
3. Verification of email by verification code while sign up
4. Forgot Password system by Reset Link sent by email
5. Infinite Scrolling in Homepage, Profile page and community page
6. Notification System
7. Fully Responsive Design
8. MongoDB Aggregations for complex queries

## Run the project in your local mechine

### Requirements

- Node Js (Make sure you have node js installed on your mechine).

### Installation

1. Clone this repo:
   - `git clone https://github.com/NaZmuZ-SaKiB/Echo-Next-Js.git`
2. Install all necessary dependencies:
   - `cd Echo-Next-Js`
   - `npm install` or `yarn`
3. Create a `.env` file in current directory and add following properties:

   - `MONGODB_URL` = mongodb connection url
   - `UPLOADTHING_SECRET` = secret from uploadthing
   - `UPLOADTHING_APP_ID` = uploadthing app ID
   - `NODE_MAILER_EMAIL` = nodemailer email
   - `NODE_MAILER_EMAIL_PASSWORD` = nodemailer email password
   - `JWT_SECRET` = secret string for jwt token
   - `JWT_EXPIRES_IN` = expiration date for jwt token
   - `LIVE_SITE_URL` = url of the website (use localhost in development)

4. Run the development server using following command:
   - `npm run dev` or `yarn dev`
5. To build the project run following command:
   - `npm run build` or `yarn build`
6. To run the build version of the project run following command:

   - `npm run start` or `yarn start`

### Routes

- **/ : Home Page** - Shows all the new posts by all users and communities using **Infinite Scrolling** system.

- **/sign-up** : User registration page. Email validation using verification code is required.
- **/sign-in** : User login page
- **/forgot-password** : If user forgot the password he/she can enter his/her email to recieve a password reset link.
- **/reset-password/:token** : From Verification Email user is redirected to this password reset page.
- **/change-password** : Password update page. From `/profile/edit` page user can navigate to this page.
- **/profile/:id** : User profile page with user's **Posts** and **Replies** sections with **Infinite Scrolling** system. If user is the logged in user then he/she can edit the profile.
- **/profile/edit** : User can update profile image, name, username and bio from this page and also can navigate to password change page.
- **/communities/:id** : Community profile page with communities's **Posts**, **Members** and **Requests** sections with **Infinite Scrolling** system. If community belongs to the logged in user then he/she can edit the community info, Invite people, see requests and manage them and kick members.
- **/communities/edit/:id** : User can update community image, name, username and bio from this page.
- **/communities/invite/:id** : User can invite other users to his/her community by searching.
- **/search** : User can search other users by name, username and email and view their profile.
- **/create-echo** : Post page. User can share his/her thoughts here and also select to add this post from one of his/her community.
- **/echo/:id** : Single Post page with all the reposts or comments of this post. User can **Like** and **Comment** any post.
- **/activity** : User can see the notifications from this page. Unread notificatons have a purple dot at the left side.

### Deployment

1. Create a github repo and push all the code.
2. Go to [vercel.com](https://vercel.com) and create an account.
3. From dashboard click `Add New` and select `Project`
4. Find your github repo and click on `Import`
5. Wait for the build to complete
