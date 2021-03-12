import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API, API_CREATE_POST } from "../hooks/useAPI";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ntrp, setNtrp] = useState("");
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isDarkModeOn = useSelector((state) => state.prefs.darkMode);

  //DateTime picker
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("datetime");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    Keyboard.dismiss();
  };

  const toggleDatepicker = () => {
    setShow(!show);
  };
  // const showMode = (currentMode) => {
  //   setShow(true);
  //   setMode(currentMode);
  // };

  // const showDatepicker = () => {
  //   showMode("date");
  // };

  // const showTimepicker = () => {
  //   showMode("time");
  // };

  // Create posts to DB
  async function createPost(title, content, ntrp, location, mobile) {
    console.log("--- Post creating ---");
    var success = true;

    try {
      setLoading(true);
      const response = await axios.post(API + API_CREATE_POST, {
        title,
        content,
        ntrp,
        location,
        mobile,
      });
      console.log("Post create successful!");
      console.log("response.data:");
      console.log(response.data);
    } catch (error) {
      console.log("Error retriving posts!");
      console.log(error.response.data.error);
      success = false;
    } finally {
      setLoading(false);
      return success;
    }
  }

  // Create button pressed
  async function createPressed(
    recTitle,
    recContent,
    recNtrp,
    recLocation,
    recMobile
  ) {
    // Error check if Name entered
    if (recTitle == "") {
      setErrorMessage("Please enter Name.");
      return;
    }
    // Error check if Date entered
    if (recContent == "") {
      setErrorMessage("Please enter an available date for a Tennis Game.");
      return;
    }
    // Error check if Age entered
    if (recNtrp == "") {
      setErrorMessage("Please enter your Tennis NTRP rating.");
      return;
    }
    // Error check if Career entered
    if (recLocation == "") {
      setErrorMessage("Please enter the location for the Game.");
      return;
    }
    // Error check if Email entered
    if (recMobile == "") {
      setErrorMessage("Please enter your Mobile number.");
      return;
    }

    // Create post
    const didCreatePost = await createPost(
      recTitle,
      recContent,
      recNtrp,
      recLocation,
      recMobile
    );

    if (didCreatePost) {
      navigation.navigate("Index", {
        title,
        content,
        ntrp,
        location,
        mobile,
        action: "create",
      });
    } else {
      alert("Error creating post");
    }
  }

  // Cancel button pressed
  function cancelPressed() {
    return navigation.navigate("Index");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          commonStyles.container,
          isDarkModeOn && { backgroundColor: "black" },
        ]}
      >
        <Text style={styles.textLabel}>Create Date Event</Text>
        <Text style={[styles.textLabel2, isDarkModeOn && { color: "white" }]}>
          Name
        </Text>
        <TextInput
          placeholder="Enter Name..."
          style={styles.textInput}
          value={title}
          onChangeText={(input) => setTitle(input)}
          onTextInput={() => setErrorMessage("")}
          autoCorrect={false}
        ></TextInput>
        <Text style={[styles.textLabel2, isDarkModeOn && { color: "white" }]}>
          Date and Time{" "}
        </Text>
        <TextInput
          // placeholder="Suggest a date and time for a Game..."
          // style={styles.textInput}
          // value={content}
          // onChangeText={(input) => setContent(input)}
          // onTextInput={() => setErrorMessage("")}
          // autoCorrect={false}

          style={styles.input}
          placeholder="datetime"
          onFocus={toggleDatepicker}
          value={
            date.getDate() +
            "_" +
            (date.getMonth() + 1) +
            "_" +
            date.getFullYear()
          }
        />

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <Text style={[styles.textLabel2, isDarkModeOn && { color: "white" }]}>
          NTRP rating
        </Text>
        <TextInput
          placeholder="Enter your Tennis NTRP rating..."
          keyboardType="numeric"
          style={styles.textInput}
          value={ntrp}
          onChangeText={(input) => setNtrp(input)}
          onTextInput={() => setErrorMessage("")}
          autoCorrect={false}
        ></TextInput>

        <Text style={[styles.textLabel2, isDarkModeOn && { color: "white" }]}>
          Location
        </Text>
        <TextInput
          placeholder="Enter Game venue..."
          style={styles.textInput}
          value={location}
          onChangeText={(input) => setLocation(input)}
          onTextInput={() => setErrorMessage("")}
          autoCorrect={false}
        ></TextInput>

        <Text style={[styles.textLabel2, isDarkModeOn && { color: "white" }]}>
          Mobile{" "}
        </Text>
        <TextInput
          placeholder="Enter contect Mobile..."
          keyboardType="numeric"
          style={styles.textInput}
          value={mobile}
          onChangeText={(input) => setMobile(input)}
          onTextInput={() => setErrorMessage("")}
          autoCorrect={false}
        ></TextInput>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel, { marginRight: 10 }]}
            onPress={() => cancelPressed()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSubmit, { marginLeft: 10 }]}
            onPress={() =>
              createPressed(title, content, ntrp, location, mobile)
            }
          >
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size="large" color="red" />
              ) : (
                "Create"
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  textLabel: {
    fontSize: 28,
    color: "brown",
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  textLabel2: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    margin: 20,
    borderWidth: 1,
    width: "90%",
    padding: 10,
    borderColor: "#ccc",
    marginTop: 0,
    justifyContent: "center",
    backgroundColor: "white",
  },
  button: {
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    padding: 5,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonSubmit: {
    backgroundColor: "orange",
  },
  buttonCancel: {
    backgroundColor: "red",
  },
  textSignUp: {
    color: "blue",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "red",
    height: 20,
    textAlign: "center",
    marginBottom: 10,
  },
});
