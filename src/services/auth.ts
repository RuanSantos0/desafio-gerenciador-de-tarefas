import { USER } from "./user";

const base_prefix = "challenge-task";

const login = async (filters: string, user: USER) => {
  const req = localStorage.getItem(`${base_prefix}-user`);

  return new Promise<void>((resolve, reject) => {
    try {
      if (!req) return [];

      const users: USER[] = JSON.parse(req);

      const filteredItems = users.filter((f) =>
        f.email?.toLocaleLowerCase().includes(filters.toLocaleLowerCase())
      );
      if(filteredItems[0].email === user.email && filteredItems[0].password === user.password){
        let searchUser = filteredItems[0]

        searchUser = {
          id: searchUser.id,
          email: user.email,
          password: user.password,
          iat: new Date().setHours(new Date().getHours() + 12),
        }
  
        users[searchUser.id -1] = {...searchUser, username: filteredItems[0].username}
        localStorage.setItem(`${base_prefix}-user`, JSON.stringify(users));
        localStorage.setItem(`${base_prefix}-user-loginCheck`, JSON.stringify(searchUser.iat));
      }else{
        reject()
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });

};


const logout = async () => {
    localStorage.setItem(`${base_prefix}-user-loginCheck`, "")
  };

export { login, logout };
