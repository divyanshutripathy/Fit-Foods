import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Menu,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import sample_data from "../assets/sample_data.json";
import { loggingContext } from "../App";
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import db from "../firebase";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export const addFavourite = async (recipe) => {
  const docRef = doc(db, "Users", localStorage.getItem("id"));
  updateDoc(docRef, {
    Favorites: arrayUnion(recipe),
    FavoriteIDs: arrayUnion(recipe.id),
  });
};

export const removeFavourite = async (recipe) => {
  const docRef = doc(db, "Users", localStorage.getItem("id"));
  updateDoc(docRef, {
    Favorites: arrayRemove(recipe),
    FavoriteIDs: arrayRemove(recipe.id),
  });
};

export const sendDetails = (recipe) => {
  localStorage.setItem("Cals", recipe.nutrition.nutrients[0].amount);
  localStorage.setItem("Prots", recipe.nutrition.nutrients[1].amount);
  localStorage.setItem("Fat", recipe.nutrition.nutrients[2].amount);
  localStorage.setItem("Carbs", recipe.nutrition.nutrients[3].amount);
  localStorage.setItem("FoodPic", recipe.image);
  window.location.href = `/details?${recipe.id}`;
};

export default function SearchResults({ match, location }) {
  const [recipeLis, setRecipeLis] = useState({ results: [] });
  const [loggedIn, setLoggedIn] = useContext(loggingContext);
  const [favorites, setFavorites] = useState([]);
  const [menu, setMenu] = useState(null);
  const [curRecipe, setCurRecipe] = useState([]);

  useEffect(() => {
    let queryParams = getQueryParams();
    fetchRecipes(queryParams);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      onSnapshot(doc(db, "Users", localStorage.getItem("id")), (snapshot) => {
        setFavorites(snapshot.data().FavoriteIDs);
      });
    }
  }, [loggedIn]);

  const getQueryParams = () => {
    let query = location.search;
    let res = {};
    let key = "";
    let value = "";
    let flag = true;
    for (let i = 1; i < query.length; i++) {
      if (query[i] === "&") {
        res[key] = value;
        key = "";
        value = "";
        flag = true;
        continue;
      }
      if (query[i] === "=") {
        flag = false;
        continue;
      }
      if (flag) {
        key = key + query[i];
      } else {
        value = value + query[i];
      }
    }
    res[key] = value;
    return res;
  };

  const fetchRecipes = async (queryParams) => {
    const req = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${queryParams.query}&number=16&minCalories=${queryParams.minCalories}&maxCalories=${queryParams.maxCalories}&minCarbs=${queryParams.minCarbs}&maxCarbs=${queryParams.maxCarbs}&minProtein=${queryParams.minProtein}&maxProtein=${queryParams.maxProtein}&minFat=${queryParams.minFat}&maxFat=${queryParams.maxFat}&apiKey=cc462cd9e5504fa88448e2154495b95b`
    );
    const recipes = await req.json();
    for (let i = 0; i < recipes.results.length; i++) {
      if (recipes.results[i].title.length > 52) {
        recipes.results[i].title =
          recipes.results[i].title.slice(0, 52) + "...";
      }
    }
    setRecipeLis(recipes);
  };

  const recursiveFunction = function (arr, x, start, end) {
    if (start > end) return false;
    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === x) return true;
    if (arr[mid] > x) return recursiveFunction(arr, x, start, mid - 1);
    else return recursiveFunction(arr, x, mid + 1, end);
  };

  const contains = (obj, lis) => {
    // return recursiveFunction(lis, obj, 0, lis.length - 1);
    for (let i = 0; i < lis.length; i++) {
      if (lis[i] === obj) {
        return true;
      }
    }
    return false;
  };

  const addToSchedule = async (day) => {
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    let key = "Schedule." + day;
    updateDoc(docRef, {
      [key]: arrayUnion(curRecipe),
    });
    setMenu(null);
  };

  return (
    <div style={{ backgroundColor: "#f8c02d", height: "max(100%, 100vh)" }}>
      <Navbar />
      {/* <Button variant="outlined" onClick={tempFunc}>
        Log Data
      </Button> */}
      {loggedIn ? (
        <RecipeContainer>
          {recipeLis.results.map((recipe) => (
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
                    alignContent: "space-between",
                  }}
                >
                  {contains(recipe.id, favorites) ? (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={(e) => removeFavourite(recipe)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={(e) => addFavourite(recipe)}
                    >
                      <ThumbUpAltOutlinedIcon />
                    </IconButton>
                  )}
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
      ) : (
        <RecipeContainer>
          {recipeLis.results.map((recipe) => (
            <Card
              key={recipe.id}
              raised={true}
              sx={{ postion: "relative", minHeight: "300px" }}
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
              </div>
            </Card>
            // <RCard>
            //   <div style={{ display: "flex" }}>
            //     <FoodPic src={recipe.image} alt={recipe.title} />
            //   </div>
            // </RCard>
          ))}
        </RecipeContainer>
      )}
    </div>
  );
}

// const RCard = styled.div`
//   width: 280px;
//   min-height: 300px;
//   background-color: white;
//   border-radius: 25px;
//   justify-content: left;
// `;

export const RecipeContainer = styled.div`
  margin: 30px 30px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  column-gap: 20px;
  row-gap: 20px;
  padding-bottom: 20px;
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const CardLink = styled.a`
  text-decoration: none;
  :hover {
    cursor: pointer;
  }
`;

// const FoodPic = styled.img`
//   border-radius: 20%;
//   width: 200px;
//   margin: 10px;
// `;
