import Buttton from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import classes from "./Profile.module.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = useSelector((state) => state.auth.idToken);

  const changePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("pass");
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB3eBzorHrfzC0EF1o-GL-ZjIjgmQsdlSQ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await response.json();
      console.log(response);
      console.log(data);
    } catch (error) {}
  };

  return (
    <section className={classes.profile}>
      <Card>
        <h1 className={classes["profile__title"]}>Profile</h1>
        <form action="" onSubmit={changePassword}>
          <Input
            label="Change youre password"
            input={{ type: "password", name: "pass" }}
          />
          <Buttton>Change</Buttton>
        </form>
      </Card>
    </section>
  );
};

export default Profile;
