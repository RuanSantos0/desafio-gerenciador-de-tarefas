import { useCallback, useEffect, useState } from "react";

import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { getAll } from "../services/user";

//Material UI Imports
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import FaceIcon from "@mui/icons-material/Face";
import LockIcon from "@mui/icons-material/Lock";
import Grid from "@mui/material/Grid";

// import { get, getAll, post } from "../services/todo";

export const Auth = () => {
  const [checked, setChecked] = useState("login-btn");
  // const [search, setSearch] = useState("second");

  const fetchAllList = useCallback(async () => {
    const req = await getAll();
    console.log(req);
  }, []);

  // const fetchBySearch = useCallback(async () => {
  //   const req = await get({ search });
  //   console.log(req);
  // }, [search]);

  useEffect(() => {
    fetchAllList();
  }, [fetchAllList]);

  // useEffect(() => {
  //   fetchBySearch();
  // }, [fetchBySearch, search]);

  // const buttonPressionado = () => {
  //   post({ name: search, date: new Date().toJSON().split("T")[0] });
  //   fetchAllList();
  // };

  const handleAuthentication = (event: any) => {
    setChecked(event.target.id);
  };

  return (
    <div className="auth__container ">
      <Paper className="auth__paper" elevation={3}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img className="auth__logo" src="logo.png" alt="logo" />
        </div>
        <Grid container justifyContent="center">
          <Grid item>
            <ButtonGroup style={{maxWidth: 300}}
              disableElevation
              variant="contained"
              aria-label="Disabled button group"
            >
              <Button
                id="login-btn"
                startIcon={<FaceIcon />}
                onClick={handleAuthentication}
              >
                Login
              </Button>
              <Button
                id="signup-btn"
                endIcon={<LockIcon />}
                onClick={handleAuthentication}
              >
                Sign Up
              </Button>
            </ButtonGroup>
          </Grid>
            {/* <input
            placeholder="teste"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => buttonPressionado()}>save</button> */}
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {checked === "login-btn" ? <Login /> : <Signup />}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
