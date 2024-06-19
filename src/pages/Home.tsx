import { useCallback, useEffect, useState } from "react";
import { ITEM, base_prefix, del, getAll, post, put } from "../services/todo";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import DialogContentText from "@mui/material/DialogContentText";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export const Home = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<ITEM[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [done, setDone] = useState(false);
  const [todoEdit, setTodoEdit] = useState<ITEM>();
  const [todoDelete, setTodoDelete] = useState<ITEM>();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const fetchAllList = useCallback(async () => {
    const req = await getAll();
    console.log(req);
    setTodos(req);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(`${base_prefix}-user-loginCheck`) == "") {
      navigate("/");
    } else if (localStorage.getItem(`${base_prefix}-user-loginCheck`) != "") {
      const check = localStorage.getItem(`${base_prefix}-user-loginCheck`);
      if (new Date() > new Date(Number(check))) {
        navigate("/");
      }
    }
    fetchAllList();
  }, [fetchAllList]);

  const handleEditTodo = (todo: ITEM) => {
    put(todo.id, todo);
    fetchAllList();
    setOpenEdit(false);
  };

  const handleClickOpenEdit = (todo: ITEM) => {
    setTodoEdit(todo);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleAddTodo = () => {
    post({
      id: todos.length + 1,
      name: name,
      desc: desc,
      date: new Date().toJSON().split("T")[0],
      done: false,
    });
    fetchAllList();
    setOpenAdd(false);
    setName("");
    setDesc("");
  };

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenDelete = (todo: ITEM) => {
    setTodoDelete(todo);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleConfirmDelete = (todo: ITEM) => {
    del(todo.id);
    fetchAllList();
    setOpenDelete(false);
  };

  const handleCheckTodo = (todo: ITEM) => {
    put(todo.id, { ...todo, done: !todo.done });
    fetchAllList();
  };

  const handleDone = () => {
    setDone(!done);
    setTodoEdit((model) => ({ ...model, done: done }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home__container" style={{ padding: "0 15%" }}>
      <div className="home__area">
        <div className="home__header">
          <h1>To-do List</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              width: "50%",
              marginLeft: 30,
            }}
          >
            <Button variant="contained" onClick={handleClickOpenAdd}>
              Adiconar Tarefa
            </Button>

            <Button
              variant="contained"
              onClick={handleLogout}
              color="error"
              startIcon={<LogoutIcon />}
              style={{ marginLeft: 20 }}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
      <Grid container spacing={4} justifyContent="center">
        {todos.map((todo, index) => (
          <Grid item lg={4} md={6} sm={6} xs={12} key={index}>
            <Card
              style={{
                background: `${todo.done == true ? "#65c765" : "#fff"}`,
                color: `${todo.done == true ? "#fff" : "#000"}`,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {todo.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {todo.date}
                </Typography>
                <Typography className="home__card--content" variant="body2">
                  {todo.desc}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label="delete"
                  sx={{ color: todo.done == true ? "#fff" : "#777" }}
                  onClick={() => handleOpenDelete(todo)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  sx={{ color: todo.done == true ? "#fff" : "#777" }}
                  onClick={() => handleClickOpenEdit(todo)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  aria-label="check"
                  sx={{ color: todo.done == true ? "#fff" : "#777" }}
                  onClick={() => handleCheckTodo(todo)}
                >
                  <CheckCircleIcon />
                </IconButton>
                {todo.done == true ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      width: "100%",
                    }}
                  >
                    <Chip
                      label="concluido"
                      size="small"
                      sx={{ backgroundColor: "#1d651d", color: "#fff" }}
                    />
                  </div>
                ) : null}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {todoEdit != undefined && (
        <Dialog
          open={openEdit}
          onClose={handleCloseEdit}
          fullWidth={true}
          maxWidth="sm"
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              handleCloseEdit();
            },
          }}
        >
          <DialogTitle>Editar To-do</DialogTitle>
          <DialogContent>
            <p>
              <TextField
                autoFocus
                id="name-id"
                label="Nome"
                value={todoEdit.name}
                onChange={(event) =>
                  setTodoEdit((model) => ({
                    ...model,
                    name: event.target.value,
                  }))
                }
                fullWidth
              />
            </p>

            <p>
              <TextField
                id="desc-id"
                label="Descrição"
                multiline
                rows={4}
                value={todoEdit.desc}
                onChange={(event) =>
                  setTodoEdit((model) => ({
                    ...model,
                    desc: event.target.value,
                  }))
                }
                fullWidth
              />
            </p>
            <p>
              Concluir
              <Switch
                checked={todoEdit.done}
                onChange={handleDone}
                inputProps={{ "aria-label": "controlled" }}
              />
            </p>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => handleCloseEdit()}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={() => handleEditTodo(todoEdit)}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        fullWidth={true}
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleCloseAdd();
          },
        }}
      >
        <DialogTitle>Cadastrar To-do</DialogTitle>
        <DialogContent>
          <p>
            <TextField
              autoFocus
              id="name-id"
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
          </p>

          <p>
            <TextField
              autoFocus
              id="desc-id"
              label="Descrição"
              multiline
              rows={4}
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              fullWidth
            />
          </p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleCloseAdd()}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => handleAddTodo()}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmação de exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Por favor, confirme se deseja realmente excluir esta tarefa. Esta
            ação é irreversível e todos os dados relacionados a esta tarefa
            serão permanentemente removidos..
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelete}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => handleConfirmDelete(todoDelete)}
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
