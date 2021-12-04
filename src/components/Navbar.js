import React, { useState, useEffect, useContext } from "react";
import AppID from "ibmcloud-appid-js";
import styled from "styled-components";
import {
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import db from "../firebase";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { loggingContext } from "../App";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useContext(loggingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [menu, setMenu] = useState(null);
  const appID = React.useMemo(() => {
    return new AppID();
  }, []);

  (async () => {
    try {
      await appID.init({
        clientId: "fb8c5bb2-258b-4f41-97af-7b969129a23c",
        discoveryEndpoint:
          "https://eu-gb.appid.cloud.ibm.com/oauth/v4/c60f2a69-d5a9-47eb-8fc6-ff40ed2eecf1/.well-known/openid-configuration",
      });
    } catch (e) {
      console.log(e.message);
    }
  })();

  useEffect(() => {
    if (localStorage.getItem("id")) {
      setLoggedIn(true);
    }
  }, []);

  // useEffect(() => {
  //   onSnapshot(collection(db, "Users"), (snapshot) => {
  //     console.log(snapshot.docs[0].data());
  //   });
  // }, []);

  const loginAction = async () => {
    try {
      setIsLoading(true);
      const tokens = await appID.signin();
      // setUserName(tokens.idTokenPayload.name);
      localStorage.setItem("fname", tokens.idTokenPayload.given_name);
      localStorage.setItem("lname", tokens.idTokenPayload.family_name);
      localStorage.setItem("id", tokens.idTokenPayload.identities[0].id);
      localStorage.setItem("DP", tokens.idTokenPayload.picture);
      let docRef = doc(db, "Users", tokens.idTokenPayload.identities[0].id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "Users", tokens.idTokenPayload.identities[0].id), {
          Fname: tokens.idTokenPayload.given_name,
          Lname: tokens.idTokenPayload.family_name,
          Favorites: [],
          FavoriteIDs: [],
          Schedule: {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          },
        });
      }
      setLoggedIn(true);
      setIsLoading(false);
      setMenu(null);
    } catch (e) {
      console.log(e.message);
    }
  };

  const logoutAction = async () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <Nav>
      <Heading>
        <a href="/">
          <img
            src="/logo.png"
            alt="Not Loading"
            style={{ width: "10pc", borderRadius: "10px" }}
          />
        </a>
      </Heading>
      <RightContainer>
        {isLoading ? (
          <CircularProgress color="warning" />
        ) : loggedIn ? (
          localStorage.getItem("DP") === "undefined" ? (
            <div>
              <IconButton onClick={(e) => setMenu(e.currentTarget)}>
                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                  {localStorage.getItem("fname")[0] +
                    localStorage.getItem("lname")[0]}
                </Avatar>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={menu}
                keepMounted
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
              >
                <a
                  href="favourites"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>View Favourites</MenuItem>
                </a>
                <a
                  href="diet"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>View Diet</MenuItem>
                </a>
                <MenuItem onClick={logoutAction}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <IconButton onClick={(e) => setMenu(e.currentTarget)}>
                <Avatar
                  sx={{ bgcolor: deepOrange[500] }}
                  src={localStorage.getItem("DP")}
                />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={menu}
                keepMounted
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
              >
                <a
                  href="favourites"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>View Favourites</MenuItem>
                </a>
                <a
                  href="diet"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem>View Diet</MenuItem>
                </a>
                <MenuItem onClick={logoutAction}>Logout</MenuItem>
              </Menu>
            </div>
          )
        ) : (
          <Button color="warning" variant="contained" onClick={loginAction}>
            Login
          </Button>
        )}
      </RightContainer>
    </Nav>
  );
}

const Nav = styled.nav`
  height: 68px;
  background-color: white;
  /* border-bottom: 1px solid #e5e5e5; */
  display: flex;
  justify-content: space-between;
  background-image: url("/back2.webp");
  background-size: cover;
  align-items: center;
`;

const Heading = styled.div`
  margin-left: 1vw;
`;

const RightContainer = styled.div`
  margin-right: 20px;
`;
