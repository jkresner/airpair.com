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

  youtube_codereview_list : {
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
      "location":{"k":12.9715987,"D":77.59456269999998},
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
  }




}
