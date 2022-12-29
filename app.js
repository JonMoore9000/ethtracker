var config = require('./config.json');

var token = config.API_TOKEN;
var etherscan_token = config.ETHERSCAN_TOKEN;

let price_url="https://api.etherscan.io/api?module=stats&action=ethprice&apikey=" + etherscan_token + "'";
let nodesize_url = "https://api.etherscan.io/api?module=stats&action=nodecount&apikey=" + etherscan_token + "'";
let totaleth_url = "https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=" + etherscan_token + "'";
let gas_url = "https://api.etherscan.io/api?module=stats&action=dailynetutilization&startdate=2019-02-01&enddate=2019-02-28&sort=asc&apikey=" + etherscan_token + "'";
let trans_time_url = "https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=2000000000&apikey=" + etherscan_token + "'";
let erc_url = "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=" + etherscan_token + "'";

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function getPrice(callback) {
 $.ajax({
   url: price_url,
   type: 'GET',
   success: callback,
  });
}
function getNodeSize(callback) {
 $.ajax({
   url: nodesize_url,
   type: 'GET',
   success:callback,
  });
}
function totaleth(callback) {
 $.ajax({
   url: totaleth_url,
   type: 'GET',
   success:callback,
  });
}
function transTime(callback) {
 $.ajax({
   url: trans_time_url,
   type: 'GET',
   success:callback,
  });
}
function totalErc(callback) {
 $.ajax({
   url: erc_url,
   type: 'GET',
   success:callback,
  });
}

function getNews(callback) {
 $.ajax({
   url: "https://newscatcher.p.rapidapi.com/v1/search_free?q=ethereum&lang=en&page_size=9&media=True",
   type: 'GET',
   success:callback,
   async: true,
   page_size: 6,
   crossDomain: true,
   headers: {
     "x-rapidapi-host": "newscatcher.p.rapidapi.com",
     "x-rapidapi-key": token
   }
  });
}

// displaying api items
function displayPrice(apiResults) {
var price = apiResults.result.ethusd;
var newPrice = formatter.format(price);
	$('.price').html(newPrice);
}

function displayNodes(apiResults) {
var nodecount = apiResults.result.TotalNodeCount;
var x = nodecount.toLocaleString('en-US');
var y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  $('.nodecount').html(y);
}

function displayTotal(apiResults) {
var total = apiResults.result / 1000000000000000000;
var x = total.toLocaleString('en-US');
  $('.alleth').html(x);
}

function displayTime(apiResults) {
var total = apiResults.result / 60;
var x = total.toLocaleString('en-US');
  $('.transaction_time').html(x);
}

function displayErc(apiResults) {
var total = apiResults.result ;
var x = total.toLocaleString('en-US');
  $('.erc').html(x);
}

function displayNews(apiResults) {
var resultElement = '';
	if (apiResults) {
		resultElement = apiResults.articles.map(function(item) {

      var timestamp = item.published_date
      var date = new Date(timestamp);
      var newDate = date.getMonth()+1+
          "/"+(date.getDate())+
          "/"+date.getFullYear()

      return '<div class="news_byte">'
      + '<h3>' + item.title + '</h3>'
      + '<p class="scoop"> <span>The scoop:</span> ' + item.summary + '</p>'
      + '<p class="source"><span>Source:</span> ' + item.author + ' | </p> <a href="' + item.link +'" target="_blank"> Read More <i class="fas fa-arrow-right"></i></a>'
      + '<p class="date"><span>Date: </span> ' + newDate + '</p>'
      + '</div>'
  })

  $('.news-block').html(resultElement);
}
}

function refreshPrice() {
  $('#refresh').on('click', function() {
    getPrice(displayPrice);
  })
}
function refreshBlock() {
  $('#refreshTwo').on('click', function() {
    totalErc(displayErc);
  })
}

$(function() {
  getPrice(displayPrice);
  getNodeSize(displayNodes);
  totaleth(displayTotal);
  transTime(displayTime);
  totalErc(displayErc);
  refreshPrice();
  refreshBlock();
  getNews(displayNews);
});
