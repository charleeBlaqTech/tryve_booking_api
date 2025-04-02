const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("../utils/status.constants");
const { role } = require("../utils/user.roles.constant");
const {
  check_if_user_exist_with_Email,
  check_if_user_exist_with_id,
} = require("../utils/userExist");
const { encode_token, decode_token } = require("../utils/token_mgt");

// PAYSTACK CREDENTIALS
const paystackkey = process.env.PAY_STACK_SECRET_KEY;
const environment = process.env.PAY_STACK_ENV;
const PAYSTACK_API_BASE = "https://api.paystack.co";
//change back to dotenv
const call_back_url = process.env.FRONTEND_URL_VERIFICATION_PAGE;


// BUDPAY CREDENTIALS
const budpaySecretKey = process.env.BUD_PAY_SECRET_KEY;
const BUDPAY_API_BASE_URL = "https://api.budpay.com/api/v2/";

// To initialise payment process
async function paystackApiCall(userData) {
  const { amount, email, country_code } = userData;

  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackkey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          email,
          currency: country_code,
          callback_url: call_back_url,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`);
    }
    // console.log(response)
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// To verify payment status
async function paystackTransactionVerifictionApiCall(reference) {
  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackkey}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`);
    }
    const text = await response.text();
    const data = JSON.parse(text);
    // console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: error.message });
  }
}

async function budpayApiCall(userData) {
  //const {email, amount, card}
}

class PaymentController {
    
  static async checkout(req, res) {
    try {
      if (!req.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      } else {
        const foundUser = await check_if_user_exist_with_Email(req.body.email);
        if (!foundUser) {
          res
            .status(status?.HTTP_400_BAD_REQUEST)
            .json({ status: 400, message: "User Not found" });
        } else {
          const userData = await User.findOne({
            email: req.body.email,
          }).populate("payment course");

          // const isDiscount = checkIfDiscountIsValid;
          // let discountPrice = 0;
          // if (isDiscount && foundUser.payment == null) {
          //   discountPrice = req.body.amount;
          // }
          const data = {
            email: req.body?.email,
            amount: req?.body?.amount,
            country_code: req?.body?.country_code,
          };

          if (
            foundUser?.payment === null ||
            userData?.payment?.paymentBalance > 0
          ) {
            const result = await paystackApiCall(data);
            res.status(status?.HTTP_201_CREATED).json({
              status: 201,
              data: result?.data?.authorization_url,
              reference: result?.data?.reference,
              message: `Payment Initialization successful`,
            });
          } else {
            return res.status(status.HTTP_400_BAD_REQUEST).json({
              status: 400,
              message:
                "You must complete your previous course before registering for a new one.",
            });
          }
        }
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async verify_payment(req, res) {
    try {
      if (!req.params.reference) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request params" });
      } else {
        const { reference } = req.params;
        const isPaymentVerified = await paystackTransactionVerifictionApiCall(
          reference
        );
        // console.log(isPaymentVerified)
        if (!isPaymentVerified.status) {
          res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({
            status: 500,
            message: "Transaction not successfull and payment not verified",
          });
        } else {
          const paymentUserDetails = isPaymentVerified?.data;
          // console.log(paymentUserDetails);
        //   if (paymentUserDetails.status !== "success") {
        //     res
        //       .status(status?.HTTP_400_BAD_REQUEST)
        //       .json({ status: 400, message: "Payment not verified" });
        //   } else {
        //     const foundUser = await check_if_user_exist_with_Email(
        //       paymentUserDetails?.customer?.email
        //     );
        //     if (!foundUser) {
        //       res
        //         .status(status?.HTTP_400_BAD_REQUEST)
        //         .json({ status: 400, message: "Student account Not found" });
        //     } else {

        //       if (paymentUserDetails?.currency === "NGN") {
        //         const checkPayment = await User.findOne({
        //           email: paymentUserDetails?.customer?.email,
        //         }).populate("payment course");

        //         if (
        //           checkPayment?.payment != null &&
        //           checkPayment?.payment?.paymentBalance > 0
        //         ) {
        //           const currentPayment = await Payment.findById({
        //             _id: checkPayment?.payment?._id,
        //           });
        //           // fix payment balance for discount
        //           const paymentBalance = currentPayment?.paymentBalance - paymentUserDetails?.amount / 100;

        //           currentPayment.amountPaid = Number(
        //             currentPayment?.amountPaid + paymentUserDetails?.amount / 100
        //           );
        //           currentPayment.paymentBalance = Number(paymentBalance);
        //           await currentPayment.save();
        //           foundUser.is_active = true;
        //           foundUser.is_student = true;
        //           await foundUser.save();
        //           res.status(status.HTTP_201_CREATED).json({
        //             status: 201,
        //             data: currentPayment,
        //             message: "Payment Balance successfull updated",
        //           });
        //           return;
        //         } else {
        //           const prefererdCourse = await Course.findById({
        //             _id: foundUser.course,
        //           });
        //           const coursePrice = prefererdCourse.price;
        //           const courseHalfPrice = prefererdCourse.price / 2;

        //           const paymentBalance = Number(prefererdCourse.price) - Number(paymentUserDetails?.amount / 100);
        //           const order = await Payment.create({
        //             course: foundUser.course,
        //             student: foundUser?._id,
        //             paymentMode: "paystack",
        //             amountPaid: Number(paymentUserDetails?.amount / 100),
        //             paymentBalance: Number(paymentBalance),
        //             paymentStatus: paymentUserDetails?.status,
        //             paymentHistory: [Number(paymentUserDetails?.amount / 100)],
        //             paymentAmountData: {
        //               coursePrice: coursePrice,
        //               firstInstallment: courseHalfPrice,
        //               secondInstallment: prefererdCourse.price / 4,
        //               thirdInstallment: prefererdCourse.price / 4,
        //             },
        //             paymentAmountArray: [
        //               courseHalfPrice,
        //               prefererdCourse.price / 4,
        //               prefererdCourse.price / 4,
        //             ],
        //             balanceArray: [
        //               prefererdCourse.price / 2,
        //               prefererdCourse.price / 4,
        //               0,
        //             ],
        //           });

        //           foundUser.is_active = true;
        //           foundUser.is_student = true;
        //           foundUser.role = role?.STUDENT;
        //           foundUser.payment = order?._id;
        //           await foundUser.save();
        //           res.status(status.HTTP_201_CREATED).json({
        //             status: 201,
        //             data: order,
        //             message: "Payment successful and student account updated",
        //           });
        //         }
        //       } else {
        //         const checkPayment = await User.findOne({
        //           email: paymentUserDetails?.customer?.email,
        //         }).populate("payment course");

        //         if (
        //           checkPayment?.payment != null &&
        //           checkPayment?.payment?.paymentBalance > 0
        //         ) {
        //           const currentPayment = await Payment.findById({
        //             _id: checkPayment?.payment?._id,
        //           });

        //           const paymentBalance =
        //             currentPayment?.paymentBalance -
        //             paymentUserDetails?.amount / 100;

        //           currentPayment.amountPaid = Number(
        //             currentPayment.amountPaid + paymentUserDetails?.amount / 100
        //           );
        //           currentPayment.paymentBalance = Number(paymentBalance);
        //           await currentPayment.save();
        //           foundUser.is_active = true;
        //           foundUser.is_student = true;
        //           await foundUser.save();
        //           res.status(status.HTTP_201_CREATED).json({
        //             status: 201,
        //             data: currentPayment,
        //             message: "Payment Balance successfull updated",
        //           });
        //         } else {
                 

        //           const prefererdCourse = await Course.findById({
        //             _id: foundUser.course,
        //           });
        //           const coursePrice = prefererdCourse.dollarPrice;
        //           const courseHalfPrice = prefererdCourse.dollarPrice / 2;

        //           const paymentBalance = Number(prefererdCourse?.dollarPrice) - Number(paymentUserDetails?.amount / 100);
        //           const order = await Payment.create({
        //             course: foundUser.course,
        //             student: foundUser?._id,
        //             paymentMode: "paystack",
        //             amountPaid: Number(paymentUserDetails?.amount / 100),
        //             paymentBalance: Number(paymentBalance),
        //             paymentStatus: paymentUserDetails?.status,
        //             paymentHistory: [Number(paymentUserDetails?.amount / 100)],
        //             paymentAmountData: {
        //               coursePrice: coursePrice,
        //               firstInstallment: courseHalfPrice,
        //               secondInstallment: prefererdCourse.dollarPrice / 4,
        //               thirdInstallment: prefererdCourse.dollarPrice / 4,
        //             },
        //             paymentAmountArray: [
        //               courseHalfPrice,
        //               prefererdCourse.dollarPrice / 4,
        //               prefererdCourse.dollarPrice / 4,
        //             ],
        //             balanceArray: [
        //               prefererdCourse.dollarPrice / 2,
        //               prefererdCourse.dollarPrice / 4,
        //               0,
        //             ],
        //           });

        //           foundUser.is_active = true;
        //           foundUser.is_student = true;
        //           foundUser.payment = order._id;
        //           foundUser.role = role?.STUDENT;
        //           await foundUser.save();
        //           res.status(status.HTTP_201_CREATED).json({
        //             status: 201,
        //             data: order,
        //             message: "Payment successfull and student account updated",
        //           });
        //         }
        //       }
        //     }
        //   }
        }
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async destroy() {
    try {
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }
}

module.exports = PaymentController;
