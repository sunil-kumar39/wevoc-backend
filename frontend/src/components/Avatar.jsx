export default function Avatar({
    name,
    src,
    size = "md",
    onClick,
    showPreview = false,
}) {
    const letter =
        name
            ? name[0].toUpperCase()
            : "?";

    const handleClick = (e) => {
        e.stopPropagation();

        if (onClick) {
            onClick(e);
            return;
        }

        if (showPreview && src) {
            window.dispatchEvent(
                new CustomEvent("wevoc:image-preview", {
                    detail: {
                        src,
                        name: name || "Profile image",
                    },
                })
            );
        }
    };

    const clickable =
        Boolean(onClick) ||
        (showPreview && Boolean(src));

    const cls =
        `avatar av-${size}${
            clickable ? " clickable" : ""
        }`;

    return (
        <div
            className={cls}
            onClick={
                clickable
                    ? handleClick
                    : undefined
            }
            role={
                clickable
                    ? "button"
                    : undefined
            }
            tabIndex={
                clickable
                    ? 0
                    : undefined
            }
            onKeyDown={(e) => {
                if (
                    clickable &&
                    (e.key === "Enter" ||
                        e.key === " ")
                ) {
                    e.preventDefault();
                    handleClick(e);
                }
            }}
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