import { Button, Alert } from "react-native";
// import { PaymentRequest } from "react-native-payments";
// import { ApplePay } from "react-native-apay";

// const METHOD_DATA = [
//   {
//     supportedMethods: ["apple-pay"],
//     data: {
//       merchantIdentifier: "merchant.com.voiceassistant",
//       supportedNetworks: ["visa", "mastercard"],
//       countryCode: "US",
//       currencyCode: "USD",
//     },
//   },
// ];

// const DETAILS = {
//   id: "basic-example",
//   displayItems: [
//     {
//       label: "Movie Ticket",
//       amount: { currency: "USD", value: "15.00" },
//     },
//   ],
//   total: {
//     label: "Merchant Name",
//     amount: { currency: "USD", value: "15.00" },
//   },
// };

// // TODO: utility?
// const OPTIONS = {
//   requestPayerName: true,
// };

const requestData = {
  merchantIdentifier: "merchant.com.voiceassistant",
  supportedNetworks: ["mastercard", "visa"],
  countryCode: "US",
  currencyCode: "USD",
  paymentSummaryItems: [
    {
      label: "1-month subscription",
      amount: "5.00",
    },
  ],
};

// const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

export default function ApplePayButton() {
  async function handlePress() {
    // try {
    //   const paymentReponse = await paymentRequest.show();
    //   console.log(paymentReponse);
    //   // TODO: contact payment gateway or my server
    // } catch (err) {
    //   console.log(err);
    // }

    try {
      if (ApplePay.canMakePayments) {
        const paymentData = await ApplePay.requestPayment(requestData);

        console.log(paymentData);

        // Call payment gateway or my server here

        setTimeout(async () => {
          // Show status to user ApplePay.SUCCESS || ApplePay.FAILURE
          //   await ApplePay.complete(ApplePay.FAILURE);

          //   Alert.alert(
          //     "An error happened",
          //     "Your purchase did not go through, please try again"
          //   );

          await ApplePay.complete(ApplePay.SUCCESS);

          Alert.alert("Success", "You have now access to the app");
        }, 1000);
      } else {
        Alert.alert("Apple Pay is not available on this device");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return <Button title="Pay with Apple" onPress={handlePress} />;
}
