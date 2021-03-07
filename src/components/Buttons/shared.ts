export const buttonBase =
  "font-bold transition-all duration-100 clickable focus:outline-none focus:ring";

export const defaultButtonBase = `${buttonBase} inline-flex items-center justify-center shadow hover:shadow-lg`;

export const buttonVariants = {
  ghost: "text-gray-600 hover:text-gray-800",
};

export const buttonSizes = {
  small: "py-1 px-2 text-sm",
  default: "py-2 px-4",
  large: "text-xl py-3 px-5 md:text-2xl md:py-6 md:px-8",
};

export type CommonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Marking the Button as active elevates it sligthly. This signals a choosen Option.
   */
  active?: boolean;
};
