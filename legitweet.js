var GOVERNORS = {
  AL: ['Robert Bentley', 'Alabama', 'GovernorBentley'],
  AK: ['Bill Walker', 'Alaska', 'AkGovBillWalker'],
  AZ: ['Doug Ducey', 'Arizona', 'dougducey'],
  AR: ['Asa Hutchinson', 'Arkansas', 'AsaHutchinson'],
  CA: ['Jerry Brown', 'California', 'JerryBrownGov'],
  CO: ['John Hickenlooper', 'Colorado', 'hickforco'],
  CT: ['Dannel Malloy', 'Connecticut', 'GovMalloyOffice'],
  DE: ['Jack Markell', 'Delaware', 'GovernorMarkell'],
  FL: ['Rick Scott', 'Florida', 'FLGovScott'],
  GA: ['Nathan Deal', 'Georgia', 'GovernorDeal'],
  HI: ['David Ige', 'Hawaii', 'GovHawaii'],
  ID: ['Butch Otter', 'Idaho', 'ButchOtter'],
  IL: ['Bruce Rauner', 'Illinois', 'GovRauner'],
  IN: ['Mike Pence', 'Indiana', 'GovPenceIN'],
  IA: ['Terry Branstad', 'Iowa', 'TerryBranstad'],
  KS: ['Sam Brownback', 'Kansas', 'govsambrownback'],
  KY: ['Matt Bevin', 'Kentucky', 'MattBevin'],
  LA: ['Bobby Jindal', 'Louisiana', 'BobbyJindal'],
  ME: ['Paul LePage', 'Maine', 'Governor_LePage'],
  MD: ['Larry Hogan', 'Maryland', 'LarryHogan'],
  MA: ['Charlie Baker', 'Massachusetts', 'MassGovernor'],
  MI: ['Rick Snyder', 'Michigan', 'onetoughnerd'],
  MN: ['Mark Dayton', 'Minnesota', 'GovMarkDayton'],
  MS: ['Phil Bryant', 'Mississippi', 'PhilBryantMS'],
  MO: ['Jay Nixon', 'Missouri', 'GovJayNixon'],
  MT: ['Steve Bullock', 'Montana', 'GovernorBullock'],
  NE: ['Pete Ricketts', 'Nebraska', 'GovRicketts'],
  NV: ['Brian Sandoval', 'Nevada', 'GovSandoval'],
  NH: ['Maggie Hassan', 'New Hampshire', 'GovernorHassan'],
  NJ: ['Chris Christie', 'New Jersey', 'ChrisChristie'],
  NM: ['Susana Martinez', 'New Mexico', 'Gov_Martinez'],
  NY: ['Andrew Cuomo', 'New York', 'NYGovCuomo'],
  NC: ['Pat McCrory', 'North Carolina', 'PatMcCroryNC'],
  ND: ['Jack Dalrymple', 'North Dakota', 'NDGovDalrymple'],
  OH: ['John Kasich', 'Ohio', 'JohnKasich'],
  OK: ['Mary Fallin', 'Oklahoma', 'GovMaryFallin'],
  OR: ['Kate Brown', 'Oregon', 'OregonGovBrown'],
  PA: ['Tom Wolf', 'Pennsylvania', 'WolfForPA'],
  RI: ['Gina Raimondo', 'Rhode Island', 'GinaRaimondo'],
  SC: ['Nikki Haley', 'South Carolina', 'nikkihaley'],
  SD: ['Dennis Daugaard', 'South Dakota', 'SDGovDaugaard'],
  TN: ['Bill Haslam', 'Tennessee', 'BillHaslam'],
  TX: ['Greg Abbott', 'Texas', 'GregAbbott_TX'],
  UT: ['Gary Herbert', 'Utah', 'GovHerbert'],
  VT: ['Peter Shumlin', 'Vermont', 'GovPeterShumlin'],
  VA: ['Terry McAuliffe', 'Virginia', 'GovernorVA'],
  WA: ['Jay Inslee', 'Washington', 'GovInslee'],
  WV: ['Earl Ray Tomblin', 'West Virginia', 'GovTomblin'],
  WI: ['Scott Walker', 'Wisconsin', 'GovWalker'],
  WY: ['Matt Mead', 'Wyoming', 'GovMattMead']
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function asJSON(response) {
  return response.json();
}

var SENATOR = "Sen";
var REPRESENTATIVE = "Rep";
var GOVERNOR = "Gov";
var ALL = 'All';
/*
  Make a locale aware tweet prompt for visitor's to your website

  The core of this function retreives the twitter handles for a visitor's
  representatives, using the visitor's IP address to determine locale
  information, and the Sunlight Foundation Congress API V3 to retrieve twitter
  handles. It returns a Promise containing useful information to construct
  a tweet card or tweet button, including the tweet URL and tweet text.

  To just retrieve an object containing raw twitter handle info for a visitor's
  representatives, use the getRepresentativeTwitterHandles function.

  @param {string} message The body of your tweet text, your call to action.
  @param {string} sunlightApiKey Your API key for the Sunlight Foundation.
    Internally this function uses the Congress API V3 to retrieve twitter
    handles for a user's representatives. Request one here if you don't already
    have it: https://sunlightfoundation.com/api/accounts/register/
  @param {...string} [hashtags] An optionallist of string hashtags you want to
    include in your tweet, e.g. ['vote', 'transparency']
  @param {string} [url] An optional url of your advocacy site to include in the
    tweet
  @param {...string} [titles] An optional list of the titles of representatives
    you'd like included in the list of twitter handles. Accepted values are
    "Sen", "Rep", or "Gov". If empty, all types will be included.

  @returns {Promise<object>} Returns a Promise that resolves to an object
    with the following keys.
    tweetUrl: A url that can be used to link-ify buttons and cards, It contains
      the tweet text. This may optionally include hashtags, and your site's url.
    tweetText: The raw text of the tweet. This does not include hashtags, which
      are treated as a separate entity by the Twitter API.
    twitterHandlesString: A string containing the concatenated twitter handles
 */
function legitweet(message, sunlightApiKey, hashtags, url, titles) {
  var legitweetPromise = getRepresentativeTwitterHandles(sunlightApiKey)
    .then(function(twitterHandles){
      if (!titles) {
        titles = [ALL];
      }

      // For each title, create a joined list of "@" handel
      var twitterHandlesString = titles.map(function(title) {
        twitterHandlesForTitleString = twitterHandles[title].map(function(handle) {
          return '@' + handle;
        }).join(' ');
      }).join(' ');

      var TWEET_BASE_URL = 'https://twitter.com/intent/tweet?'
      var tweetText = message + ' ' + twitterHandlesString;
      var tweetUrl = TWEET_BASE_URL + 'text=' + encodeUri(tweetText);
      if (url) {
        tweetUrl += '&amp;url=' + url;
      }
      if (hashtags) {
        tweetUrl += '&amp;hashtags=' + hastags.join(',');
      }
      return {
        'tweetUrl': tweetUrl,
        'tweetText': tweetText,
        'twitterHandlesString': twitterHandlesString,
      };
    });

  return legitweetPromise;
}

/*
Return the twitter handles for the site visitor's national representatives,
based on their IP address.
 */
function getRepresentativeTwitterHandles(sunlightApiKey) {
  var SUNLIGHT_CONGRESS_API_URL = 'https://congress.api.sunlightfoundation.com'
  var SUNLIGHT_CONGRESS_LOCATE_URL = SUNLIGHT_CONGRESS_API_URL
    + '/legislators/locate?'
  var FREEGEOIP_GEOINFO_FOR_REQUESTING_IP = 'http://freegeoip.net/json'
  var twitterHandlesPromise = fetch(FREEGEOIP_GEOINFO_FOR_REQUESTING_IP)
    .then(checkStatus)
    .then(asJSON)
    .then(function(geo) {
      var SUNLIGHT_CONGRESS_LOCATE_BY_LAT_LONG = SUNLIGHT_CONGRESS_LOCATE_URL
        + 'latitude=' + String(geo.latitude) + '&amp;'
        + 'longitude=' + String(geo.longitude) + '&amp;'
        + 'in_office=true&amp;'
        + 'apikey=' + sunlightApiKey;
      return fetch(SUNLIGHT_CONGRESS_LOCATE_BY_LAT_LONG)
    }).then(checkStatus)
    .then(asJSON)
    .then(function(congressApiResponse) {
      if (congressApiResponse['count'] === 0) {
          return {};
      }

      var twitterHandles = {};

      congressApiResponse['results'].forEach(function(legislator) {
        if (legislator['twitter_id'] !== 'null') {
          var title = legislator['title']
          if (!twitterHandles[title]) {
            twitterHandles[title] = []
          }
          twitterHandles[title].push(legislator['twitter_id']);
          twitterHandles['all'].push(legislator['twitter_id']);
        }
      });
      // All should be from same state, so grab the first one
      var STATE = congressApiResponse['results'][0]['state']
      twitterHandles['Gov'] = GOVERNORS[STATE][2];
      twitterHandles['all'].push(twitterIds['Gov'])

      return twitterHandles;
    });
  return twitterHandlesPromise;
}
