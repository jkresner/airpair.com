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
      "method":"GET"}]
      ,"httpStatusCode":201
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
  }

}
