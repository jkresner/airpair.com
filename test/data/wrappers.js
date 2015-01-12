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
    }

}
