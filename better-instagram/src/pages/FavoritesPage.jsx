import { useState, useEffect } from "react";
import Stack from "@mui/joy/Stack";
import HomePageWidget from "../components/Home/HomePageWidget";
import { styled } from "@mui/joy/styles";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import NavBar from "../components/NavBar/NavBar";
import { firestore } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import useAuthStore from "../store/authStore";


const Item = styled("div")(({ theme }) => ({
  ...theme.typography["body-sm"],
  textAlign: "center",
  fontWeight: theme.fontWeight.md,
  color: theme.vars.palette.text.secondary,
  border: "1px solid",
  borderColor: theme.palette.divider,
  padding: theme.spacing(2),
  borderRadius: theme.radius.md,
}));

const FavoritesPage = () => {
  // Define an array of user data (for demonstration purposes) **not used right now
  
  const[favoritesList, setFavoritesList] = useState([]);
  const[favoriteUsersList, setFavoriteUsersList] = useState([]);
  const favoritesCollectionRef = collection(firestore, 'favoritedprofiles')
  const [userWithImageList, setUserWithImageList] = useState([]) //List of users with profile pictures loaded
 
  useEffect(() => {
    const fetchFavorites = async () => {
        try {
            const favoritesData = await getDocs(collection(firestore, 'favoritedprofiles'));
            const favorites = favoritesData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFavoritesList(favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    fetchFavorites();
}, []);


/*useEffect(() => {
  const fetchFavoriteUsers = async () => {
      try {
          const currentUser = useAuthStore((state) => state.user());
          if (!currentUser) {
              console.log("User not logged in");
              return;
          }

          const filteredFavorites = favoritesList.filter(favorite => favorite.personaluid === currentUser.uid);

          const usersData = await Promise.all(
              filteredFavorites.map(async favorite => {
                  const userDoc = await getDoc(doc(collection(firestore, 'users'), favorite.favoriteduid));
                  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
              })
          );
          const filteredUsers = usersData.filter(user => user !== null);
          console.log("Filtered users:", filteredUsers);
          setFavoriteUsersList(filteredUsers);
      } catch (error) {
          console.error('Error fetching favorite users:', error);
      }
  };

  fetchFavoriteUsers();
}, [favoritesList]);*/

useEffect(() => {
  const fetchFavoriteUsers = async () => {
      try {
          const currentUser = useAuthStore((state) => state.user());
          if (!currentUser) {
              console.log("User not logged in");
              return;
          }

          const userFavoritesQuery = query(
              collection(firestore, 'favoritedprofiles'),
              where("personaluid", "==", currentUser.uid)
          );
          const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
          const userFavorites = userFavoritesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const usersData = await Promise.all(
              userFavorites.map(async favorite => {
                  const userDoc = await getDoc(doc(collection(firestore, 'users'), favorite.favoriteduid));
                  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
              })
          );
          const filteredUsers = usersData.filter(user => user !== null);
          console.log("Filtered users:", filteredUsers);
          setFavoriteUsersList(filteredUsers);
      } catch (error) {
          console.error('Error fetching favorite users:', error);
      }
  };

  fetchFavoriteUsers();
}, []);


useEffect(() => {
    const fetchFavoriteUsers = async () => {
        try {
            const usersData = await Promise.all(
                favoritesList.map(async favorite => {
                    const userDoc = await getDoc(doc(collection(firestore, 'users'), favorite.favoriteduid));
                    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
                })
            );
            const filteredUsers = usersData.filter(user => user !== null);
            console.log("Filtered users:", filteredUsers);
            setFavoriteUsersList(filteredUsers);
        } catch (error) {
            console.error('Error fetching favorite users:', error);
        }
    };

    fetchFavoriteUsers();
}, [favoritesList]);


useEffect(() => {
  //Load in user profile pictures
  const loadImages = async () => {
      const storage = getStorage();
      const newFavUsersList = []; 

      for (const favoriteuser of favoriteUsersList) {
          try {
              let url = null;
              if(favoriteuser.profilePicURL){
                url = await getDownloadURL(ref(storage, favoriteuser.profilePicURL));      
              }  
              const newfavUser = {
                  ...favoriteuser,
                  profilePicURL: url 
              };
              newFavUsersList.push(newfavUser);
              console.log('url', url);
          } catch (error) {
              console.error('Error fetching profile picture for user:', user.id);
          }
      }
      setUserWithImageList(newFavUsersList);
  };

  loadImages();
}, [favoriteUsersList]);



  return (
    <>
      <Stack direction="row">
        <NavBar />

        <div className="FavoritesPage">
          <Favorite
            sx={{
              position: "absolute",
              top: "25px",
              right: "25px",
              fontSize: 45,
              color: "black",
            }}
          />
          <Stack spacing={3}>
          {userWithImageList.map(user => (
            <HomePageWidget
            key={user.id}
            name={user.fullName}
            desc={user.desc}
            major={user.major}
            year={user.year}
            uid={user.id}
            imageSrc={user.profilePicURL}
            
            />
          ))}
        </Stack> 
        </div>
      </Stack>
    </>
  );
};

export default FavoritesPage;

