/**
 * An Ok type representing a successful result.
 */
type OkBase<Ok> = { type: 'ok'; value: Ok };

/**
 * An Err type representing a failed result.
 */
type ErrBase<Err> = { type: 'err'; error: Err };

/**
 * A simple ResultBase type to represent success or failure.
 */
export type ResultBase<Ok, Err> = OkBase<Ok> | ErrBase<Err>;

/**
 * A Result type that can represent either a successful value or an error.
 *
 * When the `type` is 'ok', the `value` property will contain the successful result.
 * When the `type` is 'err', the `error` property will contain the error information.
 */
export type Result<Ok, Err> =
    | (OkBase<Ok> & ResultProto<Ok, never>)
    | (ErrBase<Err> & ResultProto<never, Err>);

/**
 * A Result type that includes utility methods.
 */
export type ResultProto<Ok, Err> = {
    isOk(): this is { type: 'ok'; value: Ok };
    isErr(): this is { type: 'err'; error: Err };
    map<NewOk>(fn: (value: Ok) => NewOk): Result<NewOk, Err>;
    mapErr<NewErr>(fn: (error: Err) => NewErr): Result<Ok, NewErr>;
};

const resultProto = Object.freeze({
    isErr<Ok, Err>(this: Result<Ok, Err>): this is { type: 'err'; error: Err } {
        return this.type === 'err';
    },
    isOk<Ok, Err>(this: Result<Ok, Err>): this is { type: 'ok'; value: Ok } {
        return this.type === 'ok';
    },
    map<Ok, Err, NewOk>(
        this: Result<Ok, Err>,
        fn: (value: Ok) => NewOk,
    ): Result<NewOk, Err> {
        if (this.type === 'ok')
            return createResult<NewOk, Err>({
                type: 'ok',
                value: fn(this.value),
            });
        else
            return createResult<NewOk, Err>({ error: this.error, type: 'err' });
    },
    mapErr<Ok, Err, NewErr>(
        this: Result<Ok, Err>,
        fn: (error: Err) => NewErr,
    ): Result<Ok, NewErr> {
        if (this.type === 'err')
            return createResult<Ok, NewErr>({
                error: fn(this.error),
                type: 'err',
            });
        else return createResult<Ok, NewErr>({ type: 'ok', value: this.value });
    },
});

/**
 * Helper function to create a Result object with the appropriate prototype.
 * @param res The base result object containing either an Ok value or an Err error.
 * @returns A Result object with utility methods attached.
 */
const createResult = <Ok, Err>(res: ResultBase<Ok, Err>): Result<Ok, Err> => {
    const obj = Object.create(resultProto) as Result<Ok, Err>;
    if (res.type === 'ok') {
        obj.type = 'ok';
        (obj as OkBase<Ok>).value = res.value;
    } else {
        obj.type = 'err';
        (obj as ErrBase<Err>).error = res.error;
    }
    return obj;
};

/**
 * Create an Ok result.
 * @param value The value to wrap in an Ok result.
 * @returns A Result object representing success.
 */
const ok = <Ok, Err>(value: Ok): Result<Ok, Err> =>
    createResult({ type: 'ok', value });

/**
 * Create an Err result.
 * @param error The error to wrap in an Err result.
 * @returns A Result object representing failure.
 */
const err = <Ok, Err>(error: Err): Result<Ok, Err> =>
    createResult({ error, type: 'err' });

/**
 * Execute a synchronous function and capture its result as a Result type.
 * @param fn The function to execute, which may throw an error.
 * @returns The result of Ok or Err.
 */
const trySync = <Ok, Err = unknown>(fn: () => Ok): Result<Ok, Err> => {
    try {
        return ok<Ok, Err>(fn());
    } catch (e) {
        return err<Ok, Err>(e as Err);
    }
};

/**
 * Execute an asynchronous function and capture its result as a Result type.
 * @param promise The promise to execute, which may reject with an error.
 * @returns The result of Ok or Err depending.
 */
const tryAsync = async <Ok, Err = unknown>(
    promise: Promise<Ok>,
): Promise<Result<Ok, Err>> => {
    try {
        const value = await promise;
        return ok<Ok, Err>(value);
    } catch (e) {
        return err<Ok, Err>(e as Err);
    }
};

/**
 * Result functions.
 */
export const Result = {
    err,
    ok,
    try: tryAsync,
    trySync,
};
