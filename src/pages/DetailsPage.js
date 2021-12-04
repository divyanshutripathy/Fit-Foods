import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import sample_details from "../assets/sample_details.json";
import vege_mark from "../assets/vege_mark.svg";
import vegan from "../assets/vegan.png";
import nonveg from "../assets/nonveg.png";
import { Button } from "@mui/material";
import { onSnapshot, doc, updateDoc, arrayUnion } from "@firebase/firestore";
import db from "../firebase";
import { addFavourite, removeFavourite } from "./SearchResults";
import { Menu, MenuItem } from "@mui/material";
import { loggingContext } from "../App";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function DetailsPage({ match, location }) {
  const [recipeData, setRecipeData] = useState({});
  const [ingredients, setIngredients] = useState("");
  const [favList, setFavList] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loggedIn, setLoggedIn] = useContext(loggingContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (recipeData.title) {
      let arr = recipeData.extendedIngredients.map((data) =>
        toTitleCase(data.name)
      );
      setIngredients(arr.join(", "));
    }
  }, [recipeData]);

  useEffect(() => {
    if (loggedIn) {
      const docRef = doc(db, "Users", localStorage.getItem("id"));
      onSnapshot(docRef, (snapshot) => {
        setFavList(snapshot.data().FavoriteIDs);
      });
    }
  }, [loggedIn]);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const fetchData = async () => {
    const req = await fetch(
      `https://api.spoonacular.com/recipes/${location.search.slice(
        1,
        location.search.length
      )}/information?includeNutrition=true&apiKey=cc462cd9e5504fa88448e2154495b95b`
    );
    const recipeDetail = await req.json();
    console.log("Recipe Details:", recipeDetail);
    setRecipeData(recipeDetail);
  };

  const addFav = async () => {
    let data = {
      id: recipeData.id,
      image: localStorage.getItem("FoodPic"),
      imageType: recipeData.imageType,
      title: recipeData.title,
      nutrition: {
        nutrients: [
          {
            amount: parseFloat(localStorage.getItem("Cals")),
            name: "Calories",
            title: "Calories",
            unit: "kcal",
          },
          {
            amount: parseFloat(localStorage.getItem("Prots")),
            name: "Protein",
            title: "Protein",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Fat")),
            name: "Fat",
            title: "Fat",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Carbs")),
            name: "Carbohydrates",
            title: "Carbohydrates",
            unit: "g",
          },
        ],
      },
    };
    addFavourite(data);
  };

  const remFav = async () => {
    let data = {
      id: recipeData.id,
      image: localStorage.getItem("FoodPic"),
      imageType: recipeData.imageType,
      title: recipeData.title,
      nutrition: {
        nutrients: [
          {
            amount: parseFloat(localStorage.getItem("Cals")),
            name: "Calories",
            title: "Calories",
            unit: "kcal",
          },
          {
            amount: parseFloat(localStorage.getItem("Prots")),
            name: "Protein",
            title: "Protein",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Fat")),
            name: "Fat",
            title: "Fat",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Carbs")),
            name: "Carbohydrates",
            title: "Carbohydrates",
            unit: "g",
          },
        ],
      },
    };
    removeFavourite(data);
  };

  const addToSchedule = async (day) => {
    let data = {
      id: recipeData.id,
      image: localStorage.getItem("FoodPic"),
      imageType: recipeData.imageType,
      title: recipeData.title,
      nutrition: {
        nutrients: [
          {
            amount: parseFloat(localStorage.getItem("Cals")),
            name: "Calories",
            title: "Calories",
            unit: "kcal",
          },
          {
            amount: parseFloat(localStorage.getItem("Prots")),
            name: "Protein",
            title: "Protein",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Fat")),
            name: "Fat",
            title: "Fat",
            unit: "g",
          },
          {
            amount: parseFloat(localStorage.getItem("Carbs")),
            name: "Carbohydrates",
            title: "Carbohydrates",
            unit: "g",
          },
        ],
      },
    };
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    let key = "Schedule." + day;
    updateDoc(docRef, {
      [key]: arrayUnion(data),
    });
    setMenu(null);
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

  return (
    <div>
      <Navbar />
      {recipeData.title && (
        <RecipeContainer>
          <Header>
            <div align="center">
              <FoodPic src={recipeData.image} alt="Food Image" />
            </div>
            <Intro align="left">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3
                  style={{
                    fontSize: "30px",
                    marginRight: "10px",
                  }}
                >
                  {recipeData.title}{" "}
                  {recipeData.vegan ? (
                    <img src={vegan} alt="Vegan" style={{ width: "30px" }} />
                  ) : recipeData.vegetarian ? (
                    <img src={vege_mark} alt="Veg" style={{ width: "28px" }} />
                  ) : (
                    <img src={nonveg} alt="Non-Veg" style={{ width: "35px" }} />
                  )}
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Ingredients:&nbsp;{ingredients}
              </div>
              <Flex>
                {/* <p style={{ marginRight: "10px" }}>
                <span>Health Score:</span> {recipeData.healthScore}
              </p> */}
                <p style={{ marginRight: "10px" }}>
                  Servings: {recipeData.servings}
                </p>
                <p style={{ marginRight: "10px" }}>
                  Price Per Serving: ₹{recipeData.pricePerServing}
                </p>
                <p style={{ marginRight: "10px" }}>
                  Ready In: {recipeData.readyInMinutes} mins
                </p>
              </Flex>
              {loggedIn && (
                <Flex>
                  {contains(recipeData.id, favList) ? (
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ marginRight: "10px" }}
                      onClick={() => remFav()}
                    >
                      <ThumbUpIcon color="white" />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ marginRight: "10px" }}
                      onClick={() => addFav()}
                    >
                      <ThumbUpAltOutlinedIcon color="white" />
                    </Button>
                  )}
                  <div>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={(e) => setMenu(e.currentTarget)}
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
                </Flex>
              )}
            </Intro>
          </Header>
          <Para style={{ fontFamily: "Proza Libre" }}>
            <h2>Summary</h2>
            <p
              dangerouslySetInnerHTML={{ __html: recipeData.summary }}
              style={{ marginLeft: "20px" }}
            />
            {recipeData.analyzedInstructions[0] && (
              <>
                <h2>Steps</h2>
                <ol>
                  {recipeData.analyzedInstructions[0].steps.map((inst) => (
                    <li style={{ marginBottom: "10px" }} key={inst.number}>
                      {inst.step}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Para>
        </RecipeContainer>
      )}
    </div>
  );
}

const Intro = styled.div`
  font-family: Proza Libre;
  @media (max-width: 870px) {
    padding-left: 10px;
    margin-bottom: 10px;
  }
`;

const RecipeContainer = styled.div`
  margin: 0vw 5vw;
  row-gap: 30px;
  border-radius: 10px;
  background-color: white;
  min-height: 80vh;
  margin-top: 25px;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  @media (max-width: 870px) {
    flex-direction: column;
  }
`;

const FoodPic = styled.img`
  width: 300px;
  margin: 20px 20px;
  border-radius: 10px;
  @media (max-width: 870px) {
    width: 80%;
  }
`;

const Para = styled.div`
  padding: 0px 1vw;
  margin-top: -20px;
`;

const Flex = styled.div`
  display: flex;
`;

const Icon = styled.img`
  width: 25px;
`;

const ImageCont = styled.div`
  width: 1vw;
`;
