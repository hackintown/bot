const createSpinWheel = (amount) => {
  return `
🎡 Spinning the wheel...

  [${amount}] --- [${amount + 5}]
   |              |
[${amount - 5}] -🎯- [${amount + 10}]
   |              |
  [${amount - 10}] --- [${amount - 3}]

You won: ₹${amount}! 🎉
`;
};

module.exports = { createSpinWheel };
