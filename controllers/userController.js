import fs from "fs";

const readUsersData = () => {
  const data = fs.readFileSync("./data/users.json", "utf8");
  const users = JSON.parse(data);
  return users;
};
const getUser = (req, res) => {
  const users = readUsersData();
  res.status(200).send(users);
};
const createUser = (req, res) => {
  const users = readUsersData();

  const newUser = { ...req.body, createdAt: new Date(), id: Date.now() };
  const isUniqueEmail = users.every((user) => user.email !== newUser.email);
  if (!newUser.email || !newUser.name || !newUser.age) {
    return res.status(400).send("name age and email are required fields");
  } else if (!isUniqueEmail) {
    return res.status(400).send("user with this email already exist");
  }

  users.push(newUser);

  fs.writeFileSync("./data/users.json", JSON.stringify(users));
  res.status(200).send("user registered successfuly");
};

const editUser = (req, res) => {
  const users = readUsersData();
  const userIndex = users.findIndex(
    (user) => user.id === Number(req.params.id)
  );
  if (userIndex === -1) {
    return res.status(400).send("user not found");
  }
  // const userToChange = users.find((user) => user.id === Number(req.params.id));
  const updatedUser = { ...users[userIndex], ...req.body };
  // users[userToChangeIndex] = {... users[userToChangeIndex],req.body}
  users[userIndex] = updatedUser;
  fs.writeFileSync("./data/users.json", JSON.stringify(users));
  res.status(200).send("user info changed successfuly");
};
const deleteUser = (req, res) => {
  const users = readUsersData();
  const exist = users.every((user) => user.id !== Number(req.params.id));
  if (exist) {
    return res.status(400).send("user cannot find");
  }
  const updated = users.filter((user) => user.id !== Number(req.params.id));
  fs.writeFileSync("./data/users.json", JSON.stringify(updated));
  res.status(200).send("user successfuly deleted");
};

export { getUser, createUser, editUser, deleteUser };
