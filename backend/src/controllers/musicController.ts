
const generateSongId = () => {
    const datePart = new Date().toISOString().replace(/[-:.]/g, "");
    const randomPart = Math.floor(Math.random() * 1e6)
      .toString()
      .padStart(6, "0");
    return `${datePart}-${randomPart}`;
  };

