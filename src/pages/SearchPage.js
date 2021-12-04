import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Slider from "@mui/material/Slider";
import "../index.css";
import { Button } from "@mui/material";

function valuetext(value) {
  return `${value}g`;
}

export default function SearchPage() {
  const [food, setFood] = useState("");
  const [cals, setCals] = useState([100, 600]);
  const [carbs, setCarbs] = useState([20, 80]);
  const [protiens, setProteins] = useState([20, 80]);
  const [fats, setFats] = useState([20, 80]);

  return (
    <div style={{ backgroundColor: "#f8c02d", height: "100vh" }}>
      <Navbar />

      <div align="center">
        <SearchCont>
          <SearchBar
            type="text"
            placeholder="What do you crave today?"
            onChange={(e) => setFood(e.target.value)}
          />
        </SearchCont>
      </div>

      <div
        align="center"
        style={{
          margin: "0vw 10vw",
          backgroundColor: "white",
          paddingBottom: "20px",
          borderRadius: "15px",
        }}
      >
        <SlidersContainer>
          <div>
            <SubHeading>Calories&nbsp;(kcal)</SubHeading>
            <div style={{ width: "300px" }}>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={cals}
                onChange={(e, val) => setCals(val)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                max={1000}
                step={50}
              />
            </div>
          </div>

          <div>
            <SubHeading>Carbs&nbsp;(g)</SubHeading>
            <div style={{ width: "300px" }}>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={carbs}
                onChange={(e, val) => setCarbs(val)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </div>
          </div>

          <div>
            <SubHeading>Protiens&nbsp;(g)</SubHeading>
            <div style={{ width: "300px" }}>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={protiens}
                onChange={(e, val) => setProteins(val)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </div>
          </div>
          <div>
            <SubHeading>Fats&nbsp;(g)</SubHeading>
            <div style={{ width: "300px" }}>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={fats}
                onChange={(e, val) => setFats(val)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </div>
          </div>
        </SlidersContainer>
        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="warning"
            style={{ width: "15vw" }}
            href={`/results?query=${food}&minCalories=${cals[0]}&maxCalories=${cals[1]}&minCarbs=${carbs[0]}&maxCarbs=${carbs[1]}&minProtein=${protiens[0]}&maxProtein=${protiens[1]}&minFat=${fats[0]}&maxFat=${fats[1]}`}
          >
            Search
          </Button>
        </div>
      </div>

      {/* <div>The main Search Engine page!</div> */}
    </div>
  );
}

const SearchCont = styled.div`
  margin-top: 2vw;
  margin-bottom: 2vw;
`;

const SearchBar = styled.input`
  outline: none;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 50vw;
  height: 35px;
  padding: 10px 10px;
`;

const SlidersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-left: 0vw;
  row-gap: 30px;
  margin-top: 10px;
  /* border: 1px solid #e5e5e5; */
  border-radius: 10px;
  @media (max-width: 904px) {
    display: block;
  }
`;

const SubHeading = styled.p`
  margin-right: 240px;
  font-family: SubHead;
  font-size: 30px;
`;
