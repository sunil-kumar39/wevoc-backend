import { useMemo } from "react";

export function Waveform({ playing = false, bars = 30 }) {
    const heights = useMemo(() => {
        const pattern = [
            8, 14, 20, 11, 17, 24, 13, 19, 9, 22,
            16, 12, 25, 15, 20, 10, 18, 23, 14, 8,
            19, 12, 24, 16, 10, 21, 15, 18, 11, 20,
        ];

        return Array.from(
            { length: bars },
            (_, index) => pattern[index % pattern.length]
        );
    }, [bars]);

    const litBars = Math.floor(bars * 0.35);

    return (
        <div
            className="waveform-wrap"
            aria-label={playing ? "Audio playing" : "Audio waveform"}
        >
            {heights.map((height, index) => {
                const isLit =
                    playing && index < litBars;

                return (
                    <div
                        key={index}
                        className="wv-bar"
                        style={{
                            width: 3,
                            height,
                            opacity: isLit ? 1 : 0.25,

                            animation: playing
                                ? `lv-anim ${
                                      0.5 +
                                      (index % 5) * 0.12
                                  }s ease-in-out ${
                                      index * 0.03
                                  }s infinite`
                                : "none",
                        }}
                    />
                );
            })}
        </div>
    );
}


/*
 * Live recording waveform
 *
 * Used while microphone is recording.
 */
export function LiveBars({ count = 13 }) {
    return (
        <div
            className="live-wv"
            aria-label="Recording audio"
        >
            {Array.from(
                { length: count },
                (_, index) => (
                    <div
                        key={index}
                        className="lv-bar"
                        style={{
                            animationDelay: `${
                                index * 0.07
                            }s`,
                        }}
                    />
                )
            )}
        </div>
    );
}
