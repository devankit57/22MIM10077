import axios from "axios";

export const registerUser = async (
  _: any,
  res: any
) => {

  try {

    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/register",
      {
        email: "ankit.2022@vitbhopal.ac.in",
        name: "ankit",
        rollNo: "22mim10077",
        accessCode: "SfFuWg"
      }
    );

    res.json(response.data);

  } catch (err: any) {

    res.status(500).json({
      message:
        err.response?.data || err.message
    });

  }
};

export const authUser = async (
  _: any,
  res: any
) => {

  try {

    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/auth",
      {
        email: "ankit.2022@vitbhopal.ac.in",
        name: "ankit",
        rollNo: "22mim10077",
        accessCode: "SfFuWg",
        clientID:
          "49214573-2f5c-4032-854c-c7daf9ddd37d",
        clientSecret:
          "PdPrZkQWyNdEMmnY"
      }
    );

    res.json(response.data);

  } catch (err: any) {

    res.status(500).json({
      message:
        err.response?.data || err.message
    });

  }
};