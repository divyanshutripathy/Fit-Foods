import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { doc, onSnapshot, updateDoc, arrayUnion } from "@firebase/firestore";
import { loggingContext } from "../App";
import { RecipeContainer, CardLink, sendDetails } from "./SearchResults";
import {
  Card,
  CardContent,
  Button,
  CardMedia,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import db from "../firebase";
import { removeFavourite } from "./SearchResults";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function FavouritesPage() {
  const [recipeLis, setrecipeLis] = useState([]);
  const [loggedIn, setLoggedIn] = useContext(loggingContext);
  const [menu, setMenu] = useState(null);
  const [curRecipe, setCurRecipe] = useState("");

  useEffect(() => {
    if (localStorage.getItem("id") === null) {
      window.location.href = "/";
    }
  }, [loggedIn]);

  useEffect(() => {
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    onSnapshot(docRef, (snapshot) => {
      setrecipeLis(snapshot.data().Favorites);
    });
  }, []);

  const addToSchedule = async (day) => {
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    let key = "Schedule." + day;
    updateDoc(docRef, {
      [key]: arrayUnion(curRecipe),
    });
    setMenu(null);
  };

  return (
    <div>
      <Navbar />
      {recipeLis.length === 0 && (
        <div align="center">
          <h2 style={{ marginTop: "32vh", color: "#fce79b" }}>
            Your Favorite Recipes Appear Here...
          </h2>
        </div>
      )}
      <RecipeContainer>
        {recipeLis.map((recipe) => (
          <Card
            key={recipe.id}
            raised={true}
            sx={{ postion: "relative", minHeight: "360px" }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <CardLink onClick={() => sendDetails(recipe)}>
                <div style={{ justifyContent: "left", color: "black" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {recipe.title}
                    </Typography>
                    <div
                      align="left"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        justifyContent: "left",
                      }}
                    >
                      {recipe.nutrition.nutrients.map((nutrient) => (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          key={nutrient.title}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {nutrient.title}: {Math.round(nutrient.amount)}
                          {nutrient.unit}
                        </Typography>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </CardLink>
              {/* <CardActions></CardActions> */}
              <div
                align="left"
                style={{
                  marginLeft: "10px",
                  top: "320px",
                  zIndex: "101",
                  position: "absolute",
                  display: "flex",
                }}
              >
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => removeFavourite(recipe)}
                >
                  <ThumbUpIcon />
                </IconButton>
                <div style={{ marginLeft: "120px" }}>
                  <Button
                    size="small"
                    color="warning"
                    onClick={(e) => {
                      setMenu(e.currentTarget);
                      setCurRecipe(recipe);
                    }}
                  >
                    Add to Diet
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={menu}
                    keepMounted
                    open={Boolean(menu)}
                    onClose={() => setMenu(null)}
                  >
                    <MenuItem onClick={() => addToSchedule("Monday")}>
                      Monday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Tuesday")}>
                      Tuesday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Wednesday")}>
                      Wednesday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Thursday")}>
                      Thursday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Friday")}>
                      Friday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Saturday")}>
                      Saturday
                    </MenuItem>
                    <MenuItem onClick={() => addToSchedule("Sunday")}>
                      Sunday
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </RecipeContainer>
    </div>
  );
}
