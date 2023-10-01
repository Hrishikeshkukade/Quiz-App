import GoogleButton from "react-google-button";

const GoogleSigninButton = (props) => {
  const styles = {
    button: {
      width: "100%",
    },
  };

  return <GoogleButton style={styles.button} onClick={props.onClick} />;
};

export default GoogleSigninButton;
