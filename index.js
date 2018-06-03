const twitter = require('twitter');
const cronJob = require('cron').CronJob;
var request = require('request');

const cronTime = '0 */6 * * *';　//毎時 0分に 6時間おきに実行


const bot = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});


function post(message) {
  bot.post('statuses/update',
    { status: message },
    function (error, tweet, response) {
      if (!error) {
        console.log('error!')
      }
    })
}

function getItems() {
  var options = {
    url: `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${process.env.APPLICATION_ID}&genreId=100317&sort=%2BreviewCount`,
    method: 'GET',
    json: true,
  }
  return new Promise((resolve, reject) => {
    request(options, (err, res, itemlist) => {
      var min = 0;
      var max = 30;
      var value = Math.floor(Math.random() * (max + 1 - min)) + min;
      items = itemlist.Items[value];
      var result = `#${items.Item.itemName} （ ${items.Item.itemPrice} 円） \n ${items.Item.itemUrl}`;
      console.log(result);
      resolve(result);
    });
  });
}

const job = new cronJob({
  cronTime: cronTime
  , onTick: function () {
    getItems().then(value => {
      post(value);
    });
    console.log('onTick!');
  }
  , onComplete: function () {
    console.log('onComplete!')
  }
  , start: false
  , timeZone: "Asia/Tokyo"
})

job.start();