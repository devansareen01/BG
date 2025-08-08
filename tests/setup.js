// s
jest.setTimeout(10000);


afterAll(async () => {

  await new Promise(resolve => setTimeout(resolve, 500));
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
