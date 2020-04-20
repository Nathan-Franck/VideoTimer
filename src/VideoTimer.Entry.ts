import { HtmlBuilder } from './Util.HtmlBuilder';
import { VideoTimerStyles as Styles } from './VideoTimer.Styles';
import { Model } from './Model';

export namespace VideoTimerEntry {
    interface StringConstructor {
        format: (formatString: string, ...replacement: any[]) => string;
    }
    export function initializeClient() {
        const head = HtmlBuilder.assignToElement(document.head, {
            attributes: {
                innerHTML: `
                    ${document.head.innerHTML}
                    <title>Video Timer</title>
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="viewport" content="height=device-height,width=device-width,initial-scale=1,user-scalable=no" />
                `,
            },
        });
        const body = HtmlBuilder.assignToElement(document.body, {
            style: {
                fontSize: 20,
            },
        });
        const outline = HtmlBuilder.createChild(body, {
            type: "div",
            style: {
                ...Styles.outline,
                gridTemplateRows: "3em 1fr 3em",
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

                borderColor: "green",
                borderStyle: "solid",
                borderRadius: "10px",
                padding: "0.5em",
            },
        });
        HtmlBuilder.createChild(header, {
            type: "div",
            style: {
                ...Styles.text,
            },
            attributes: {
                innerHTML: "🎥 video_timer 📝",
            },
        });

        const appSpace = HtmlBuilder.createChild(outline, {
            type: "div",
            style: {
                gridArea: "a",
                ...Styles.centered,
                gridTemplateRows: "auto 3em auto",
                gridTemplateAreas: `
                    "p"
                    "t"
                    "g"
                `,
            },
        });

        // 🏭 Where the magic happens
        {
            let model = new Model<State>({
                startTime: undefined,
                endTime: undefined,
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
                        if (model.state.startTime != null &&
                            model.state.endTime == null) {
                            model.mutate({
                                endTime: Date.now(),
                            });
                        } else {
                            model.mutate({
                                startTime: Date.now(),
                                endTime: undefined,
                            });
                        }
                    },
                },
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
                    gridTemplateColumns: "auto auto auto",
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

            model.listen(["startTime", "endTime"], state => {
                startRecording.innerHTML = state.startTime == null || state.endTime != null ? "⏯" : "🛑";
            });

            model.listen(["endTime"], state => {
                if (state.endTime == null) {
                    return;
                }
                const durationReadable = getReadableDuration(state);

                console.log(`Total Time: ${durationReadable} [h:m:s]
Raw markers: ${ state.markers.reduce((result, marker) => `${result}, ${marker}`, "")}`);

                console.log(`📝 Require output file in the future 🚀`);
            });

            const updateTimer = () => {
                const ms = Date.now();
                const blinkState = model.state.endTime == null ? false : Math.round(ms / 500) % 2 == 0;
                timer.innerHTML = blinkState ? "🤚" : getReadableDuration(model.state);
                requestAnimationFrame(updateTimer);
            };
            requestAnimationFrame(updateTimer);
        }

        const footer = HtmlBuilder.createChild(outline, {
            type: "div",
            style: {
                gridArea: "f",
                display: "grid",
                ...Styles.centered,
                //gridTemplateColumns: "2fr 1fr 2fr",
                gridGap: "1em",
                margin: "0.5em",
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
                fontSize: 12,
                textAlign: "left",
                alignSelf: "left",
                justifySelf: "left",
            },
            attributes: {
                innerHTML: "for personal use only.",
            },
        });

        const socials = HtmlBuilder.createChild(footer, {
            type: "div",
            style: {
                gridArea: "s",
                ...Styles.text,
                fontSize: 12,
                textAlign: "right",
                justifySelf: "right",
            },
            attributes: {
                innerHTML: "😸github.com/TacticalDan 🕊@tactical_dan",
            },
        });
    }

    type State = {
        startTime: number | undefined,
        endTime: number | undefined,
        markers: { time: number, note: string }[]
    };

    function getReadableDuration(state: State) {
        const durationMS = (state.endTime ?? Date.now()) - (state.startTime ?? Date.now());
        const totalSeconds = Math.round(durationMS / 1000);
        const totalMinutes = Math.round(totalSeconds / 60);
        const hours = Math.round(totalMinutes / 60);
        const remainingMinutes = `0${totalMinutes - hours * 60}`.slice(-2);
        const remainingSeconds = `0${totalSeconds - totalMinutes * 60}`.slice(-2);
        const durationReadable = `${hours}:${remainingMinutes}:${remainingSeconds}`;
        return durationReadable;
    }
}

// 👇 Client entry point
VideoTimerEntry.initializeClient();