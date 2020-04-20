import { HtmlBuilder } from './Util.HtmlBuilder';
import { VideoTimerStyles as Styles } from './VideoTimer.Styles';
import { Model } from './Model';

export namespace VideoTimerEntry {
    export function initializeClient() {
        const body = HtmlBuilder.assignToElement(document.body, {
            style: {
                fontSize: 20,
            },
        });
        const outline = HtmlBuilder.createChild(body, {
            type: "div",
            style: {
                ...Styles.outline,
                gridTemplateRows: "3em 1fr 2em",
                gridTemplateAreas: `
                    "t t t"
                    ". a ."
                    "f f f"
                `,
            },
        });
        const header = HtmlBuilder.createChild(outline, {
            type: "div",
            style: {
                gridArea: "t",

                ...Styles.centered,

                backgroundColor: "green",
                borderRadius: "5px",
                padding: "0.5em",
            },
        });
        HtmlBuilder.createChild(header, {
            type: "div",
            style: {
                ...Styles.text,
            },
            attributes: {
                innerHTML: "🎥🎞",
            },
        });

        const appSpace = HtmlBuilder.createChild(outline, {
            type: "div",
            style: {
                gridArea: "a",
                ...Styles.centered,
                gridTemplateAreas: `
                    "p"
                    "t"
                    "g"
                `,
            },
        });

        // 🏭 Where the magic happens
        {
            let model = new Model({
                isRecording: false,
                startTime: 0,
                markers: [],
            });

            const startRecording = HtmlBuilder.createChild(appSpace, {
                type: "div",
                style: {
                    gridArea: "p",
                    ...Styles.button,
                },
                attributes: {
                    innerHTML: "⏯",
                    onclick: () => {
                        if (model.state.isRecording) {
                            model.mutate({
                                isRecording: false,
                                startTime: Date.now(),
                            });
                        } else {
                            model.mutate({
                                isRecording: true,
                            });
                        }
                    },
                },
            });

            model.listen(["isRecording"], state => {
                startRecording.innerHTML = state.isRecording ? "🛑" : "⏯";
            });

            model.listen(["isRecording"], state => {
                if (state.isRecording != false ||
                    state.startTime != 0) {
                    return;
                }
                const durationMS = Date.now() - state.startTime;
                const totalSeconds = Math.round(durationMS / 1000);
                const totalMinutes = Math.round(totalSeconds / 60);
                const hours = Math.round(totalMinutes / 60);
                const remainingMinutes = totalMinutes - hours * 60;
                const remainingSeconds = totalSeconds - totalMinutes * 60;
                const durationReadable = `${
                    hours > 0 ? `${hours}h ` : ""
                    }${
                    remainingMinutes > 0 ? `${remainingMinutes}m ` : ""
                    }${
                    remainingSeconds > 0 ? `${remainingSeconds}m ` : ""
                    }`;
                console.log(`
                        Duration: ${durationReadable}
                        Raw markers: ${ markers}
                    `);
                console.log(`📝 Require output file in the future 🚀`);
            });

            const timer = HtmlBuilder.createChild(appSpace, {
                type: "div",
                style: {
                    gridArea: "t",
                    ...Styles.text,
                    fontSize: 36,
                },
                attributes: {
                    innerHTML: "0:00:000",
                },
            });
            const buttonGrid = HtmlBuilder.createChild(appSpace, {
                type: "div",
                style: {
                    ...Styles.centered,
                    gridGap: "0.5em",
                    gridTemplateColumns: "auto auto auto auto",
                    gridAutoRows: "auto",
                    gridAutoFlow: "row",
                },
            });
            const markers = ["✨", "✂", "❌", "✔", "❓"].map(icon =>
                HtmlBuilder.createChild(buttonGrid, {
                    type: "div",
                    style: Styles.button,
                    attributes: {
                        innerHTML: `${icon}`,
                    },
                })
            );
        }

        const footer = HtmlBuilder.createChild(outline, {
            type: "div",
            style: {
                gridArea: "f",
                display: "grid",
                gridTemplateAreas: `
                    "w a s"
                    `
            },
        });

        const warning = HtmlBuilder.createChild(footer, {
            type: "div",
            style: {
                gridArea: "w",
                ...Styles.text,
                fontSize: 16,
            },
            attributes: {
                innerHTML: "For personal use only.",
            },
        });

        const appName = HtmlBuilder.createChild(footer, {
            type: "div",
            style: {
                gridArea: "a",
                ...Styles.text,
                fontSize: 16,
            },
            attributes: {
                innerHTML: "video_timer",
            },
        });

        const socials = HtmlBuilder.createChild(footer, {
            type: "div",
            style: {
                gridArea: "s",
                ...Styles.text,
                fontSize: 16,
            },
            attributes: {
                innerHTML: "😸github.com/TacticalDan 🕊@tactical_dan",
            },
        });
    }
}

// 👇 Client entry point
VideoTimerEntry.initializeClient();