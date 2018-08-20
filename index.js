const puppeteer = require("puppeteer");

const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

const paths = {
  login: "https://better.legendonlineservices.co.uk/enterprise/account/login",
  finsburyBookings: "https://better.legendonlineservices.co.uk/finsbury_lc/BookingsCentre/Index"
};

const config = {
  username: process.env.BETTER_USERNAME,
  password: process.env.BETTER_PASSWORD
};

const login = async (page) => {
  await page.goto(paths.login);

  await page.waitForSelector("#login_Email")
  await page.type("#login_Email", config.username);
  await page.type("#login_Password", config.password);

  const navigation = page.waitForNavigation();
  await page.click("#login");
  await navigation;
};

const badmintonTimetable = async (page) => {
  await page.goto(paths.finsburyBookings);

  await page.waitForXPath("//label[contains(text(), 'Badminton Court - 60mins')]/input");
  const [link]= await page.$x("//label[contains(text(), 'Badminton Court - 60mins')]/input");

  await link.click();

  // await page.mouse.move(100, 100);
  await page.waitForSelector("#bottomsubmit", { visible: true });
  await page.click("#bottomsubmit");

  // time table iframe
  await page.waitForXPath("//*[contains(text(), 'Showing results up to')]");
  await sleep(30000000);
  await page.evaluate(() => {debugger;});
};

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 2560,
      height: 1600
    },
    devtools: true,
    headless: false
  });
  const page = await browser.newPage();

  try {
    await login(page);
    await badmintonTimetable(page);
  } catch (err) {
    await page.screenshot({ path: "failed.png" });
  }


  await browser.close();
})();
