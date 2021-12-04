import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { onSnapshot, doc, updateDoc, arrayRemove } from "@firebase/firestore";
import { loggingContext } from "../App";
import db from "../firebase";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SchedulePage() {
  const [diet, setDiet] = useState({});
  const [loggedIn, setLoggedIn] = useContext(loggingContext);
  const [isFlipped, setIsFlipped] = useState(0);
  const [curDay, setCurDay] = useState("");

  useEffect(() => {
    if (localStorage.getItem("id") === null) {
      window.location.href = "/";
    }
  }, [loggedIn]);

  useEffect(() => {
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    onSnapshot(docRef, (snapshot) => {
      setDiet(snapshot.data().Schedule);
    });
  }, []);

  const delRecipe = async (recipe, day) => {
    const docRef = doc(db, "Users", localStorage.getItem("id"));
    let key = "Schedule." + day;
    await updateDoc(docRef, {
      [key]: arrayRemove(recipe),
    });
  };

  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  return (
    <div style={{ marginBottom: "30px" }} align="center">
      <Navbar />
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => (
        <HorCard>
          <Heading>{day}</Heading>
          <FoodContainer>
            {diet[day] &&
              diet[day].map((recipe) =>
                isTouchDevice() ? (
                  <div
                    onClick={() => {
                      if (isFlipped === recipe.id && curDay === day) {
                        setIsFlipped(0);
                        setCurDay(day);
                      } else {
                        setIsFlipped(recipe.id);
                        setCurDay(day);
                      }
                    }}
                  >
                    <ReactCardFlip
                      isFlipped={isFlipped == recipe.id && curDay == day}
                      flipDirection="horizontal"
                    >
                      <FoodPic src={recipe.image} alt={recipe.title} />
                      <Card
                        raised={true}
                        sx={{ width: "300px", minHeight: "230px" }}
                      >
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
                        <CardActions>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            href={`/details?${recipe.id}`}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            style={{ marginLeft: "70px" }}
                            onClick={() => delRecipe(recipe, day)}
                          >
                            <DeleteIcon color="white" />
                          </Button>
                        </CardActions>
                      </Card>
                    </ReactCardFlip>
                    {/* <RCard>
                    <h3>{recipe.title}</h3>
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
                  </RCard> */}
                  </div>
                ) : (
                  <div
                    onMouseEnter={() => {
                      setIsFlipped(recipe.id);
                      setCurDay(day);
                    }}
                    onMouseLeave={() => {
                      setIsFlipped(0);
                      setCurDay(day);
                    }}
                  >
                    <ReactCardFlip
                      isFlipped={isFlipped == recipe.id && curDay == day}
                      flipDirection="horizontal"
                    >
                      <FoodPic src={recipe.image} alt={recipe.title} />
                      <Card
                        raised={true}
                        sx={{
                          width: "300px",
                          minHeight: "240px",
                        }}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {recipe.title}
                          </Typography>
                          <hr />
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
                        <CardActions>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            href={`/details?${recipe.id}`}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            style={{ marginLeft: "70px" }}
                            onClick={() => delRecipe(recipe, day)}
                          >
                            <DeleteIcon color="white" />
                          </Button>
                        </CardActions>
                      </Card>
                    </ReactCardFlip>
                    {/* <RCard>
                    <h3>{recipe.title}</h3>
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
                  </RCard> */}
                  </div>
                )
              )}
          </FoodContainer>
        </HorCard>
      ))}
    </div>
  );
}

const FoodPic = styled.img`
  height: 236px;
  box-shadow: 5px 5px 5px #e5e5e5;
  border-radius: 5px;
`;

const FoodContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 20px;
  margin-bottom: 0px;
  @media (min-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Heading = styled.p`
  font-family: SubHead;
  font-size: 30px;
  padding-top: 10px;
`;

const HorCard = styled.div`
  border-radius: 10px;
  background-color: white;
  width: 90%;
  margin-left: 3vw;
  min-height: 200px;
  padding: 0px 10px;
  margin-top: 20px;
  padding-bottom: 30px;
`;

const RCard = styled.div`
  width: 280px;
  min-height: 300px;
  background-color: white;
  border-radius: 25px;
  box-shadow: 5px 5px 10px 10px #e5e5e5;
`;
