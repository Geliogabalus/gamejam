const imageInput = document.querySelector('#imageInput');
const inputCanvas = document.querySelector('#canvas');
const context = inputCanvas.getContext('2d');
context.imageSmoothingEnabled = false;
const level = document.querySelector('#level');

const splitArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

imageInput.addEventListener('change', ({ target }) => {
  const image = new Image();
  image.src = URL.createObjectURL(target.files[0]);
  image.onload = () => {
    loadImageToCanvas(image);
    const table = processCanvas(context, image);
    level.innerHTML = table.map(row => row.join(''))
      .join('<br>');
    console.log(JSON.stringify(table.map(row => row.join(''))));
  }
});

const loadImageToCanvas = (image) => {
  const { width, height } = image;
  inputCanvas.setAttribute('width', width);
  inputCanvas.setAttribute('height', height);
  context.drawImage(image, 0, 0, width, height);
};

const colorMap = {
  '255,255,255,255': ' ', //space
  '255,242,0,255': 'C', //collectible
  '63,72,204,255': 'G', //goal
  '237,28,36,255': 'S', //start
  '0,0,0,255': 'W', //wall
};

const processCanvas = (context, { width, height }) => {
  const { data } = context.getImageData(0, 0, width, height);
  const processed = splitArray(data, 4)
    .map(item => colorMap[item.join()]);
  return splitArray(processed, width);
};
