export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const formatTimeAndDate = (dataString: string) => {
  const date = new Date(dataString);

  // Get the date in the same format as `formatDate`
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  // Get the time in "HH:MM" format
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;

  return `${formattedTime}, ${formattedDate}`;
};
