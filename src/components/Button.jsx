import "./Button.css";

function Button({
    children,
    variant = "primary",
    isActive = false,
    className = "",
    type = "button",
    ...props
}) {
    const classes = [
        "app-button",
        `app-button--${variant}`,
        isActive ? "app-button--active" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
}

export default Button;