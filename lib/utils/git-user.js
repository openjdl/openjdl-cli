const Exec = require("child_process").execSync;

module.exports = () => {
  let name;
  let email;

  try {
    name = Exec("git config --get user.name");
    email = Exec("git config --get user.email");
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
  email = email && " <" + email.toString().trim() + ">";

  return (name || "") + (email || "");
};
