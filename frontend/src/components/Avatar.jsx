export default function Avatar({
    name,
    src,
    size = "md",
    onClick,
}) {

    const letter =
        name
            ? name[0].toUpperCase()
            : "?";


    const cls =
        `avatar av-${size}${
            onClick
                ? " clickable"
                : ""
        }`;


    return (

        <div
            className={cls}
            onClick={onClick}
            role={
                onClick
                    ? "button"
                    : undefined
            }
        >

            {src ? (

                <img
                    src={src}
                    alt={name || "User"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit",
                    }}
                />

            ) : (

                letter

            )}

        </div>

    );

}
