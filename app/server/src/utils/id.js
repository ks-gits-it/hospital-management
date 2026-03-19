function randomId(prefix) {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomPart}`;
}

module.exports = {
  randomId,
};
