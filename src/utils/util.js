import moment from "moment";

const currentTime = () => new Date().toISOString().split("T")[1].split(".")[0];

const timeOnly = (dateTime) => moment(dateTime).format("HH:mm:ss.SS");

export { currentTime, timeOnly };
