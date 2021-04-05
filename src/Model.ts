type ReturnType = void;
type PartialCallback<T> = (value: Partial<T> | undefined) => Promise<ReturnType> | ReturnType;
type Callback<T> = (value: T) =>  Promise<ReturnType> | ReturnType;
type TranformationCallback<T> = (input: T) => Promise<Partial<T> | undefined> | Partial<T> | undefined;

/**
 * 🧱 Model has an immutable state that can be set to a new version of the state.
 * Whenever a change to the state occurs, all listeners are notified.
 * Listeners can register to specific members within the state
 * to only trigger when something relevant to them changes.
 */
export class Model<T> {
    private static LISTEN_LOOP_LIMIT = 10;
    private _onChangeCallbacks: readonly PartialCallback<T>[] = [];
    private _changeAggregate: Partial<T> | undefined;
    private _changeMicrotask: (() => void) | undefined;
    public constructor(private _state: T) { }
    /**
     * 👂 Callback is triggered when specific members are changed.
     */
    public listen(memberKeys: (keyof T)[], callback: Callback<T>) {
        this._onChangeCallbacks = [
            ...this._onChangeCallbacks,
            (delta) => {
                if (delta == null) {
                    return;
                }
                const keyChanged = (Object.keys(delta) as (keyof T)[]).
                    reduce((changeRelevant, deltaKey) => {
                        if (changeRelevant) {
                            return changeRelevant;
                        }
                        return memberKeys.find(key => key == deltaKey) != null;
                    }, false);
                if (!keyChanged) {
                    return;
                }
                return callback(this._state);
            },
        ];
    }

    /**
     * 🙌 Callback is triggered when specific members are changed.
     * Callback required to return a new object containing specified output members.
     * Output is applied immediately to the state.
     */
    public respond(memberKeys: (keyof T)[], transformation: TranformationCallback<T>) {
        this.listen(memberKeys, async state => {
            const result = await transformation(state);
            this.state = {
                ...this.state,
                ...result,
            };
        });
    }

    public merge(partialState: Partial<T>) {
        this.state = {
            ...this.state,
            ...partialState,
        };
    }

    /**
     * 🏃‍♀️ Immutable state of the model.
     * Getting the state should return an object that can't be mutated.
     * Setting the state replaces the existing state with an entirely new state,
     * checks for changes to members and notifies related listeners.
     */
    public get state(): T {
        return this._state;
    }
    public set state(value: T) {
        const delta = (Object.keys(value) as (keyof T)[]).
            reduce<Partial<T>>((delta, changeKey) => {
                if (value[changeKey] == this._state[changeKey]) {
                    return delta;
                }
                return {
                    ...delta,
                    [changeKey]: value[changeKey],
                };
            }, {});
        this._changeAggregate = { ...this._changeAggregate, ...delta };
        this._state = value;
        this.triggerChangeMicrotask();
    }

    /**
     * 💣 Full refresh of all member of the state. All listeners of this model are triggered.
     */
    public fullRefresh() {
        this._changeAggregate = this._state;
        this.triggerChangeMicrotask();
    }

    private triggerChangeMicrotask() {
        if (this._changeMicrotask != null) {
            return;
        }
        this._changeMicrotask = () => {
            let aggregateIteration:  Partial<T> | undefined = undefined;
            let loopCount = 0;
            while (aggregateIteration != this._changeAggregate) {
                aggregateIteration = this._changeAggregate;
                this._changeAggregate = undefined;
                this._onChangeCallbacks.forEach(async callback => {
                    try {
                        await callback(aggregateIteration)
                    } catch (e) {
                        console.error(e);
                    }
                });
                // ♻ Infinite loop limit
                loopCount ++;
                if (loopCount > Model.LISTEN_LOOP_LIMIT) {
                    console.error("Model loop limit reached! Listeners are codependant!");
                    break;
                }
            }
            this._changeMicrotask = undefined;
        };

        Promise.resolve().then(this._changeMicrotask);
    }
}