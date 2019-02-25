export const createElement = (html) => {
  const template = document.createElement(`template`);
  template.innerHTML = html;
  return template.content;
};

export const getRandomInteger = (min, max) =>
  min + Math.floor(Math.random() * (max + 1 - min));
