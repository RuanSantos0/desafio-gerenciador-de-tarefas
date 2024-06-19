const base_prefix = "challenge-task";

export type USER = {
  id: number,
  username?: string;
  email: string;
  password: string;
  iat?: number;
};

export type FILTERS = {
  search: string;
};

const getAll = async (): Promise<USER[]> => {
  const req = localStorage.getItem(`${base_prefix}-user`);
  if (!req) return [];

  const items: USER[] = JSON.parse(req);
  return items;
};

const get = async (filters: FILTERS): Promise<USER[]> => {
  const req = localStorage.getItem(`${base_prefix}-user`);
  if (!req) return [];

  const users: USER[] = JSON.parse(req);

  const filteredItems = users.filter(
    (f) =>
      f.email.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase())
  );
  return filteredItems;
};

const post = (user: USER) => {
  const req = localStorage.getItem(`${base_prefix}-user`);

  return new Promise<void>((resolve, reject) => {
    try {
      if (req == "" || req == null) {
        const users: USER[] = [];
        users.push({
          ...user,
          iat: new Date().setHours(new Date().getHours() + 12),
          id: 1,
        });
        localStorage.setItem(`${base_prefix}-user`, JSON.stringify(users));
      } else {
        const users: USER[] = JSON.parse(req);
        users.push({
          ...user,
          iat: new Date().setHours(new Date().getHours() + 12),
        });
        console.log("passou 1 ")
        users.map((e, i) => ({ ...e, id: i + 1 }));
        console.log("passou 1 ")
        localStorage.setItem(`${base_prefix}-user`, JSON.stringify(users));
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export { getAll, get, post };
