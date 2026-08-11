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
        `avatar av-${size}${onClick ? " clickable" : ""}`;


    return (

        <div
            className={cls}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            style={{
                overflow: "hidden",
                position: "relative",
            }}
        >

            {src ? (

                <img
                    src={src}
                    alt={name || "Avatar"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />

            ) : (

                letter

            )}

        </div>

    );

}