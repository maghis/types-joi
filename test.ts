import * as joi from "joi";
import { InterfaceFrom } from "joi";

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
        buf: joi.binary().required()
    })
    .required();

type SchemaInterface = InterfaceFrom<typeof schema>;

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
