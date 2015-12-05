module.exports = {

  paypal_single_payout_fail: {
    "batch_header": {
      "payout_batch_id":"RTD8CHM3TCLUL",
      "batch_status":"SUCCESS",
      "time_created":"2015-01-12T10:50:18Z",
      "time_completed":"2015-01-12T10:50:19Z",
      "sender_batch_header": {
        "email_subject":"You have a payment"
      },
      "amount": {"currency":"USD","value":"0.9"},
      "fees":{"currency":"USD","value":"0.02"}
    },
    "items":[
      {
        "payout_item_id":"2CP4E692B4SYW",
        "transaction_id":"02H90517LE9824521",
        "transaction_status":"UNCLAIMED",
        "payout_item_fee": {
          "currency":"USD","value":"0.02"
        },
        "payout_batch_id":"RTD8CHM3TCLUL",
        "payout_item": {
          "amount":{"currency":"USD","value":"0.9"},
          "note":"Thank you.",
          "receiver":"shirt-supplier-three@mail.com",
          "recipient_type":"EMAIL",
          "sender_item_id":"54b3a6e71aa90d382a3ef57a"
        },
        "time_processed":"2015-01-12T10:50:19Z",
        "errors": {
          "name":"RECEIVER_UNREGISTERED",
          "message":"Receiver is unregistered"
        },
        "links":[
          {
            "href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/2CP4E692B4SYW",
            "rel":"item",
            "method":"GET"
          }
        ]
      }
    ],
    "links":[
      {
        "href":"https://api.sandbox.paypal.com/v1/payments/payouts/RTD8CHM3TCLUL",
        "rel":"self",
        "method":"GET"
      }
    ],
    "httpStatusCode":201
  },

  paypal_single_payout_success: {
    "batch_header":
    {
      "payout_batch_id":"UKGZ8VFV6X6SS",
      "batch_status":"SUCCESS",
      "time_created":"2015-01-12T10:56:35Z",
      "time_completed":"2015-01-12T10:56:41Z",
      "sender_batch_header":
      {
        "email_subject":"You have an AirPair payment"
      },
      "amount":
      {
        "currency":"USD",
        "value":"0.9"
      },
      "fees":
      {
        "currency":"USD",
        "value":"0.02"
      }
    },
    "items":[
    {
      "payout_item_id":"LANHYW57YDBRC",
      "transaction_id":"0JJ060802P4560901",
      "transaction_status":"SUCCESS",
      "payout_item_fee":{"currency":"USD","value":"0.02"},
      "payout_batch_id":"UKGZ8VFV6X6SS",
      "payout_item":
      {
        "amount":{"currency":"USD","value":"0.9"},
        "note":"Thank you.",
        "receiver":"expert_engb_verified@airpair.com",
        "recipient_type":"EMAIL",
        "sender_item_id":"54b3a85fc3380d832bb2b358"},
        "time_processed":"2015-01-12T10:56:40Z",
        "links":[
        {"href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/LANHYW57YDBRC",
        "rel":"item",
        "method":"GET"}
        ]
      }
      ],
      "links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/UKGZ8VFV6X6SS",
      "rel":"self",
      "method":"GET"}],
      "httpStatusCode":201
  },

  braintree_newuser_token: {
    clientToken: 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJiYjU0ZWM3NGY5ZWFkYWMzNTNmYTljMGUxNWI0OGJlZDA3M2IwNWUzMTExMTVkNjY2YTEzMzg3ZGQwMTQ0OWU2fGNyZWF0ZWRfYXQ9MjAxNS0wMy0yNVQxMDowNjoyMy4yOTAxNTA5MTMrMDAwMFx1MDAyNm1lcmNoYW50X2lkPWNoa3I0OXI4eXhrNXk2NXBcdTAwMjZwdWJsaWNfa2V5PTNwd3BieTdycmZkcjN4M20iLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY2hrcjQ5cjh5eGs1eTY1cC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2Noa3I0OXI4eXhrNXk2NXAvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIn0sInRocmVlRFNlY3VyZUVuYWJsZWQiOmZhbHNlLCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiZGlzcGxheU5hbWUiOiJBaXJQYWlyIiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudCIsIm1lcmNoYW50QWNjb3VudElkIjoiZzNmdzh5ZmJ3a2h4ZnBiYyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiY2hrcjQ5cjh5eGs1eTY1cCIsInZlbm1vIjoib2ZmbGluZSJ9',
    success: true
  },

  braintree_api_newuser_testtoken: {
    clientToken: 'fake-valid-nonce',
    success: true
  },

  braintree_charge_success: {
    "transaction":{
      "id":"5fkkvj",
      "status":"submitted_for_settlement",
      "type":"sale",
      "currencyIsoCode":"USD",
      "amount":"100.00",
      "merchantAccountId":"g3fw8yfbwkhxfpbc",
      "orderId":"54b417c51a83c69b49458d2b",
      "createdAt":"2015-01-12T18:51:50Z",
      "updatedAt":"2015-01-12T18:51:50Z",
      "customer":{
        "id":"54aafb08701dedeb9fce7e98",
        "firstName":"Evan",
        "lastName":"Richards1420491528",
        "company":null,
        "email":"evengoldfish1420491528@gmail.com",
        "website":null,
        "phone":null,
        "fax":null
      },"billing":{"id":"sy","firstName":null,"lastName":null,"company":null,"streetAddress":null,"extendedAddress":null,"locality":null,"region":null,"postalCode":"94107","countryName":null,"countryCodeAlpha2":null,"countryCodeAlpha3":null,"countryCodeNumeric":null},"refundId":null,"refundIds":[],"refundedTransactionId":null,"settlementBatchId":null,"shipping":{"id":null,"firstName":null,"lastName":null,"company":null,"streetAddress":null,"extendedAddress":null,"locality":null,"region":null,"postalCode":null,"countryName":null,"countryCodeAlpha2":null,"countryCodeAlpha3":null,"countryCodeNumeric":null},"customFields":{"createdByUserId":"54aafb08701dedeb9fce7e98"},"avsErrorResponseCode":null,"avsPostalCodeResponseCode":"M","avsStreetAddressResponseCode":"I","cvvResponseCode":"I","gatewayRejectionReason":null,"processorAuthorizationCode":"WXTB64","processorResponseCode":"1000","processorResponseText":"Approved","additionalProcessorResponse":null,"voiceReferralNumber":null,"purchaseOrderNumber":null,"taxAmount":null,"taxExempt":false,"creditCard":{"token":"f2xwmw","bin":"401288","last4":"1881","cardType":"Visa","expirationMonth":"12","expirationYear":"2020","customerLocation":"US","cardholderName":null,"imageUrl":"https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox","uniqueNumberIdentifier":"e623ae0b9612707c948eb19a377b978b","prepaid":"No","healthcare":"Unknown","debit":"Unknown","durbinRegulated":"Unknown","commercial":"Unknown","payroll":"Unknown","issuingBank":"Unknown","countryOfIssuance":"USA","productId":"Unknown","venmoSdk":false,"maskedNumber":"401288******1881","expirationDate":"12/2020"},"statusHistory":[{"timestamp":"2015-01-12T18:51:50Z","status":"authorized","amount":"100.00","user":"airpair","transactionSource":"api"},{"timestamp":"2015-01-12T18:51:50Z","status":"submitted_for_settlement","amount":"100.00","user":"airpair","transactionSource":"api"}],"planId":null,"subscriptionId":null,"subscription":{"billingPeriodEndDate":null,"billingPeriodStartDate":null},"addOns":[],"discounts":[],"descriptor":{"name":null,"phone":null,"url":null},"recurring":false,"channel":null,"serviceFeeAmount":null,"escrowStatus":null,"disbursementDetails":{"disbursementDate":null,"settlementAmount":null,"settlementCurrencyIsoCode":null,"settlementCurrencyExchangeRate":null,"fundsHeld":null,"success":null},"disputes":[],"paymentInstrumentType":"credit_card","processorSettlementResponseCode":"","processorSettlementResponseText":"","paypalAccount":{},"applePayCard":{}},"success":true
  },

  braintree_test_nonces_transactable : 'fake-valid-nonce',

  braintree_add_company_card: {"customer":{
    // "id":"551291434dd7dc4a7e70f10e",
    "customFields": {
      "createdByUserId":"551291434dd7dc4a7e70f10d"
    },
    "company":null,
    "merchantId":"chkr49r8yxk5y65p","firstName":"Matt",
    "lastName":"Humphrey1427280195",
    "email":"zellunit1427280195@gmail.com",
    "phone":null,"fax":null,"website":null,"createdAt":"2015-03-25T10:43:16Z",
    "updatedAt":"2015-03-25T10:43:16Z",
    "creditCards":[{"billingAddress":{"id":"v3","customerId":"551291434dd7dc4a7e70f10e",
    "firstName":null,"lastName":null,"company":null,"streetAddress":null,"extendedAddress":null,
    "locality":null,"region":null,"postalCode":"94107","countryCodeAlpha2":null,
    "countryCodeAlpha3":null,"countryCodeNumeric":null,"countryName":null,
    "createdAt":"2015-03-25T10:43:16Z","updatedAt":"2015-03-25T10:43:16Z"},
    "bin":"401288","cardType":"Visa","cardholderName":null,"commercial":"Unknown",
    "countryOfIssuance":"USA","createdAt":"2015-03-25T10:43:16Z",
    "customerId":"551291434dd7dc4a7e70f10e","customerLocation":"US","debit":"Unknown",
    "default":true,"durbinRegulated":"Unknown","expirationMonth":"12","expirationYear":"2020",
    "expired":false,"healthcare":"Unknown",
    "imageUrl":"https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox",
    "issuingBank":"Unknown","last4":"1881","payroll":"Unknown","prepaid":"No","subscriptions":[]
    ,"token":"8qdzpm","uniqueNumberIdentifier":"e623ae0b9612707c948eb19a377b978b",
    "updatedAt":"2015-03-25T10:43:16Z","venmoSdk":false,"verifications":[{"status":"verified",
    "cvvResponseCode":"M","avsErrorResponseCode":null,"avsPostalCodeResponseCode":"M",
    "avsStreetAddressResponseCode":"I","gatewayRejectionReason":null,
    "merchantAccountId":"g3fw8yfbwkhxfpbc","processorResponseCode":"1000",
    "processorResponseText":"Approved","id":"9cyyvj","billing":{"firstName":null,"lastName":null,
    "company":null,"streetAddress":null,"extendedAddress":null,"locality":null,"region":null,
    "postalCode":"94107","countryName":null},"creditCard":{"token":"8qdzpm","bin":"401288",
    "last4":"1881","cardType":"Visa","expirationMonth":"12","expirationYear":"2020",
    "customerLocation":"US","cardholderName":null,
    "uniqueNumberIdentifier":"e623ae0b9612707c948eb19a377b978b","prepaid":"No",
    "healthcare":"Unknown","debit":"Unknown","durbinRegulated":"Unknown","commercial":"Unknown",
    "payroll":"Unknown","issuingBank":"Unknown","countryOfIssuance":"USA","productId":"Unknown"},
    "createdAt":"2015-03-25T10:43:16Z","updatedAt":"2015-03-25T10:43:16Z"}],
    "maskedNumber":"401288******1881","expirationDate":"12/2020",
    "verification":{"status":"verified","cvvResponseCode":"M","avsErrorResponseCode":null,
    "avsPostalCodeResponseCode":"M","avsStreetAddressResponseCode":"I","gatewayRejectionReason":null,
    "merchantAccountId":"g3fw8yfbwkhxfpbc","processorResponseCode":"1000",
    "processorResponseText":"Approved","id":"9cyyvj","billing":{"firstName":null,"lastName":null,
    "company":null,"streetAddress":null,"extendedAddress":null,"locality":null,"region":null,
    "postalCode":"94107","countryName":null},
    "creditCard":{"token":"8qdzpm","bin":"401288","last4":"1881","cardType":"Visa","expirationMonth":"12","expirationYear":"2020","customerLocation":"US",
    "cardholderName":null,"uniqueNumberIdentifier":"e623ae0b9612707c948eb19a377b978b","prepaid":"No",
    "healthcare":"Unknown","debit":"Unknown","durbinRegulated":"Unknown","commercial":"Unknown",
    "payroll":"Unknown","issuingBank":"Unknown","countryOfIssuance":"USA","productId":"Unknown"},
    "createdAt":"2015-03-25T10:43:16Z","updatedAt":"2015-03-25T10:43:16Z"}}],
    "addresses":[{"id":"v3","customerId":"551291434dd7dc4a7e70f10e","firstName":null,"lastName":null,
    "company":null,"streetAddress":null,"extendedAddress":null,"locality":null,"region":null,
    "postalCode":"94107","countryCodeAlpha2":null,"countryCodeAlpha3":null,"countryCodeNumeric":null,
    "countryName":null,"createdAt":"2015-03-25T10:43:16Z","updatedAt":"2015-03-25T10:43:16Z"}]},
    "success":true
  },

  gcal_successful_event_creation: {
    kind: 'calendar#event',
    etag: '"2842390799298000"',
    id: 'p2v6vhtkc4bbsdbi5bsdmacp30',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=cDJ2NnZodGtjNGJic2RiaTVic2RtYWNwMzAgbWlrZUBtYWRleWUuaW8',
    created: '2015-01-14T00:29:59.000Z',
    updated: '2015-01-14T00:29:59.649Z',
    summary: 'AirPair Mike + Michael',
    description: 'Your matchmaker, will set up a Google\nhangout for this session and share the link with you a few\nminutes prior to the session.\n\nYou are encouraged to make sure beforehand your mic/webcam are working\non your system. Please let your matchmaker know if you\'d like to do\na dry run.\n\nBooking: https://airpair.com/booking/54ab52c64d46f90b0080d6d1',
    colorId: '10',
    creator:
    { email: 'mike@madeye.io',
      displayName: 'Mike Risse',
      self: true },
    organizer:
    { email: 'mike@madeye.io',
      displayName: 'Mike Risse',
      self: true },
    start: { dateTime: '2015-01-16T09:00:00-08:00' },
    end: { dateTime: '2015-01-16T10:00:00-08:00' },
    iCalUID: 'p2v6vhtkc4bbsdbi5bsdmacp30@google.com',
    sequence: 0,
    attendees:
    [ { email: 'rissem@gmail.com',
        displayName: 'Michael Risse',
        responseStatus: 'needsAction' } ],
    hangoutLink: 'https://plus.google.com/hangouts/_/madeye.io/mike-rissem?hceid=bWlrZUBtYWRleWUuaW8.p2v6vhtkc4bbsdbi5bsdmacp30',
    reminders: { useDefault: true }
  },

  youtube_api_codereview_list : {
    "kind":"youtube#videoListResponse","etag":"\"9iWEWaGPvvCMMVNTPHF9GiusHJA/d_9TlsQaaaSBJaA9-DuaomZyt9Q\"",
    "pageInfo":{"totalResults":1,"resultsPerPage":1},
    "items":[{"kind":"youtube#video","etag":"\"9iWEWaGPvvCMMVNTPHF9GiusHJA/-1hpkzxagLVFa1ufDiRdB8fpD_g\"","id":"MEv4SuSJgwk",
    "snippet":{"publishedAt":"2013-10-10T02:18:28.000Z","channelId":"UCX6ZQp3RdEU_9kFNrRB-rIQ",
    "title":"Online Rails Code Review with RoR Expert Edward Anderson - AirPair",
    "description":"http://www.airpair.com/ruby-on-rails/code-mentor-edward-anderson\nGet a health check on your Rails app with an online review from an AirPair expert like Edward Anderson.\n\nSee more on Code Mentoring for Ruby on Rails\nhttp://www.airpair.com/code-mentoring/ruby-on-rails",
    "thumbnails":{"default":{"url":"https://i.ytimg.com/vi/MEv4SuSJgwk/default.jpg","width":120,"height":90},
    "medium":{"url":"https://i.ytimg.com/vi/MEv4SuSJgwk/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/MEv4SuSJgwk/hqdefault.jpg","width":480,"height":360},"standard":{"url":"https://i.ytimg.com/vi/MEv4SuSJgwk/sddefault.jpg","width":640,"height":480},"maxres":{"url":"https://i.ytimg.com/vi/MEv4SuSJgwk/maxresdefault.jpg","width":1280,"height":720}},
    "channelTitle":"Air Pair","categoryId":"24","liveBroadcastContent":"none","localized":{"title":"Online Rails Code Review with RoR Expert Edward Anderson - AirPair","description":"http://www.airpair.com/ruby-on-rails/code-mentor-edward-anderson\nGet a health check on your Rails app with an online review from an AirPair expert like Edward Anderson.\n\nSee more on Code Mentoring for Ruby on Rails\nhttp://www.airpair.com/code-mentoring/ruby-on-rails"}}}]
  },

  youtube_video_response:  {
    publishedAt: '2013-10-10T02:18:28.000Z',
   channelId: 'UCX6ZQp3RdEU_9kFNrRB-rIQ',
   title: 'Online Rails Code Review with RoR Expert Edward Anderson - AirPair',
   description: 'http://www.airpair.com/ruby-on-rails/code-mentor-edward-anderson\nGet a health check on your Rails app with an online review from an AirPair expert like Edward Anderson.\n\nSee more on Code Mentoring for Ruby on Rails\nhttp://www.airpair.com/code-mentoring/ruby-on-rails',
   thumbnails:
   { default:
     { url: 'https://i.ytimg.com/vi/MEv4SuSJgwk/default.jpg',
            width: 120,
            height: 90 },
     medium:
     { url: 'https://i.ytimg.com/vi/MEv4SuSJgwk/mqdefault.jpg',
            width: 320,
            height: 180 },
     high:
     { url: 'https://i.ytimg.com/vi/MEv4SuSJgwk/hqdefault.jpg',
            width: 480,
            height: 360 },
     standard:
     { url: 'https://i.ytimg.com/vi/MEv4SuSJgwk/sddefault.jpg',
            width: 640,
            height: 480 },
     maxres:
     { url: 'https://i.ytimg.com/vi/MEv4SuSJgwk/maxresdefault.jpg',
            width: 1280,
            height: 720 } },
   channelTitle: 'Air Pair',
   categoryId: '24',
   liveBroadcastContent: 'none'
  },

  gplaces_succcessful_place: {
    "coordinates":{"lat":12.9715987,"lng":77.59456269999998},
    "address_components":[
      {
        "long_name":"Bengaluru",
        "short_name":"Bengaluru",
        "types":["locality","political"]
      },
      {
        "long_name":"Bangalore Urban",
        "short_name":"Bangalore Urban",
        "types":["administrative_area_level_2","political"]
      },
      {
        "long_name":"Karnataka",
        "short_name":"KA",
        "types":["administrative_area_level_1","political"]
      },
      {
        "long_name":"India",
        "short_name":"IN",
        "types":["country","political"]
      }
    ],
    "adr_address":"<span class=\"locality\">Bengaluru</span>, <span class=\"region\">Karnataka</span>, <span class=\"country-name\">India</span>",
    "formatted_address":"Bengaluru, Karnataka, India",
    "geometry":{
      "location":{"A":12.9715987,"F":77.59456269999998},
      "viewport":{
        "Ea":{"k":12.7342888,"j":13.173706},
        "wa":{"j":77.37919809999994,"k":77.88268089999997}
      }
    },
    "icon":"http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
    "id":"0862832923832bfb1e46cbe843cdaa03a9ee8aa1",
    "name":"Bengaluru",
    "place_id":"ChIJbU60yXAWrjsR4E9-UejD3_g",
    "reference":"CoQBfgAAAIRmBX2Xvp4YcWlMUWPv8EVgn0-K0B_n79UTUJI-oaU-8IKM7i8zL4r2ukpkZZUJJ8vLhzdDScsOPQwn--ReuRF6F_8VJPhAIWpQJyXr-9eTRmCp9-_K5PJ2ZRQEM_UUd3g3_G6u3m80KpOTFrRFB0TxIqqx3d1z3qyppBs759TTEhCu7IXuxn1urC3PqouYZF_DGhRKqXCSlfD_l7WSSj_VvOmOdJ3mTQ",
    "scope":"GOOGLE",
    "types":["locality","political"],
    "url":"https://maps.google.com/maps/place?q=Bengaluru,+Karnataka,+India&ftid=0x3bae1670c9b44e6d:0xf8dfc3e8517e4fe0",
    "vicinity":"Bengaluru",
    "html_attributions":[]
  },


  localization_melbourne : {
    "location" : "Melbourne VIC, Australia",
    "locationData" : {
      "coordinates" : { "lng" : 144.9632306999999, "lat" : -37.8142155 },
      "formatted_address": "Melbourne VIC, Australia",
      "address_components" : [
        {
          "long_name" : "Melbourne",
          "short_name" : "Melbourne",
          "types" : ["locality","political" ]
        },
        {
          "long_name" : "Victoria",
          "short_name" : "VIC",
          "types" : [ "administrative_area_level_1", "political" ]
        },
        {
          "long_name" : "Australia",
          "short_name" : "AU",
          "types" : [ "country", "political" ]
        }
      ],
      "geometry" : {
          "location" : { "k" : -37.8142155, "D" : 144.9632306999999 },
          "viewport" : {
              "Ca" : { "k" : -37.8546255, "j" : -37.7994893 },
              "va" : { "j" : 144.9514222, "k" : 144.9890617999999 }
          }
      },
      "name" : "Melbourne"
    },
    "timezone" : "Australian Eastern Standard Time",
    "timezoneData" : {
        "dstOffset" : 0,
        "rawOffset" : 36000,
        "status" : "OK",
        "timeZoneId" : "Australia/Hobart",
        "timeZoneName" : "Australian Eastern Standard Time"
    }
  },


  madridLocationData: {
    "coordinates" : { "lng" :40.4167754, "lat" :-3.7037901999999576 },
    "formatted_address":"Madrid, Madrid, Spain",
    "address_components":[
      {"long_name":"Madrid","short_name":"Madrid","types":["locality","political"]},
      {"long_name":"Madrid","short_name":"Madrid","types":["administrative_area_level_4","political"]},
      {"long_name":"Área Metropolitalitana y Corredor del Henares","short_name":"Área Metropolitalitana y Corredor del Henares","types":["administrative_area_level_3","political"]},
      {"long_name":"Madrid","short_name":"M","types":["administrative_area_level_2","political"]},
      {"long_name":"Community of Madrid","short_name":"Community of Madrid","types":["administrative_area_level_1","political"]},
      {"long_name":"Spain","short_name":"ES","types":["country","political"]}
    ],
    "geometry": {
      "location":{"H":40.4167754,"L":-3.7037901999999576},
      "viewport":{
        "Ka":{"H":40.3120639,"j":40.5638447},
        "Ga":{"j":-3.834161799999947,"H":-3.52491150000003}
      }
    },
    "name":"Madrid",
  },


  timezone_melbourne : { options:
     { location: '-37.8142155,144.9632306999999',
       timestamp: 1402629305,
       language: 'en',
       key: 'AIzaSyANXimipzhyZ-Mp2_RrzjKKp4nXq5VpMGk' },
    raw_response:
     { dstOffset: 0,
       rawOffset: 36000,
       status: 'OK',
       timeZoneId: 'Australia/Hobart',
       timeZoneName: 'Australian Eastern Standard Time' },
    local_timestamp: 1402665305
  },


  mailchimp_lists: {
    total: 2,
    data: [
      { id: '39f4769300',
       web_id: 205165,
       name: 'AirConf',
       date_created: '2014-07-14 20:45:44',
       email_type_option: false,
       use_awesomebar: true,
       default_from_name: 'AirPair AirConf',
       default_from_email: 'team@airpair.com',
       default_subject: '',
       default_language: 'en',
       list_rating: 4,
       subscribe_url_short: 'http://eepurl.com/ZGkYL',
       subscribe_url_long: 'http://airpair.us7.list-manage1.com/subscribe?u=707a79398ffed7972e1e87db6&id=39f4769300',
       beamer_address: 'us7-07807549f9-72b012040c@inbound.mailchimp.com',
       visibility: 'pub',
       stats: [Object],
       modules: [] },
     { id: '903d16f497',
       web_id: 117353,
       name: 'AirPair Newsletter',
       date_created: '2013-09-30 21:09:29',
       email_type_option: false,
       use_awesomebar: true,
       default_from_name: 'AirPair',
       default_from_email: 'team@airpair.com',
       default_subject: 'an update from AirPair',
       default_language: 'en',
       list_rating: 3.5,
       subscribe_url_short: 'http://eepurl.com/Q_gVj',
       subscribe_url_long: 'http://airpair.us7.list-manage.com/subscribe?u=707a79398ffed7972e1e87db6&id=903d16f497',
       beamer_address: 'us7-07807549f9-ec0bc25f68@inbound.mailchimp.com',
       visibility: 'pub',
       stats: [Object],
       modules: [] } ],
    errors: []
  },

  mailchimp_subscription: [
    { id: '903d16f497',
    web_id: 117353,
    name: 'AirPair Newsletter' }
  ],

  mailchimp_listsforemail: [
    { id: '903d16f497', web_id: 117353, name: 'AirPair Newsletter' },
    { id: '39f4769300', web_id: 205165, name: 'AirConf' },
    { id: '69de3eea5d', web_id: 224469, name: 'AirPair Authors' }
  ],

  mailchimp_memberinfo_jk: {
    "success_count":1,
    "error_count":0,
    "errors":[],
    "data":[
      {"email":"jk@airpair.com","id":"0ab2e891e6","euid":"0ab2e891e6","email_type":"html",
      "ip_signup":null,"timestamp_signup":null,"ip_opt":"54.159.165.97",
      "timestamp_opt":"2015-03-19 15:30:20","member_rating":2,
      "info_changed":"2015-03-19 15:30:20","web_id":94021797,"leid":94021797,
      "language":"en","list_id":"903d16f497","list_name":"AirPair Newsletter",
      "merges":{"EMAIL":"jk@airpair.com","FNAME":"Jonathon","LNAME":"Kresner","ISREPEAT":"Y","ISFORMER":"Y","ISCUST":"Y","ISEXPERT":"Y","COMPANY":"AirPair","ISFROMMONG":"Y","MMERGE9":"2682"},
      "status":"subscribed","timestamp":"2015-03-19 15:30:20","is_gmonkey":false,
      "lists":[
        {"id":"39f4769300","status":"subscribed"},
        {"id":"9403a36fa1","status":"subscribed"},
        {"id":"89214a2507","status":"subscribed"},
        {"id":"f905e62324","status":"unsubscribed"},
        {"id":"69de3eea5d","status":"subscribed"}
      ],
      "geo":{"latitude":"33.8882000","longitude":"-118.3480000","gmtoff":"-8","dstoff":"-7","timezone":"America/Los_Angeles","cc":"US","region":"CA"},
      "clients":{"name":"Android","icon_url":"http://us7.admin.mailchimp.com/images/email-client-icons/android.png"},
      "static_segments":[],"notes":[]
    }]
  },

  mailchimp_anon_subscribed: { email: 'subunsub1426911590@airpair.com',
    euid: 'cb76383d8d',
    leid: '152330445'
  },

  mailchimp_subscribed: { email: 'jk@airpair.com',
    euid: '0ab2e891e6',
    leid: '152330281'
  },

  mailchimp_unsubscribed: {
    complete: true
  },

  stackoverflow_wiki_nofoundtag: {
    items: [],
    has_more: false,
    quota_max: 300,
    quota_remaining: 275
  },

  //https://api.stackexchange.com/tags/ember.js/wikis?site=stackoverflow
  stackoverflow_wiki_ember: {
    items: [
      {
        excerpt_last_edit_date: 1413395402,
        body_last_edit_date: 1420351795,
        excerpt: 'Ember.js is an advanced front end MVC application framework written in JavaScript and distributed under an open source license.  Click learn more... and use the preconfigured templates from the tag wiki in order to create better questions.\r\n',
        tag_name: 'ember.js'
      }
    ],
    has_more: false,
    quota_max: 300,
    quota_remaining: 283
  },

  stackoverflow_wiki_ios8: { items:
    [ { excerpt_last_edit_date: 1411277797, body_last_edit_date: 1408087005,
       excerpt: 'iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system. It was announced at Apple&#39;s Worldwide Developers Conference (WWDC) on June 2, 2014 and was later released to the public on September 17, 2014.  See https://www.apple.com/ios/ios8/developer/ for more information.', tag_name: 'ios8' } ],
    has_more: false, quota_max: 300, quota_remaining: 270 },

  //https://api.stackexchange.com/tags/ember.js/info?site=stackoverflow
  stackoverflow_info_ember: {
    "items":[
      {
        "has_synonyms":true,
        "is_moderator_only":false,
        "is_required":false,
        "count":14533,
        "name":"ember.js"
      }
    ],
    "has_more":false,
    "quota_max":300,
    "quota_remaining":281
  },

  //https://api.stackexchange.com/tags/ember.js/synonyms?site=stackoverflow
  stackoverflow_synonyms_ember: {
    "items":[
      {"creation_date":1344434850,"last_applied_date":1427235401,"applied_count":546,"to_tag":"ember.js","from_tag":"emberjs"},
      {"creation_date":1338657033,"last_applied_date":1427377381,"applied_count":827,"to_tag":"ember.js","from_tag":"ember"}
    ],
    "has_more":false,
    "quota_max":300,
    "quota_remaining":280
  },

  //https://api.stackexchange.com/tags/ember.js/synonyms?site=stackoverflow
  stackoverflow_related_ember: {
    "items":[
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":4033,"name":"javascript"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":3404,"name":"ember-data"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":1103,"name":"handlebars.js"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":948,"name":"ember-cli"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":557,"name":"ruby-on-rails"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":549,"name":"jquery"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":298,"name":"ember-router"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":276,"name":"json"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":249,"name":"handlebars"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":185,"name":"node.js"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":176,"name":"coffeescript"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":166,"name":"model-view-controller"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":147,"name":"rest"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":147,"name":"html"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":135,"name":"templates"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":134,"name":"routes"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":134,"name":"model"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":130,"name":"ember-simple-auth"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":127,"name":"ajax"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":121,"name":"twitter-bootstrap"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":119,"name":"controller"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":116,"name":"ember-old-router"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":105,"name":"routing"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":103,"name":"qunit"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":101,"name":"ember-app-kit"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":99,"name":"view"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":98,"name":"angularjs"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":92,"name":"css"},
      {"has_synonyms":false,"is_moderator_only":false,"is_required":false,"count":90,"name":"ember-model"},
      {"has_synonyms":true,"is_moderator_only":false,"is_required":false,"count":75,"name":"authentication"}
    ],
    "has_more":true,"quota_max":300,"quota_remaining":279
  },

  slack_team_info:  {
    id: 'T06U2HQQ3',
    name: 'AirPair Test'
  },

  slack_me_info: {
    url: 'https://airpairtest.slack.com/',
    team: 'AirPair Test',
    user: 'pairbot',
    team_id: 'T06U2HQQ3',
    user_id: 'U06UBBT9V'
  },

  slack_users_list: [
    {
      "id":"U06UCSHL0",
      "name":"customer-support",
      "deleted":false,
      "real_name":"{} Customer Support",
      "tz_label":"Pacific Daylight Time",
      "profile":{"email":"support@airpair.com"}
    },
    {"id":"U06UBH472","name":"experts","deleted":false,"real_name":"Experts AirPair","tz_label":"Pacific Daylight Time","profile":{"email":"experts@airpair.com"}},{"id":"U06U2QUVB","name":"gregorynicholas","deleted":false,"real_name":"gregorynicholas","tz_label":"Pacific Daylight Time","profile":{"email":"nicholas.g.gregory@gmail.com"}},{"id":"U06U2HQQK","name":"jk","deleted":false,"real_name":"{} Jonathon Kresner","tz_label":"Pacific Daylight Time","profile":{"email":"jk@airpair.com"}},{"id":"U06UCKSSF","name":"jkgmail","deleted":false,"real_name":"Jonathon Gmail","tz_label":"Pacific Daylight Time","profile":{"email":"jkresner@gmail.com"}},{"id":"U06UBBT9V","name":"pairbot","deleted":false,"real_name":"","tz_label":"Pacific Daylight Time"}
  ],

  slack_channels_list: [
    {
      "id":"C06U2H1GC",
      "name":"airpair-channel",
      "is_channel":true,
      "created":1435494439,
      "creator":"U06U2HQQK",
      "is_archived":false,
      "is_general":true,
      "is_member":true,
      "members":["U06U2HQQK","U06U2QUVB","U06UBBT9V","U06UBH472","U06UCKSSF","U06UCSHL0"],"topic":{"value":"Company-wide announcements and work-based matters","creator":"","last_set":0},
      "purpose":{"value":"This channel is for team-wide communication and announcements. All team members are in this channel.","creator":"","last_set":0},
      "num_members":6
    },
    {"id":"C06UBRE77","name":"airpair-posts","is_channel":true,"created":1435535658,"creator":"U06U2HQQK","is_archived":false,"is_general":false,"is_member":true,"members":["U06U2HQQK"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"","creator":"","last_set":0},"num_members":1},{"id":"C06U2H1GU","name":"airpair-support","is_channel":true,"created":1435494439,"creator":"U06U2HQQK","is_archived":false,"is_general":false,"is_member":true,"members":["U06U2HQQK","U06U2QUVB","U06UBH472","U06UCKSSF","U06UCSHL0"],"topic":{"value":"Non-work banter and water cooler conversation","creator":"","last_set":0},"purpose":{"value":"A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you'd prefer to keep out of more focused work-related channels.","creator":"","last_set":0},"num_members":5}
  ],

  slack_groups_list: [
    {"id":"G06UBFX8S","purpose":{"value":""},"topic":{"value":""},"members":["U06U2HQQK","U06U2QUVB","U06UBBT9V"],"is_archived":false,"creator":"U06U2HQQK","created":1435535644,"name":"-pipeline-"},
    {"id":"G06UFLR5K","purpose":{"value":"I have a test purpose 1435548265"},"topic":{"value":""},"members":["U06U2HQQK","U06U2QUVB","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548112,"name":"zz-test-5590ba6953c6b"},
    {"id":"G06UFKTDZ","purpose":{"value":"I have a test purpose 1435548812"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548659,"name":"zz-test-5590bc8ce8c6f"},
    {"id":"G06UFJCQ2","purpose":{"value":"I have a test purpose 1435548961"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548808,"name":"zz-test-5590bd219285f"},
    {"id":"G06UFKP2A","purpose":{"value":"I have a test purpose 1435548978"},"topic":{"value":""},"members":["U06U2HQQK","U06UBBT9V","U06UCSHL0"],"is_archived":false,"creator":"U06UCSHL0","created":1435548825,"name":"zz-test-5590bd321801e"}
  ],

  slack_createGroup_wPurpose: {
    id: 'G06UFLR5K',
    purpose: { value: { purpose: 'I have a test purpose 1435548265' } },
    topic: { value: '' },
    members: [ 'U06UCSHL0' ],
    is_archived: false,
    creator: 'U06UCSHL0',
    created: 1435548112,
    name: 'zz-test-5590ba6953c6b'
  },

  slack_getGroupWithHistory: {
    info: {
      "id":"G06UFP6AX",
      "name":"steve-gregory-55b9dba","is_group":true,"created":1435548980,
      "creator":"U06UCSHL0","is_archived":false,"is_mpim":false,"is_open":true,"last_read":"1435548980.000003",
      "latest":{"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},"unread_count":190,"unread_count_display":187,"members":["U06U2HQQK","U06UBBT9V","U06UCKSSF","U06UCSHL0"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"http://booking.airpa.ir/55b9dba1f07139aed9500482 Steve (AEST, Melbourne VIC, Australia) + gregory (PDT, Los Angeles, CA, USA). FEEDBACK required to payout expert for 120 mins on Sat 01 08:09 UTC | 6:09PM AEST | 1:09AM PDT","creator":"U06UCSHL0","last_set":1438243537}
    },
    messages: [
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f134ebcdc4da01c6a3bd|booking.airpa.ir/5656f134ebcdc4da01c6a3bd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538290.491640"},
      {"text":"<!group> Sun 06 11:46 UTC | 10:46PM AEDT | 11:46AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f11374f74fd5010c43c7|booking.airpa.ir/5656f11374f74fd5010c43c7>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538258.491325"},
      {"text":"<!group> Sun 06 11:45 UTC | 10:45PM AEDT | 11:45AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0d3f8f94ccb0149ad38|booking.airpa.ir/5656f0d3f8f94ccb0149ad38>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538193.490676"},
      {"text":"<!group> Sun 06 11:44 UTC | 10:44PM AEDT | 11:44AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0abe0a965c8010590c9|booking.airpa.ir/5656f0abe0a965c8010590c9>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538153.490278"},
      {"user":"U06UCSHL0","purpose":"https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","ts":"1436093743.000002"},{"user":"U06UCKSSF","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCKSSF|jkgmail> has joined the group","ts":"1435550337.000006"},
      {"user":"U06U2HQQK","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06U2HQQK|jk> has joined the group","ts":"1435548980.000005"},{"user":"U06UBBT9V","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UBBT9V|pairbot> has joined the group","ts":"1435548980.000004"},{"user":"U06UCSHL0","purpose":"I have a test purpose 1435549133","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: I have a test purpose 1435549133","ts":"1435548980.000003"},
    ]
  },

  slack_api_group_info: {
    "group":{"id":"G06UFP6AX","name":"steve-gregory-55b9dba","is_group":true,"created":1435548980,
    "creator":"U06UCSHL0","is_archived":false,"is_mpim":false,"is_open":true,"last_read":"1435548980.000003",
    "latest":{"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},"unread_count":190,"unread_count_display":187,"members":["U06U2HQQK","U06UBBT9V","U06UCKSSF","U06UCSHL0"],"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"http://booking.airpa.ir/55b9dba1f07139aed9500482 Steve (AEST, Melbourne VIC, Australia) + gregory (PDT, Los Angeles, CA, USA). FEEDBACK required to payout expert for 120 mins on Sat 01 08:09 UTC | 6:09PM AEST | 1:09AM PDT","creator":"U06UCSHL0","last_set":1438243537}}
  },

  slack_api_groups_history: {
    messages: [
      {"text":"<!group> Sun 06 11:58 UTC | 10:58PM AEDT | 11:58AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f3eaf2d231370211bba4|booking.airpa.ir/5656f3eaf2d231370211bba4>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538984.498078"},
      {"text":"<!group> Sun 06 11:54 UTC | 10:54PM AEDT | 11:54AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f2f40334f31c02d6e8fd|booking.airpa.ir/5656f2f40334f31c02d6e8fd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538738.495585"},
      {"text":"<!group> Sun 06 11:49 UTC | 10:49PM AEDT | 11:49AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f1adca22e6ef016c6c1a|booking.airpa.ir/5656f1adca22e6ef016c6c1a>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538411.492630"},
      {"text":"<!group> Sun 06 11:48 UTC | 10:48PM AEDT | 11:48AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f189037d48e9018f077f|booking.airpa.ir/5656f189037d48e9018f077f>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538375.492339"},
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f15ca9c012e001aa42ce|booking.airpa.ir/5656f15ca9c012e001aa42ce>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538331.491989"},
      {"text":"<!group> Sun 06 11:47 UTC | 10:47PM AEDT | 11:47AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f134ebcdc4da01c6a3bd|booking.airpa.ir/5656f134ebcdc4da01c6a3bd>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538290.491640"},
      {"text":"<!group> Sun 06 11:46 UTC | 10:46PM AEDT | 11:46AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f11374f74fd5010c43c7|booking.airpa.ir/5656f11374f74fd5010c43c7>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538258.491325"},
      {"text":"<!group> Sun 06 11:45 UTC | 10:45PM AEDT | 11:45AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0d3f8f94ccb0149ad38|booking.airpa.ir/5656f0d3f8f94ccb0149ad38>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538193.490676"},
      {"text":"<!group> Sun 06 11:44 UTC | 10:44PM AEDT | 11:44AM GMT has been confirmed Daniel Roseman for <http://booking.airpa.ir/5656f0abe0a965c8010590c9|booking.airpa.ir/5656f0abe0a965c8010590c9>. Please be online 10 minutes before to start on time.","username":"pairbot","type":"message","subtype":"bot_message","ts":"1448538153.490278"},
      {"user":"U06UCSHL0","purpose":"https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: https://airpair.com/bookings/55990dcbbd5a78d846d185ad Jonathon (AEST, Melbourne VIC, Australia) + Giorgio (AEST, Melbourne VIC, Australia). WAITING to confirm 120 mins @ Tue 07 10AM UTC | 8PM AEST.","ts":"1436093743.000002"},{"user":"U06UCKSSF","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCKSSF|jkgmail> has joined the group","ts":"1435550337.000006"},
      {"user":"U06U2HQQK","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06U2HQQK|jk> has joined the group","ts":"1435548980.000005"},{"user":"U06UBBT9V","inviter":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UBBT9V|pairbot> has joined the group","ts":"1435548980.000004"},{"user":"U06UCSHL0","purpose":"I have a test purpose 1435549133","type":"message","subtype":"group_purpose","text":"<@U06UCSHL0|customer-support> set the group's purpose: I have a test purpose 1435549133","ts":"1435548980.000003"},
      {"user":"U06UCSHL0","type":"message","subtype":"group_join","text":"<@U06UCSHL0|customer-support> has joined the group","ts":"1435548980.000002"}
    ],
    has_more: false
  },

  google_cal_list: [
    {
      kind: 'calendar#calendarListEntry',
         etag: '"1415132944139000"',
         id: 'airpair.co_o3u16m7fv9fc3agq81nsn0bgrs@group.calendar.google.com',
         summary: 'AirCasts',
         description: 'Schedule of Events for AirConf 2014 - To access the 80+ presentations and workshops visit http://www.airpair.com/airconf2014',
         location: 'Global',
         timeZone: 'America/Los_Angeles',
         colorId: '15',
         backgroundColor: '#9fc6e7',
         foregroundColor: '#000000',
         accessRole: 'owner',
         defaultReminders: [] },
       { kind: 'calendar#calendarListEntry',
         etag: '"1435726328407000"',
         id: 'airpair.co_tn15u4klva1nmssc9selpcovjo@group.calendar.google.com',
         summary: 'jk-dev',
         timeZone: 'America/Los_Angeles',
         colorId: '19',
         backgroundColor: '#c2c2c2',
         foregroundColor: '#000000',
         selected: true,
         accessRole: 'owner',
         defaultReminders: [] },
  ],


  google_cal_create:
  {
    kind: 'calendar#event',
    etag: '"2871454031892000"',
    id: '3juiose9d8o3kou0lfiqsemb9k',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=M2p1aW9zZTlkOG8za291MGxmaXFzZW1iOWsgYWlycGFpci5jb190bjE1dTRrbHZhMW5tc3NjOXNlbHBjb3Zqb0Bn',
    created: '2015-07-01T05:03:35.000Z',
    updated: '2015-07-01T05:03:35.946Z',
    summary: 'create cal test 1435727173',
    description: 'It\'s a test',
    colorId: '6',

    creator: {
      email: 'jk@airpair.com',
      displayName: 'Jonathon Kresner',
    },

    organizer: {
     email: 'airpair.co_tn15u4klva1nmssc9selpcovjo@group.calendar.google.com',
     displayName: 'jk-dev',
     self: true,
   },

    start: { dateTime: '2015-06-30T22:06:13-07:00' },
    end:   { dateTime: '2015-06-30T23:06:13-07:00' },
    iCalUID: '3juiose9d8o3kou0lfiqsemb9k@google.com',
    sequence: 0,
    attendees: [
     {
       email: 'participant1@null.com',
       displayName: 'gregory nicholas',
       responseStatus: 'needsAction'
     },
     {
       email: 'participant2@null.com',
       displayname: 'jonathon kresner',
       responseStatus: 'needsAction'
     },
    ],
    reminders: { useDefault: true }
  },


}
