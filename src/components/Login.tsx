import { useState } from "react";

//Material UI Imports
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { login } from "../services/auth";
import { USER } from "../services/user";
import { useNavigate } from "react-router-dom";

const isEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    email
  );

export const Login = () => {
  const navigate  = useNavigate();
  //Password field
  const [showPassword, setShowPassword] = useState(false);

  //Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Inputs Error
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //Form Validation
  const [formValid, setFormValid] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");

  //Validation error
  const handleEmail = () => {
    if (!isEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
  };

  const handlePassword = () => {
    if (!password || password.length < 4 || password.length > 20) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setSuccess(null);

    if (emailError || !email) {
      setFormValid("Você precisa escrever um e-mail valido");
      return;
    }

    if (passwordError || !password) {
      setFormValid(
        "Senha inválida! A senha não pode ser vazio e deve ter entre 4 - 20 caracteres"
      );
      return;
    }

    setFormValid(null);
    setSuccess("Formulário enviado com sucesso!");

    const user: USER = {
      email,
      password
    }

    login(email,user).then((res) => {
      setSuccess("Usuário logado com sucesso");
      navigate('/home');
      console.log(res)
    }).catch(() => {
      setFormValid("Usuário ou senha inválido");
      console.log("err")
    })

    console.log(email);
    console.log(password);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid >
      <form>
        <p>
          <TextField
            id="email-id"
            label="E-mail"
            value={email}
            error={emailError}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={handleEmail}
            variant="outlined"
            fullWidth
          />
        </p>
        <p>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel
              error={passwordError}
              htmlFor="outlined-adornment-password"
            >
              Senha
            </InputLabel>
            <OutlinedInput
              id="password-id"
              type={showPassword ? "text" : "password"}
              value={password}
              error={passwordError}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={handlePassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Senha"
            />
          </FormControl>
        </p>
        <p>
          <Button
            fullWidth
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleSubmit}
          >
            Entrar
          </Button>
        </p>
      </form>
      <p>{formValid && <Alert severity="error">{formValid}</Alert>}</p>
      <p>{success && <Alert severity="success">{success}</Alert>}</p>
    </Grid>
  );
};
