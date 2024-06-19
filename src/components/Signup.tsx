import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAll, post, USER } from "../services/user";

const isEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    email
  );

export const Signup = () => {
  const navigate = useNavigate();

  //Password field
  const [users, setUsers] = useState<USER[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Inputs Error
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  //Form Validation
  const [formValid, setFormValid] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");

  const fetchAllList = useCallback(async () => {
    const req = await getAll();
    console.log(req);
    setUsers(req);
  }, []);

  useEffect(() => {
    fetchAllList();
  }, [fetchAllList]);

  //Validation error
  const handleUsername = () => {
    if (!username || username.length < 5 || username.length > 20) {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
  };

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

  const handleConfirmPassword = () => {
    if (!confirmPassword || password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    setConfirmPasswordError(false);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setSuccess(null);

    if (usernameError || !username) {
      setFormValid(
        "Nome de usuário não pode ser vazio e deve ter entre 5 - 20 caracteres"
      );
      return;
    }

    if (emailError || !email) {
      setFormValid("Você precisa escrever um e-mail valido");
      return;
    }

    if (passwordError || !password) {
      setFormValid(
        "Senha não pode ser vazio e deve ter entre 4 - 20 caracteres"
      );
      return;
    }

    if (
      confirmPasswordError ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      setFormValid("A confirmação da senha esta vazio ou não estão identicas");
      return;
    }

    post({
      id: users.length + 1,
      username: username,
      email: email,
      password: password,
    })
      .then((res) => {
        console.log(res);
        setFormValid(null);
        setSuccess("Formulário enviado com sucesso!");
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        setFormValid("Erro ao enviar o formulário");
      });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Grid>
      <form>
        <p>
          <TextField
            id="username-id"
            label="Usuário"
            value={username}
            error={usernameError}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={handleUsername}
            variant="outlined"
            fullWidth
          />
        </p>
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
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel
              error={confirmPasswordError}
              htmlFor="outlined-adornment-password"
            >
              Confirmar senha
            </InputLabel>
            <OutlinedInput
              id="password-id"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              error={confirmPasswordError}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={handleConfirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar senha"
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
            Registrar
          </Button>
        </p>
      </form>
      <p>{formValid && <Alert severity="error">{formValid}</Alert>}</p>
      <p>{success && <Alert severity="success">{success}</Alert>}</p>
    </Grid>
  );
};
