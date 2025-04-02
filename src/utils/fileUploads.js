
const expressFileUploader = (req) => {
  const file = req?.files?.file;
  console.log(file);

  let imageName = file?.name;
  console.log(imageName);

  let imagePath = `./public/courseImages/${imageName}`;
  console.log(imagePath);
  file.mv(imagePath);
  return `/statics/courseImages/${imageName}`;
};

module.exports = {
  expressFileUploader
};
