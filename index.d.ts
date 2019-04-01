type ErrorType = Error;
type Callback<T> = ((err: null, value: T) => void) | ((err: ErrorType, value: null) => void);

type DefaultMethod<T> = (context: any) => T;

interface ValidateFail<T> extends Promise<T> {
    readonly error: ErrorType;
    readonly value: any;
}

interface ValidateSuccess<T> extends Promise<T> {
    readonly error: null;
    readonly value: T;
}

type ValidateResult<T> = ValidateSuccess<T> | ValidateFail<T>;

type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

interface BaseSchema<T> {
    readonly schemaType: TypeName<NonNullable<T>>;
    validate(value: any, options?: any, callback?: any): ValidateResult<T>;
}

interface Extensions<T> {
    description(desc: string): T;
    notes(notes: string[]): T;
    tags(tags: string[]): T;
    meta(meta: any): T;
    example(...values: any[]): T;
    unit(name: string): T;
    label(name: string): T;
    options(options: any): T;
    strict(isStrict: boolean): T;
    error(err: any, options: any): T;
    describe(): any;
}

interface AnySchema<T> extends BaseSchema<T>, Extensions<Schema<T>> {
    allow<U>(values: readonly U[]): Schema<T | U>;
    allow<U>(...values: readonly U[]): Schema<T | U>;

    valid<U>(values: readonly U[]): Schema<U>;
    valid<U>(...values: readonly U[]): Schema<U>;

    required(): Schema<NonNullable<T>>;
    optional(): Schema<T | undefined>;

    forbidden(): Schema<never>;
    strip(): Schema<never>;

    default(value: T, description?: string): Schema<NonNullable<T>>;
    default(value: DefaultMethod<T> & { description: string }): Schema<T>;
    default(value: DefaultMethod<T>, description: string): Schema<T>;

    // // concat<U>(schema: Schema<U>): Schema<T | U>;
    // // when(condition, options)

    // raw(isRaw: boolean): Schema<any>;
    // empty(schema: T | Schema<T>): Schema<T | undefined>;
    // empty(): Schema<NonNullable<T>>;
}

type ArrayComparator<T> = (a: T, b: T) => boolean;
interface ArrayUniqueOptions {
    ignoreUndefined: boolean;
}

interface ArraySchema<T = any[] | undefined> extends AnySchema<T> {
    // sparse([enabled])
    // single([enabled])
    items<U>(schema: BaseSchema<U>): T extends undefined
        ? Schema<U[] | undefined>
        : Schema<U[]>;
    // ordered(type)

    min(limit: number): Schema<T>;
    max(limit: number): Schema<T>;
    length(limit: number): Schema<T>;
    unique(comparator: ArrayComparator<T> | string, options: ArrayUniqueOptions): Schema<T>;
    // has(schema)
}

interface BooleanSchema<T> extends AnySchema<T> {
    truthy(value: any | any[]): Schema<T>;
    falsy(value: any | any[]): Schema<T>;
    insensitive(enabled?: boolean): Schema<T>;
}

interface BinarySchema<T> extends AnySchema<T> {
    encoding(encoding: string): Schema<T>
    min(limit: number): Schema<T>
    max(limit: number): Schema<T>
    length(limit: number): Schema<T>
}

type DateType = Date | "now" | number | string;
interface DateSchema<T> extends AnySchema<T> {
    min(date: DateType): Schema<T>;
    max(date: DateType): Schema<T>;
    greater(date: DateType): Schema<T>;
    less(date: DateType): Schema<T>;
    iso(): Schema<T>;
    timestamp(type?: "javascript" | "unix"): Schema<T>;
}

interface NumberSchema<T> extends AnySchema<T> {
    unsafe(enabled?: boolean): Schema<T>
    min(limit: number): Schema<T>
    max(limit: number): Schema<T>
    greater(limit: number): Schema<T>
    less(limit: number): Schema<T>
    integer(): Schema<T>
    precision(limit: number): Schema<T>
    multiple(base: number): Schema<T>
    positive(): Schema<T>
    negative(): Schema<T>
    port(): Schema<T>
}

interface RegexOptions {
    name?: string;
    invert?: boolean;
}

interface StringSchema<T> extends AnySchema<T> {
    insensitive(): Schema<T>
    min(limit: number, encoding?: string): Schema<T>
    max(limit: number, encoding?: string): Schema<T>
    truncate(enabled?: boolean): Schema<T>
    creditCard(): Schema<T>
    length(limit: number, encoding?: boolean): Schema<T>
    regex(pattern: RegExp, name?: string): Schema<T>
    regex(pattern: RegExp, options?: RegexOptions): Schema<T>
    replace(pattern: RegExp | string, replacement: string): Schema<T>
    alphanum(): Schema<T>
    token(): Schema<T>
    email(options?: any): Schema<T>
    ip(options?: any): Schema<T>
    uri(options?: any): Schema<T>
    guid(): Schema<T>
    hex(options?: any): Schema<T>
    base64(options?: any): Schema<T>
    dataUri(options?: any): Schema<T>
    hostname(): Schema<T>
    normalize(options?: any): Schema<T>
    lowercase(): Schema<T>
    uppercase(): Schema<T>
    trim(enabled?: boolean): Schema<T>
    isoDate(): Schema<T>
}

type SchemaMap<T> = {
    [P in keyof T]: Schema<T[P]>
};

interface ObjectSchema<T> extends AnySchema<T> {
}

type Schema<T> =
    NonNullable<T> extends any[] ? ArraySchema<T> :
    NonNullable<T> extends boolean ? BooleanSchema<T> :
    NonNullable<T> extends Buffer ? BinarySchema<T> :
    NonNullable<T> extends Date ? DateSchema<T> :
    NonNullable<T> extends number ? NumberSchema<T> :
    NonNullable<T> extends string ? StringSchema<T> :
    ObjectSchema<T>;

declare module "types-joi" {
    function attempt<T>(value: any, schema: BaseSchema<T>, message?: string | Error): T;
    type InterfaceFrom<T extends BaseSchema<any>> = T extends BaseSchema<infer U> ? U : never;

    function array(): Schema<any[] | undefined>;
    function boolean(): Schema<boolean | undefined>;
    function binary(): Schema<Buffer | undefined>;
    function date(): Schema<Date | undefined>;
    function number(): Schema<number | undefined>;
    function string(): Schema<string | undefined>;
    function object<T>(map: SchemaMap<T>): Schema<T | undefined>;
}
