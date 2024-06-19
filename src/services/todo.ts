export const base_prefix = "challenge-task";

export type ITEM = {
  id: number;
  name: string;
  desc: string;
  date: string;
  done: boolean;
};

type FILTERS = {
  search: string;
};

const getAll = async (): Promise<ITEM[]> => {
  const req = localStorage.getItem(`${base_prefix}-todo`);
  if (!req) return [];

  const items: ITEM[] = JSON.parse(req);
  return items;
};

const get = async (filters: FILTERS): Promise<ITEM[]> => {
  const req = localStorage.getItem(`${base_prefix}-todo`);
  if (!req) return [];

  const items: ITEM[] = JSON.parse(req);

  const filteredItems = items.filter(
    (f) =>
      f.name.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase()) ||
      f.date.includes(filters.search)
  );
  return filteredItems;
};

const post = async (item: ITEM) => {
  const req = localStorage.getItem(`${base_prefix}-todo`);
  if (req == "" || req == null) {
    const items: ITEM[] = [];
    items.push({ ...item, id: 1 });
    localStorage.setItem(`${base_prefix}-todo`, JSON.stringify(items));
  } else {
    const items: ITEM[] = JSON.parse(req);
    items.push(item);
    items.map((e, i) => ({ ...e, id: i + 1 }));
    localStorage.setItem(`${base_prefix}-todo`, JSON.stringify(items));
  }
};

const put = async (id: number, item: ITEM) => {
  const req = localStorage.getItem(`${base_prefix}-todo`);

  if (req == "" || req == null) {
    return;
  }

  const items: ITEM[] = JSON.parse(req);
  let todo = items.find(e => e.id == id)
  const indexEdit = items.findIndex(e => e.id == id)
  
  todo = {
    id,
    date: item.date,
    name: item.name,
    desc: item.desc,
    done: item.done,
  }
  items[indexEdit] = todo;
  localStorage.setItem(`${base_prefix}-todo`, JSON.stringify(items));
};

const del = async (id: number) => {
  const req = localStorage.getItem(`${base_prefix}-todo`);

  if (req == "" || req == null) {
    return;
  }

  const items: ITEM[] = JSON.parse(req);
  // let todo = items.find(e => e.id == id)
  const indexDel = items.findIndex(e => e.id == id)
  
  items.splice(indexDel, 1);

  items.map((e,i) => e.id = i + 1)

  localStorage.setItem(`${base_prefix}-todo`, JSON.stringify(items));
};



export { get, getAll, post, put, del };
