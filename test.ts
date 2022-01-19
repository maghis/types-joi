import * as joi from "types-joi";
import { InterfaceFrom } from "types-joi";

const schema = joi
    .object({
        test: joi
            .string()
            .required()
            .default("baz")
            .valid("baz" as const, "bar" as const),
        val: joi.number().optional(),
        inner: joi
            .object({
                a: joi.string(),
                b: joi.number()
            })
            .required(),
        values: joi
            .array()
            .required()
            .items(joi.string().required()),
        buf: joi.binary().required(),
        allowNullButRequired: joi.string().allow(null).required(),
    })
    .required();

type SchemaInterface = InterfaceFrom<typeof schema>;

const stringArray = joi.array().items(joi.string());

const either = joi.alternatives([joi.string(), joi.number()]).required();

const test = joi
    .number()
    .optional()
    .required();

const metricsApiSchema = joi
    .object({
        field: joi.number().required(),
        stringish: joi.string()
    })
    .required();

type Matching = InterfaceFrom<typeof metricsApiSchema>;

const aString = joi.string().required();
const len = aString.length;

function handleObj(obj: Matching) {
    const test: number = obj.field
}
type PickNot<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? undefined : T[P];
};

const sample = {
    hello: "test",
    bla: true
};

type SampleType = typeof sample;

const someObject = undefined as any as PickNot<SampleType, "hello">;
const someOther = joi.object().pattern(/test/, joi.string().required());
const thing = joi.attempt(undefined, someOther)["test"];

(async () => {
    const res = await schema.validate({ test: "aaa" });

    const foo = res.test;

    if (foo !== "bar") {
        const bar: "baz" = foo;
    }

    const buf: Buffer = joi.attempt(undefined, schema).buf;

    const result: Matching = joi.attempt(undefined, metricsApiSchema);
    const someNumber: number = result.field;
})();

const emptyObj = joi.object();
