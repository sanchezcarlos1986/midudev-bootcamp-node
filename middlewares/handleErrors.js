import colorLog from "../utils/colorLog";

const { NODE_ENV } = process.env;

const handleErrors = (error, request, response, next) => {
  NODE_ENV === "development" && console.log("=====>:", error);
  NODE_ENV === "development" &&
    colorLog("error", "❌ handleErrors middleware ❌", error);
  if (error.name === "CastError") {
    response.status(400).send({ error: "id used is malformed" });
  } else {
    response.status(500).end();
  }
};

export default handleErrors;
