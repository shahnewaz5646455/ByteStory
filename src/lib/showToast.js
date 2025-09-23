import { toast } from "sonner";

export const showToast = (type, message) => {
  switch (type) {
    case "info":
      toast(message, { description: "ℹ️ Info message" });
      break;
    case "success":
      toast.success(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};
