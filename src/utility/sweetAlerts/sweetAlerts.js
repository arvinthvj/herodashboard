import Swal from "sweetalert2";
import { themeBlueColor, themeYellowColor } from "../constants/constants";
export const sweetSuccessAlert = (title, text, buttonText) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonText: buttonText,
  });
};

export const showConfirmAlert = (title, subtitle, callBack, cancelCallBack) => {
  return Swal.fire({
    title: title,
    text: subtitle,
    icon: "",
    showCancelButton: true,
    confirmButtonColor: themeYellowColor,
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
  }).then((result) => {
    if (result.value) {
      callBack();
    } else if (result.dismiss) {
      // cancelCallBack();
    }
  });
};
