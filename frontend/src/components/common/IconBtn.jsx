export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "submit",   // 👈 default changed from "button" to "submit"
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`flex items-center justify-center outline-none ${
        outline
          ? "border border-yellow-50 bg-transparent"
          : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 hover:bg-black hover:text-yellow-50 duration-300 ${customClasses}`}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}
