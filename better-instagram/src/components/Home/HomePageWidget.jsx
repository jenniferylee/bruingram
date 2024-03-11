import { useRef, useState, useEffect } from 'react';
import { firestore } from '../../firebase/firebase';
import { setDoc, addDoc, deleteDoc, collection, doc, query, getDocs, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import Avatar from "@mui/joy/Avatar";

// import all custom styling from MUI
import { Card, Stack, Typography, AspectRatio, Grid, IconButton } from "@mui/joy";
import { FavoriteRounded, FavoriteBorderRounded, SchoolOutlined, BackpackOutlined } from '@mui/icons-material';

const storage = getStorage();

function HomePageWidget ({ name, desc, major, year, uid, imageSrc , isFavorited, handleGoToProfile }) {
    const [favorited, setFavorited] = useState(false);
    const imageSrcFull = `assets/profilepics/${imageSrc}.png`
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Check favorited status from localStorage when component mounts
        const isFavorited = localStorage.getItem(uid) === 'true';
        setFavorited(isFavorited);
    }, [uid]);

    const toggleFavorite = () => {
        const newFavorited = !favorited;
        setFavorited(newFavorited);
        localStorage.setItem(uid, newFavorited ? 'true' : 'false');
        // Call updateFirestore with newFavorited
        updateFirestore(newFavorited);
    };
    

    const updateFirestore = async (newFavorited) => {
        try {
            const favoritedRef = collection(firestore, "favoritedprofiles");
            const favoritedQuery = query(
                favoritedRef,
                where("favoriteduid", "==", uid)
            );
            const favoritedSnapshot = await getDocs(favoritedQuery);
            
            // Check if the profile is already favorited
            const isAlreadyFavorited = !favoritedSnapshot.empty;
    
            if (isAlreadyFavorited) {
                // Profile is already favorited, so remove it from Firestore
                favoritedSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                localStorage.setItem(uid, 'false'); // Update local storage
                setFavorited(false); // Update local state to reflect unfavorited status
            } else {
                // Profile is not favorited, so add it to Firestore
                await addDoc(favoritedRef, {
                    favoriteduid: uid,
                    personaluid: "TODO"
                });
                localStorage.setItem(uid, 'true'); // Update local storage
                setFavorited(true); // Update local state to reflect favorited status
            }
        } catch (error) {
            console.error("Error updating favorited profile in Firestore: ", error);
        }
    };


    return <>
    <Card 
        sx={{
            boxShadow: 'lg',
            px: 4,
            py: 4
        }}
    >
        <Grid container spacing={2}>
            <div onClick={handleGoToProfile}>
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={5} sx={{ width: 500, height: 200 }}>
                    <AspectRatio
                        ratio="1"
                        sx={{ flex: 1, maxWidth: 180, borderRadius: '100%' }}
                    >
                        <Avatar src={imageSrc} sx={{ width: 180, height: 180 }} />
                        
                    </AspectRatio>
                    
                    <Stack direction="column" alignItems="flex-start" justifyContent="center" spacing={1}>
                        <Typography level="h2" textAlign="start">
                            {name}
                        </Typography>
                        <Typography level="p" textAlign="start" sx={{ pb: 1.5 }}>
                            {desc}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <BackpackOutlined sx={{ fontSize: 30 }} />
                            <Typography level="p">
                                {major}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <SchoolOutlined sx={{ fontSize: 30 }} />
                            <Typography level="p">
                                Class of '{year}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            </div>
            <Grid item>
            <IconButton variant="plain" onClick={toggleFavorite}>
                        {favorited ? (
                            <FavoriteRounded sx={{ fontSize: 30, color: "red" }} />
                        ) : (
                            <FavoriteBorderRounded sx={{ fontSize: 30 }} />
                        )}
                    </IconButton>
            </Grid>
        </Grid>
    </Card>
    </>;
}

export default HomePageWidget;