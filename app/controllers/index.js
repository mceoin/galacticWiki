
/**
 * Module dependencies.
 */
var request = require('superagent');
var extractor = require('unfluff');

// var mongoose = require('mongoose')
// var Article = mongoose.model('Article')
// var utils = require('../../lib/utils')
// var extend = require('util')._extend

/**
 * List
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'Articles'
    });
};
var taco = 'http://www.nytimes.com/interactive/2014/09/10/style/tmagazine/redzepi-searches-for-the-perfect-taco.html'
var mc = 'http://www.ft.com/intl/cms/s/0/03775904-177c-11de-8c9d-0000779fd2ac.html#axzz3lGdIurQI'
var headers =  '__qca=P0-2094757573-1397068012970; __utma=1.602075265.1392057771.1397257523.1403468315.2; __srret=1; _gab=GA1.2.602075265.1392057771; __utmx=69104142.twhuJjjOS-y817q3tRxrQg$0:0.wUQLcvk4RV6wJ65sNfvUdA$0:0; __utmxx=69104142.twhuJjjOS-y817q3tRxrQg$0:1431191511:8035200:.wUQLcvk4RV6wJ65sNfvUdA$0:1434477336:8035200; optimizelyEndUserId=oeu1436384445983r0.6174703238066286; RMID=007f0101773c55a56c030008; Akamai_AnalyticsMetrics_clientId=1700D04B05C67E720937C3FA558D08B7EC654204; WRUID=0; _chartbeat_uuniq=3; _cb_ls=1; __gads=ID=d4c9d6bad6923c31:T=1439408762:S=ALNI_Mbwy11OptjKdZieF5dQ9j91CsmiKQ; __CT_Data=gpv=20&apv_330_www06=5&apv_342_www06=4; adxcl=l*31073=5695d9cf:1|t*43613=56aaf1cf:1434567200|t*43617=56aaf1cf:1434846656|t*44378=6013964f:1440014366; rsi_segs=H07707_11226|H07707_10638|H07707_11173|H07707_11196|H07707_0; HTML_ViewerId=9bc92030-1f7c-7823-39b3-ddf7fa01ef7e; NYT-S=0M2b8SQ5B8eJXDXrmvxADeHxD/y17cwcTudeFz9JchiAIUFL2BEX5FWcV.Ynx4rkFI; ga_INT=GA1.2.602075265.1392057771; __utma=69104142.602075265.1392057771.1441126185.1441131607.375; __utmc=69104142; __utmz=69104142.1441131608.375.266.utmcsr=international.nytimes.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _ga=GA1.2.602075265.1392057771; nyt-m=7B318FC2FB12A65CCAC89A3953CD52B9&e=i.1443672000&t=i.10&v=i.8&n=i.2&g=i.0&rc=i.0&er=i.1440960656&vr=l.4.8.101.134.141&pr=l.4.14.160.210.242&vp=i.376&gf=l.10.1101428580.442144936.3974820288.3650101544.673336719.3376081615.2209208867.2509062474.-1.-1&ft=i.0&fv=i.0&rl=l.1.-1&cav=i.8&imu=i.1&igu=i.1&prt=i.5&kid=i.1&ica=i.0&iue=i.0&ier=i.0&iub=i.0&ifv=i.0&igd=i.0&iga=i.0&imv=i.0&igf=i.0&iru=i.0&ird=i.0&ira=i.0&iir=i.1&gl=l.2.2584370863.344376848&l=l.15.1101428580.442144936.3974820288.3650101544.673336719.3376081615.2209208867.2509062474.-1.-1.-1.-1.-1.-1.-1&gb=l.3.3.5.1441166400; walley=GA1.2.602075265.1392057771; _chartbeat2=81dq93zlpxu4jjx0.1391712658768.1441153872813.0111101111110001; WT_FPC=id=fa366296-dcce-4a0e-81fa-758435ca237d:lv=1441161073372:ss=1441160357519; _dycst=m.c.ms.frv5.ltos.ah.clk.; _dy_geo=US.NA.US_CA.US_CA_San%20Francisco; _dy_toffset=-1; _sp_id.ddc6=dce30e4cb2540b5a.1436371180.122.1441154412.1441150868; _sp_ses.ddc6=*; nyt-a=c739c3bc95efe604b744a5319a2b8ff2; _dyus_8765260=59738%7C24913%7C8%7C4%7C0%7C0.0.1396036336211.1441153873441.45117537.0%7C243%7C36%7C8%7C1141%7C4138%7C0%7C0%7C0%7C0%7C0%7C0%7C4138%7C0%7C0%7C0%7C0%7C0%7C4138%7C1%7C0%7C0%7C0%7C0; _dyrc=%2F%2Fpx.dynamicyield.com%2Fdps**effcl%400.totcl%400.clicks%400.scroll%400.active%400.uid%401033926629.sec%408765260.svars%4063%3A%251%25%3Astyle%250%25%251%25%250%2564%3A%251%25%3Atmagazine%250%25%251%25%250%2565%3A%251%25%3Ainteractive***; optimizelySegments=%7B%223007620980%22%3A%22referral%22%2C%223013750536%22%3A%22false%22%2C%223028090192%22%3A%22gc%22%2C%223032570147%22%3A%22none%22%2C%223315571554%22%3A%22referral%22%2C%223321851195%22%3A%22false%22%2C%223334171090%22%3A%22none%22%2C%223336921036%22%3A%22gc%22%7D; optimizelyBuckets=%7B%7D; NYT-wpAB=0012|1&0033|2&0036|-2&0050|0&0051|1&0052|0&0061|-2; NYT-Edition=edition|GLOBAL; optimizelyPendingLogEvents=%5B%5D'

exports.getPages = function (req, res) {
    request
      .get(taco)
      .set('Cookie', headers)
      .end(function(err, response) {
          if (!err && response.statusCode == 200) {
              var data = extractor(response.text);
              res.json({text:data, title:data.title});
          } else {
              res.json(err);
          }
      });

};

/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
