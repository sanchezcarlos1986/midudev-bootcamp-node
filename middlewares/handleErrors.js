import colorLog from "../utils/colorLog";

const handleErrors = (error, request, response, next) => {
  console.log("=====>:", error);
  colorLog("error", "❌ handleErrors middleware ❌", error);
  if (error.name === "CastError") {
    response.status(400).send({ error: "id used is malformed" });
  } else {
    response.status(500).end();
  }
};

export default handleErrors;
