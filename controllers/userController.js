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

  users.push(newUser);

  fs.writeFileSync("./data/users.json", JSON.stringify(users));
  res.status(200).send("user added successfuly");
};

const editUser = (req, res) => {
  res.send("edit user");
};
const deleteUser = (req, res) => {
  res.send("delte user");
};

export { getUser, createUser, editUser, deleteUser };
