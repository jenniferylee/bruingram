Bruingram

Bruingram is a web application modelled after instagram.com. In Bruingram, you can register using your email, create a custom profile page, search for friends, and interact with 
the posts and profiles of friends. We decided to model our project after instagram because it is an application that we are all experienced with, and because instagram provided a
challenging model for a networked application.

In Bruingram, we have chosen several different software tools to build with. Our server-side data is stored by Google Firebase. Our front-end is built using both MaterialUI's 'Joy'
library and React.JS. Our routing system was built using React-Router-Dom. The security of Bruingram is built Firebase authentication and the React-Router-Dom.

Bruingram consists of a dynamic Home, Profile, and Favorites page, as well as a concrete Authentication Page. Bruingram sign up requires an email address, name, username, password,
major, and graduation year. Once your sign up has been authenticated you are allowed to visit the rest of Bruingram, as Bruingram is prevented from being viewed by individuals who
are not listed in our Firestore database. We recommend beginning by adding features to your own profile page.In your own profile, you can click 'edit profile' to add a profile photo
and biography, your major and graduation year will already populate here from your sign up input. Your profile page is also where you create your own posts! Every post is made up of
a photo and a caption. Your profile and posts, as well as those from other Bruingram users will populate on the Home page. On the Home Page you can view, like, and comment on the posts
of friends, you can view and 'favorite' the profiles of friends, and you can filter your home page to only show Bruingram users with a given graduation year and major. If you would only
like to view the profiles and posts of 'favorited' users, you can do so on the Bruingram Favorites page! To navigate between the pages of Bruingram, you can use the navigation bar on
the left! When you are all done with your Bruingram session, you can logout using 'Logout' on the navigation bar!

To deploy Bruingram 
Change into the 'better-instagram' directory.
run 'npm install'
run 'npm run dev'
A link to a local hosting of our 'Bruingram' should generate!


Contributors

Chaidhat Chaimongkol                   
Daniel Fenex
Elizabeth Moh
Jennifer Lee
Richelle Shim
Yousra Merzougui
